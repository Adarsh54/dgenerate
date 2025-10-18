import { mintTo } from "@solana/spl-token";
import "dotenv/config";
import {
  getExplorerLink,
  getKeypairFromEnvironment,
} from "./helpers";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";

async function main() {
  const connection = new Connection(clusterApiUrl("devnet"));

  // Our token has 9 decimal places (standard)
  const MINOR_UNITS_PER_MAJOR_UNITS = Math.pow(10, 9);

  const user = getKeypairFromEnvironment("SECRET_KEY");

  console.log(
    `🔑 Loaded our keypair securely, using an env file! Our public key is: ${user.publicKey.toBase58()}`
  );

  // Replace with your token mint address from create-token-mint.ts
  const TOKEN_MINT_ADDRESS = "YOUR_TOKEN_MINT_ADDRESS_HERE";

  // Replace with your token account address from create-token-account.ts
  const TOKEN_ACCOUNT_ADDRESS = "YOUR_TOKEN_ACCOUNT_ADDRESS_HERE";

  if (TOKEN_MINT_ADDRESS === "YOUR_TOKEN_MINT_ADDRESS_HERE" || TOKEN_ACCOUNT_ADDRESS === "YOUR_TOKEN_ACCOUNT_ADDRESS_HERE") {
    console.log("❌ Please update TOKEN_MINT_ADDRESS and TOKEN_ACCOUNT_ADDRESS with your actual addresses");
    process.exit(1);
  }

  const tokenMintAccount = new PublicKey(TOKEN_MINT_ADDRESS);
  const recipientAssociatedTokenAccount = new PublicKey(TOKEN_ACCOUNT_ADDRESS);

  // Mint 1000 Sora tokens (1000 * 10^9 = 1,000,000,000,000 minor units)
  const amountToMint = 1000 * MINOR_UNITS_PER_MAJOR_UNITS;

  console.log(`🪙 Minting ${1000} Sora tokens...`);

  const transactionSignature = await mintTo(
    connection,
    user, // payer
    tokenMintAccount, // mint
    recipientAssociatedTokenAccount, // destination
    user, // mint authority
    amountToMint // amount
  );

  const link = getExplorerLink("transaction", transactionSignature, "devnet");
  console.log(`✅ Success! Mint Token Transaction: ${link}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
