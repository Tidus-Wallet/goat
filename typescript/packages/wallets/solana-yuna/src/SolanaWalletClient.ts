import { WalletClientBase } from "@nycrypto/goat-core";
import { AddressLookupTableAccount, type Connection, PublicKey } from "@solana/web3.js";
import type { SolanaTransaction } from "./types";

export type SolanWalletClientCtorParams = {
    connection: Connection;
    yunaAPIKey: string;
};

export abstract class SolanaWalletClient extends WalletClientBase {
    protected connection: Connection;
    yunaAPIKey: string;

    constructor(params: SolanWalletClientCtorParams) {
        super();
        this.connection = params.connection;
        this.yunaAPIKey = params.yunaAPIKey;
    }

    getChain() {
        return {
            type: "solana",
        } as const;
    }

    getConnection() {
        return this.connection;
    }

    async balanceOf(address: string) {
        const res = await fetch(`https://api.yunaapi.com/v1/balance?address=${address}&blockchain=solana`, {
            headers: {
                Authorization: `bearer ${this.yunaAPIKey}`,
            },
        });
        console.log("I dey called");

        if (res.status !== 200) {
            throw new Error("Failed to get balance.");
        }

        const data = (await res.json()) as { tokens: Record<string, unknown>[] };
        console.log(data);

        return data.tokens
            .filter((v) => v !== null)
            .map((token) => {
                return {
                    decimals: token.decimals,
                    symbol: token.symbol,
                    name: token.name,
                    value: token.balance,
                    mintAddress: token.address,
                    icon: token.icon,
                    usd: token.usd,
                };
            });
    }

    abstract sendTransaction(transaction: SolanaTransaction): Promise<{ hash: string }>;

    protected async getAddressLookupTableAccounts(keys: string[]): Promise<AddressLookupTableAccount[]> {
        const addressLookupTableAccountInfos = await this.connection.getMultipleAccountsInfo(
            keys.map((key) => new PublicKey(key)),
        );

        return addressLookupTableAccountInfos.reduce((acc, accountInfo, index) => {
            const addressLookupTableAddress = keys[index];
            if (accountInfo) {
                const addressLookupTableAccount = new AddressLookupTableAccount({
                    key: new PublicKey(addressLookupTableAddress),
                    state: AddressLookupTableAccount.deserialize(accountInfo.data),
                });
                acc.push(addressLookupTableAccount);
            }

            return acc;
        }, new Array<AddressLookupTableAccount>());
    }
}
