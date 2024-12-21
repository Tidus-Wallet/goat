import { type Chain, PluginBase } from "@nycrypto/goat-core";
// import { arbitrum, avalanche, base, mainnet, optimism, polygon } from "viem/chains";
import { YunaService } from "./yuna.service";

// const SUPPORTED_CHAINS = [mainnet, polygon, avalanche, base, optimism, arbitrum];

export class YunaPlugin extends PluginBase {
    constructor(params: { apiKey: string }) {
        super("yuna", [new YunaService(params.apiKey)]);
    }

    supportsChain = (chain: Chain) => {
        return chain.type === "solana";
        // switch (chain.type) {
        //     case 'solana':
        //         return true
        //     default:
        //         return SUPPORTED_CHAINS.some((supportedChain) => supportedChain.nam === chain.);
        // }
    };
}

export const yuna = (params: { apiKey: string }) => new YunaPlugin(params);
