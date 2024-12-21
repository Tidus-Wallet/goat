import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

import { getOnChainTools } from "@nycrypto/goat-adapter-vercel-ai";
import { sendSOL, solana } from "@nycrypto/goat-wallet-solana-yuna";

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
            yunaAPIKey:
                "CrD_ygebvqZ3QbFLjynI9zRqoqpEOfMhT4XkAcLJArDuA2nv5CLOyoHhK-R9dTnWZEKc6kOF1Z46EBAlUp633rJM3KGKlQaGIqbB",
        }),
        plugins: [sendSOL(), jupiter(), splToken()],
    });

    const result = await generateText({
        model: openai("gpt-4o"),
        tools: tools,
        maxSteps: 10,
        prompt: "send 100 of the token with mint address 7XxBrmmxg4f8gUuBRV6DZ7uRaXYcSMqEyGRgRe4ZwZwg to HDHuqxc1PJJPvHKSLXhVxbKXmPK9SkwSH2wBfdVj2X2v",
    });

    console.log(result.text);
})();
