import "dotenv/config";
import {
  getExplorerLink,
  getKeypairFromEnvironment,
} from "./helpers";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";

async function main() {
  const connection = new Connection(clusterApiUrl("devnet"));

  const sender = getKeypairFromEnvironment("SECRET_KEY");

  console.log(
    `🔑 Loaded our keypair securely, using an env file! Our public key is: ${sender.publicKey.toBase58()}`
  );

  // Add the recipient public key here (you can use your own address for testing)
  const recipient = new PublicKey("YOUR_RECIPIENT_HERE");

  // Replace with your token mint address
  const TOKEN_MINT_ADDRESS = "YOUR_TOKEN_MINT_ADDRESS_HERE";

  if (TOKEN_MINT_ADDRESS === "YOUR_TOKEN_MINT_ADDRESS_HERE" || recipient.toBase58() === "YOUR_RECIPIENT_HERE") {
    console.log("❌ Please update TOKEN_MINT_ADDRESS and recipient address");
    process.exit(1);
  }

  const tokenMintAccount = new PublicKey(TOKEN_MINT_ADDRESS);

  // Our token has 9 decimal places
  const MINOR_UNITS_PER_MAJOR_UNITS = Math.pow(10, 9);

  console.log(`💸 Attempting to send 10 Sora tokens to ${recipient.toBase58()}...`);

  // Get or create the source token account
  const sourceTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    sender,
    tokenMintAccount,
    sender.publicKey
  );

  // Get or create the destination token account
  const destinationTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    sender,
    tokenMintAccount,
    recipient
  );

  // Transfer 10 tokens (10 * 10^9 = 10,000,000,000 minor units)
  const amountToTransfer = 10 * MINOR_UNITS_PER_MAJOR_UNITS;

  const signature = await transfer(
    connection,
    sender,
    sourceTokenAccount.address,
    destinationTokenAccount.address,
    sender,
    amountToTransfer
  );

  const explorerLink = getExplorerLink("transaction", signature, "devnet");
  console.log(`✅ Transaction confirmed, explorer link is: ${explorerLink}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
