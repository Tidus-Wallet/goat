import { Tool } from "@nycrypto/goat-core";
import { SolanaWalletClient } from "@nycrypto/goat-wallet-solana";
import {
    createAssociatedTokenAccountInstruction,
    createTransferInstruction,
    getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import { PublicKey, type TransactionInstruction } from "@solana/web3.js";
import {
    ConvertToBaseUnitParameters,
    GetTokenBalanceByMintAddressParameters,
    GetTokenMintAddressBySymbolParameters,
    TransferTokenByMintAddressParameters,
} from "./parameters";
import { type Token } from "./tokens";
import { doesAccountExist } from "./utils/doesAccountExist";
import { getTokenByMintAddress } from "./utils/getTokenByMintAddress";

export class SplTokenService {
    private tokens: Token[] | undefined;
    private walletClient: SolanaWalletClient;

    constructor(walletClient: SolanaWalletClient) {
        this.walletClient = walletClient;
    }

    @Tool({
        description:
            "Get the SPL token info by its symbol, returning the mint address, decimals, dailyVolume, and name",
    })
    async getTokenInfoBySymbol(parameters: GetTokenMintAddressBySymbolParameters) {
        const tokens = await fetch("https://tokens.jup.ag/tokens?tags=verified");
        this.tokens = await tokens.json();
        const token = this.tokens?.find((token) => token.symbol.toLowerCase() === parameters.symbol.toLowerCase());
        return {
            symbol: token?.symbol,
            mintAddress: token?.address,
            decimals: token?.decimals,
            name: token?.name,
            dailyVolume: token?.daily_volume,
        };
    }

    @Tool({
        description: "Get the balance of an SPL token by its mint address",
    })
    async getTokenBalanceByMintAddress(parameters: GetTokenBalanceByMintAddressParameters) {
        const { walletAddress, mintAddress } = parameters;
        try {
            const tokenAccount = getAssociatedTokenAddressSync(
                new PublicKey(mintAddress),
                new PublicKey(walletAddress),
            );

            const accountExists = await doesAccountExist(this.walletClient.getConnection(), tokenAccount);

            if (!accountExists) {
                return 0;
            }

            const balance = await this.walletClient.getConnection().getTokenAccountBalance(tokenAccount);

            return balance;
        } catch (error) {
            throw new Error(`Failed to get token balance: ${error}`);
        }
    }

    @Tool({
        description: "Transfer an SPL token by its mint address. The amount is not in base units.",
        name: "transfer_token_by_mint_address",
    })
    async transferTokenByMintAddress(parameters: TransferTokenByMintAddressParameters) {
        const { to, mintAddress, amount } = parameters;

        const token = await getTokenByMintAddress(mintAddress, this.walletClient.getConnection());
        if (!token) {
            throw new Error(`Token with mint address ${mintAddress} not found`);
        }

        const tokenMintPublicKey = new PublicKey(mintAddress);
        const fromPublicKey = new PublicKey(this.walletClient.getAddress());
        const toPublicKey = new PublicKey(to);

        const fromTokenAccount = getAssociatedTokenAddressSync(tokenMintPublicKey, fromPublicKey);
        const toTokenAccount = getAssociatedTokenAddressSync(tokenMintPublicKey, toPublicKey);

        const [fromAccountExists, toAccountExists] = await Promise.all([
            doesAccountExist(this.walletClient.getConnection(), fromTokenAccount),
            doesAccountExist(this.walletClient.getConnection(), toTokenAccount),
        ]);

        if (!fromAccountExists) {
            throw new Error(`From account ${fromTokenAccount.toBase58()} does not exist`);
        }

        const instructions: TransactionInstruction[] = [];

        if (!toAccountExists) {
            instructions.push(
                createAssociatedTokenAccountInstruction(fromPublicKey, toTokenAccount, toPublicKey, tokenMintPublicKey),
            );
        }
        instructions.push(
            createTransferInstruction(
                fromTokenAccount,
                toTokenAccount,
                fromPublicKey,
                BigInt(amount) * BigInt(10) ** BigInt(token.decimals),
            ),
        );

        return await this.walletClient.sendTransaction({ instructions });
    }

    @Tool({
        description: "Convert an amount of an SPL token to its base unit",
    })
    async convertToBaseUnit(parameters: ConvertToBaseUnitParameters) {
        const { amount, decimals } = parameters;
        const baseUnit = amount * 10 ** decimals;
        return baseUnit;
    }
}
