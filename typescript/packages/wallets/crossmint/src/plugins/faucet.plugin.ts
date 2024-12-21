import type { CrossmintApiClient } from "@crossmint/common-sdk-base";
import { Chain, PluginBase } from "@nycrypto/goat-core";
import type { EVMWalletClient } from "@nycrypto/goat-wallet-evm";
import { isChainSupportedByFaucet } from "../chains";
import { CrossmintFaucetService } from "./faucet.service";

export class FaucetPlugin extends PluginBase<EVMWalletClient> {
    constructor(client: CrossmintApiClient) {
        super("faucet", [new CrossmintFaucetService(client)]);
    }

    supportsChain(chain: Chain) {
        if (chain.type !== "evm") {
            return false;
        }

        if (!chain.id) {
            return false;
        }

        return isChainSupportedByFaucet(chain.id);
    }
}

export function faucetPlugin(client: CrossmintApiClient) {
    return () => {
        return new FaucetPlugin(client);
    };
}
