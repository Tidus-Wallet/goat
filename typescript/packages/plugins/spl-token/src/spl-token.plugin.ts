import { type Chain, PluginBase } from "@nycrypto/goat-core";
import { SplTokenService } from "./spl-token.service";
import type { SplTokenPluginCtorParams } from "./types/SplTokenPluginCtorParams";
import { SolanaWalletClient } from "@nycrypto/goat-wallet-solana";

export class SplTokenPlugin extends PluginBase {
    constructor(walletClient: SolanaWalletClient) {
        super("splToken", [new SplTokenService(walletClient)]);
    }

    supportsChain = (chain: Chain) => chain.type === "solana";
}

export const splToken = (params: SplTokenPluginCtorParams) => new SplTokenPlugin(params.walletClient);
