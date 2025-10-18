import { Keypair } from "@solana/web3.js";
import * as bs58 from "bs58";

export function getKeypairFromEnvironment(envKey: string): Keypair {
  const secret = process.env[envKey];
  if (!secret) {
    throw new Error(`Missing ${envKey} in environment variables`);
  }
  const secretKey = bs58.decode(secret);
  return Keypair.fromSecretKey(secretKey);
}

export function getExplorerLink(
  type: "transaction" | "address" | "block",
  hash: string,
  cluster: string = "mainnet-beta"
): string {
  const baseUrl = "https://explorer.solana.com";
  return `${baseUrl}/${type}/${hash}?cluster=${cluster}`;
}
