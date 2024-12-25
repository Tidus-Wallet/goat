import { getMint } from "@solana/spl-token";
import { Connection, PublicKey } from "@solana/web3.js";

export async function getTokenByMintAddress(mintAddress: string, connection: Connection) {
    const token = await getMint(connection, new PublicKey(mintAddress));
    return { decimals: token.decimals };
}
