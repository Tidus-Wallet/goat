import { type Chain, PluginBase } from "@nycrypto/goat-core";
import type { EVMWalletClient } from "@nycrypto/goat-wallet-evm";
import { mode } from "viem/chains";
import { KimService } from "./kim.service";

const SUPPORTED_CHAINS = [mode];

export class KimPlugin extends PluginBase<EVMWalletClient> {
    constructor() {
        super("kim", [new KimService()]);
    }

    supportsChain = (chain: Chain) => chain.type === "evm" && SUPPORTED_CHAINS.some((c) => c.id === chain.id);
}

export const kim = () => new KimPlugin();
