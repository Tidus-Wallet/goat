import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

import { getOnChainTools } from "@nycrypto/goat-adapter-vercel-ai";
import { sendSOL, solana } from "@nycrypto/goat-wallet-solana";

import { Connection, Keypair } from "@solana/web3.js";

import { jupiter } from "@nycrypto/goat-plugin-jupiter";
import { splToken } from "@nycrypto/goat-plugin-spl-token";
import base58 from "bs58";

require("dotenv").config();

const connection = new Connection(process.env.SOLANA_RPC_URL as string);
const keypair = Keypair.fromSecretKey(base58.decode(process.env.SOLANA_PRIVATE_KEY as string));

(async () => {
    const tools = await getOnChainTools({
        wallet: solana({
            keypair,
            connection,
        }),
        plugins: [sendSOL(), jupiter(), splToken()],
    });

    const result = await generateText({
        model: openai("gpt-4o-mini"),
        tools: tools,
        maxSteps: 10,
        prompt: "What's my wallet address",
    });

    console.log(result.text);
})();
