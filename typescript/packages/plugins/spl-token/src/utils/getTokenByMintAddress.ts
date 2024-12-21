import { Connection, PublicKey } from "@solana/web3.js";
import { SPL_TOKENS, type SolanaNetwork } from "../tokens";
import { getTokensForNetwork } from "./getTokensForNetwork";
import { getMint } from "@solana/spl-token";

export async function getTokenByMintAddress(mintAddress: string, connection: Connection) {
    // const tokensForNetwork = getTokensForNetwork(network, SPL_TOKENS);
    // const token = tokensForNetwork.find((token) => token.mintAddress === mintAddress);
    // return token || null;
    const token = await getMint(connection, new PublicKey(mintAddress));
    return { decimals: token.decimals };
}
