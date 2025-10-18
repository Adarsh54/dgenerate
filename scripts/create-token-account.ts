import { getOrCreateAssociatedTokenAccount } from "@solana/spl-token";
import "dotenv/config";
import {
  getExplorerLink,
  getKeypairFromEnvironment,
} from "./helpers";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";

async function main() {
  const connection = new Connection(clusterApiUrl("devnet"));

  const user = getKeypairFromEnvironment("SECRET_KEY");

  console.log(
    `🔑 Loaded our keypair securely, using an env file! Our public key is: ${user.publicKey.toBase58()}`
  );

  // Replace with your token mint address from create-token-mint.ts
  const TOKEN_MINT_ADDRESS = "A95DNgauC8GGePkGVGdTBUnEzxBvBxx5fSAxpAfaWbMj";

  const tokenMintAccount = new PublicKey(TOKEN_MINT_ADDRESS);

  // Create an associated token account for our wallet
  const recipient = user.publicKey;

  console.log("🪙 Creating Associated Token Account...");

  const tokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    user,
    tokenMintAccount,
    recipient
  );

  console.log(`✅ Token Account: ${tokenAccount.address.toBase58()}`);

  const link = getExplorerLink("address", tokenAccount.address.toBase58(), "devnet");
  console.log(`🔗 Token Account Explorer: ${link}`);

  console.log("\n📝 Save this token account address for minting tokens:");
  console.log(`TOKEN_ACCOUNT_ADDRESS="${tokenAccount.address.toBase58()}"`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
