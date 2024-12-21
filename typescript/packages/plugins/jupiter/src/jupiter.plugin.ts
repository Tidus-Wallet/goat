import { type Chain, PluginBase } from "@nycrypto/goat-core";
import { JupiterService } from "./jupiter.service";

export class JupiterPlugin extends PluginBase {
    constructor() {
        super("jupiter", [new JupiterService()]);
    }

    supportsChain = (chain: Chain) => chain.type === "solana";
}

export const jupiter = () => new JupiterPlugin();
