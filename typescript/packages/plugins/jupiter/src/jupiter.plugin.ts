import { type Chain, PluginBase } from "@nycrypto/goat-core";
import { SolanaKeypairWalletClient } from "@nycrypto/goat-wallet-solana";
import { JupiterService } from "./jupiter.service";

export class JupiterPlugin extends PluginBase {
    constructor(walletClient: SolanaKeypairWalletClient) {
        super("jupiter", [new JupiterService(walletClient)]);
    }

    supportsChain = (chain: Chain) => chain.type === "solana";
}

export const jupiter = (params: { walletClient: SolanaKeypairWalletClient }) => new JupiterPlugin(params.walletClient);
