import { Tool, createTool } from "@nycrypto/goat-core";
import { GetBalanceSchema, GetTransactionHistorySchema } from "./parameters";

export class YunaService {
    constructor(private readonly apiKey: string) {}

    @Tool({
        description: `Get the balance of an address on a blockchain.
        The returned balance object should look something like this:
        {
            balance: "1000000000000000000",
            usd: "1000",
            mintAddress: "0x",
            icon: "https://example.com/icon.png",
            symbol: "ETH",
            name: "Ethereum",
            decimals: 18,
        }
        `,
        name: "getBalance",
    })
    async getBalance(parameters: GetBalanceSchema) {
        const res = await fetch(
            `https://api.yunaapi.com/v1/balance?address=${parameters.address}&blockchain=${parameters.blockchain}`,
            {
                headers: {
                    Authorization: `bearer ${this.apiKey}`,
                },
            },
        );

        if (res.status !== 200) {
            throw new Error("Failed to get balance.");
        }

        const data = await res.json();

        return {
            balance: data.balance,
            usd: data.usd,
            mintAddress: data.address,
            icon: data.icon,
            symbol: data.symbol,
            name: data.name,
            decimals: data.decimals,
        };
    }

    @Tool({
        description: "Get the transaction history of an address on a blockchain.",
        name: "getTransactionHistory",
    })
    async getTransactionHistory(parameters: GetTransactionHistorySchema) {
        const res = await fetch(
            `https://api.yunaapi.com/v1/transactions?address=${parameters.address}&blockchain=${parameters.blockchain}`,
            {
                headers: {
                    Authorization: `bearer ${this.apiKey}`,
                },
            },
        );

        return await res.json();
    }
}
