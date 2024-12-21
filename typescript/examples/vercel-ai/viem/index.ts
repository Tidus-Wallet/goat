import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

import { http } from "viem";
import { createWalletClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";

import { getOnChainTools } from "@nycrypto/goat-adapter-vercel-ai";
import { PEPE, USDC, erc20 } from "@nycrypto/goat-plugin-erc20";

import { sendETH } from "@nycrypto/goat-wallet-evm";
import { viem } from "@nycrypto/goat-wallet-viem";

require("dotenv").config();

const account = privateKeyToAccount(process.env.WALLET_PRIVATE_KEY as `0x${string}`);

const walletClient = createWalletClient({
    account: account,
    transport: http(process.env.RPC_PROVIDER_URL),
    chain: sepolia,
});

(async () => {
    const tools = await getOnChainTools({
        wallet: viem(walletClient),
        plugins: [sendETH(), erc20({ tokens: [USDC, PEPE] })],
    });

    const result = await generateText({
        model: openai("gpt-4o-mini"),
        tools: tools,
        maxSteps: 5,
        prompt: "Get the balance of the USDC token",
    });

    console.log(result.text);
})();
