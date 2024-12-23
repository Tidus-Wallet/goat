import { type Chain, PluginBase } from "@nycrypto/goat-core";
import { SplTokenService } from "./spl-token.service";
import type { SplTokenPluginCtorParams } from "./types/SplTokenPluginCtorParams";

export class SplTokenPlugin extends PluginBase {
    constructor() {
        super("splToken", [new SplTokenService()]);
    }

    supportsChain = (chain: Chain) => chain.type === "solana";
}

export const splToken = (params?: SplTokenPluginCtorParams) => new SplTokenPlugin();
