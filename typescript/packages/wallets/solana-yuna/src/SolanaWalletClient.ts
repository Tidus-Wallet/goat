import { WalletClientBase } from "@nycrypto/goat-core";
import { AddressLookupTableAccount, type Connection, PublicKey } from "@solana/web3.js";
import { formatUnits } from "viem";
import type { SolanaTransaction } from "./types";

export type SolanWalletClientCtorParams = {
    connection: Connection;
    yunaAPIKey?: string;
};

export abstract class SolanaWalletClient extends WalletClientBase {
    protected connection: Connection;
    protected yunaAPIKey?: string;

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
        if (this.yunaAPIKey) {
            const res = await fetch(`https://api.yunaapi.com/v1/balance?address=${address}&blockchain=solana`, {
                headers: {
                    Authorization: `bearer ${this.yunaAPIKey}`,
                },
            });

            return await res.json();
        }

        const pubkey = new PublicKey(address);
        const balance = await this.connection.getBalance(pubkey);

        return {
            decimals: 9,
            symbol: "SOL",
            name: "Solana",
            value: formatUnits(BigInt(balance), 9),
            inBaseUnits: balance.toString(),
        };
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
