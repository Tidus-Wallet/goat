import { createToolParameters } from "@nycrypto/goat-core";
import { z } from "zod";

export class GetBalanceSchema extends createToolParameters(
    z.object({
        address: z.string().describe("The address to get the balance of."),
        blockchain: z.string().describe("The blockchain to query"),
    }),
) {}

export class GetTransactionHistorySchema extends createToolParameters(
    z.object({
        address: z.string().describe("The address to get the transaction history of."),
        blockchain: z.string().describe("The blockchain to query"),
    }),
) {}
