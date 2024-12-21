import { type Chain, PluginBase } from "@nycrypto/goat-core";
import type { EVMWalletClient } from "@nycrypto/goat-wallet-evm";
import { type Token, getTokensForNetwork } from "./token";
import { getTools } from "./tools";

export type ERC721PluginCtorParams = {
    tokens: Token[];
};

export class ERC721Plugin extends PluginBase<EVMWalletClient> {
    private tokens: Token[];

    constructor({ tokens }: ERC721PluginCtorParams) {
        super("erc721", []);
        this.tokens = tokens;
    }

    supportsChain = (chain: Chain) => chain.type === "evm";

    getTools(walletClient: EVMWalletClient) {
        const network = walletClient.getChain();

        if (!network.id) {
            throw new Error("Network ID is required");
        }

        const tokenList = getTokensForNetwork(network.id, this.tokens);
        return getTools(walletClient, tokenList);
    }
}

export function erc721({ tokens }: ERC721PluginCtorParams) {
    return new ERC721Plugin({ tokens });
}
