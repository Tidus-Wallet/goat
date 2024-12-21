import { createTool, Tool } from "@nycrypto/goat-core";
import { GetBalanceSchema, GetTransactionHistorySchema } from "./parameters";

export class YunaService {
    constructor(private readonly apiKey: string) {}

    @Tool({
        description: "Get the balance of an address on a blockchain.",
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

        return await res.json();
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
