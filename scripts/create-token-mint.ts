import { createMint } from "@solana/spl-token";
import "dotenv/config";
import {
  getExplorerLink,
  getKeypairFromEnvironment,
} from "./helpers";
import { Connection, clusterApiUrl } from "@solana/web3.js";

async function main() {
  const connection = new Connection(clusterApiUrl("devnet"));

  const user = getKeypairFromEnvironment("SECRET_KEY");

  console.log(
    `🔑 Loaded our keypair securely, using an env file! Our public key is: ${user.publicKey.toBase58()}`
  );

  console.log("🪙 Creating Sora Token Mint...");

  // Create the token mint
  const tokenMint = await createMint(
    connection,
    user, // payer
    user.publicKey, // mint authority (who can mint tokens)
    null, // freeze authority (null = no freeze authority)
    9 // decimals (9 is standard for most tokens)
  );

  console.log(`✅ Created token mint: ${tokenMint.toBase58()}`);

  const link = getExplorerLink("address", tokenMint.toBase58(), "devnet");
  console.log(`🔗 Token Mint Explorer: ${link}`);

  // Save the token mint address for later use
  console.log("\n📝 Save this token mint address for the next steps:");
  console.log(`TOKEN_MINT_ADDRESS="${tokenMint.toBase58()}"`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
