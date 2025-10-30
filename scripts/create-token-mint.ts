import { createMint, setAuthority, AuthorityType } from "@solana/spl-token";
import "dotenv/config";
import {
  getExplorerLink,
  getKeypairFromEnvironment,
} from "./helpers";
import { 
  Connection, 
  clusterApiUrl, 
  PublicKey, 
  Transaction,
  TransactionInstruction,
  SystemProgram,
  SYSVAR_RENT_PUBKEY 
} from "@solana/web3.js";


const PROGRAM_ID = new PublicKey("EPKw6RHc8Bf7m8BpKxv66NMmzqwnn7tSRwcyJ9cNbNnD");
const GAME_AUTHORITY_SEED = "game_authority";

async function main() {
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  const payer = getKeypairFromEnvironment("SECRET_KEY");

  console.log(
    `🔑 Loaded our keypair securely! Public key: ${payer.publicKey.toBase58()}`
  );

  // Derive the PDA that will be the mint authority
  const [gameAuthorityPDA, bump] = PublicKey.findProgramAddressSync(
    [Buffer.from(GAME_AUTHORITY_SEED)],
    PROGRAM_ID
  );

  console.log(`🎮 Program's PDA (future mint authority): ${gameAuthorityPDA.toBase58()}`);
  console.log(`📊 PDA Bump: ${bump}`);

  console.log("\n🪙 Creating DGEN Token Mint...");
  console.log("   Step 1: Creating mint with temporary authority...");

  // Create the token mint with payer as temporary mint authority
  // We'll transfer authority to the PDA after creating metadata
  const tokenMint = await createMint(
    connection,
    payer, // payer (pays for account creation)
    payer.publicKey, // temporary mint authority (will transfer to PDA)
    null, // freeze authority (null = no freeze authority)
    9 // decimals (9 is standard for most tokens)
  );

  console.log(`✅ Created token mint: ${tokenMint.toBase58()}`);
  console.log(`   Temporary mint authority: ${payer.publicKey.toBase58()}`);

  // Token Metadata Program ID
  const TOKEN_METADATA_PROGRAM_ID = new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");

  // Derive the metadata account PDA
  const [metadataPDA] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("metadata"),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      tokenMint.toBuffer(),
    ],
    TOKEN_METADATA_PROGRAM_ID
  );

  console.log("\n📝 Creating Token Metadata...");
  console.log("   Step 2: Creating metadata on-chain...");
  console.log(`   Metadata PDA: ${metadataPDA.toBase58()}`);

  try {
    // Manually create the metadata instruction
    // Reference: https://docs.metaplex.com/programs/token-metadata/instructions#create-metadata-account
    const metadataData = {
      name: "dgenerate",
      symbol: "DGEN",
      uri: "https://ibb.co/qY3pSx5y", // Direct image link (ideally should be JSON metadata)
      sellerFeeBasisPoints: 0,
      creators: null,
    };

    // Create metadata account instruction data
    // Instruction discriminator for CreateMetadataAccountV3 = 33
    const data = Buffer.alloc(1000); // Allocate buffer
    let offset = 0;
    
    // Write instruction discriminator
    data.writeUInt8(33, offset);
    offset += 1;
    
    // Write name (string with 4-byte length prefix)
    const nameBuffer = Buffer.from(metadataData.name);
    data.writeUInt32LE(nameBuffer.length, offset);
    offset += 4;
    nameBuffer.copy(data, offset);
    offset += nameBuffer.length;
    
    // Write symbol (string with 4-byte length prefix)
    const symbolBuffer = Buffer.from(metadataData.symbol);
    data.writeUInt32LE(symbolBuffer.length, offset);
    offset += 4;
    symbolBuffer.copy(data, offset);
    offset += symbolBuffer.length;
    
    // Write URI (string with 4-byte length prefix)
    const uriBuffer = Buffer.from(metadataData.uri);
    data.writeUInt32LE(uriBuffer.length, offset);
    offset += 4;
    uriBuffer.copy(data, offset);
    offset += uriBuffer.length;
    
    // Write seller fee basis points
    data.writeUInt16LE(metadataData.sellerFeeBasisPoints, offset);
    offset += 2;
    
    // Write creators (Option<Vec<Creator>>) - None = 0
    data.writeUInt8(0, offset);
    offset += 1;
    
    // Write collection (Option) - None = 0
    data.writeUInt8(0, offset);
    offset += 1;
    
    // Write uses (Option) - None = 0
    data.writeUInt8(0, offset);
    offset += 1;
    
    // Write isMutable
    data.writeUInt8(1, offset); // true = 1
    offset += 1;
    
    // Write collection details (Option) - None = 0
    data.writeUInt8(0, offset);
    offset += 1;

    const instruction = new TransactionInstruction({
      keys: [
        { pubkey: metadataPDA, isSigner: false, isWritable: true },
        { pubkey: tokenMint, isSigner: false, isWritable: false },
        { pubkey: payer.publicKey, isSigner: true, isWritable: false },
        { pubkey: payer.publicKey, isSigner: false, isWritable: false },
        { pubkey: payer.publicKey, isSigner: true, isWritable: false },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
        { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
      ],
      programId: TOKEN_METADATA_PROGRAM_ID,
      data: data.slice(0, offset),
    });

    const tx = new Transaction().add(instruction);
    
    const signature = await connection.sendTransaction(tx, [payer], {
      skipPreflight: false,
      preflightCommitment: "confirmed",
    });

    await connection.confirmTransaction(signature, "confirmed");

    console.log(`✅ Metadata created successfully!`);
    console.log(`   Metadata Account: ${metadataPDA.toBase58()}`);
    
    const metadataLink = getExplorerLink("address", metadataPDA.toBase58(), "devnet");
    console.log(`   🔗 Metadata Explorer: ${metadataLink}`);
  } catch (error: any) {
    console.log(`⚠️  Could not create metadata on-chain (this is optional):`);
    console.log(`   ${error?.message || error}`);
    console.log(`   The token mint is still created and functional!`);
    console.log(`\n💡 You can add metadata later using Metaplex tools or CLI.`);
  }

  // Transfer mint authority to the PDA
  console.log("\n🔄 Transferring Mint Authority to Program PDA...");
  console.log("   Step 3: Setting PDA as mint authority...");
  
  try {
    await setAuthority(
      connection,
      payer, // payer
      tokenMint, // mint account
      payer, // current authority
      AuthorityType.MintTokens, // authority type
      gameAuthorityPDA // new authority (the PDA)
    );

    console.log(`✅ Mint authority transferred to PDA!`);
    console.log(`   New mint authority: ${gameAuthorityPDA.toBase58()}`);
    console.log(`   ⚠️  Only your program can now mint tokens!`);
  } catch (error) {
    console.error(`❌ Failed to transfer mint authority:`);
    console.error(`   ${error}`);
    console.error(`   You'll need to transfer authority manually later.`);
  }

  const mintLink = getExplorerLink("address", tokenMint.toBase58(), "devnet");
  const pdaLink = getExplorerLink("address", gameAuthorityPDA.toBase58(), "devnet");
  
  console.log("\n✅ Token Creation Summary:");
  console.log("━".repeat(60));
  console.log(`Token Name:       dgenerate`);
  console.log(`Token Symbol:     DGEN`);
  console.log(`Token Mint:       ${tokenMint.toBase58()}`);
  console.log(`Mint Authority:   ${gameAuthorityPDA.toBase58()} (Program PDA)`);
  console.log(`Decimals:         9`);
  console.log(`Image URL:        https://ibb.co/qY3pSx5y`);
  console.log("━".repeat(60));
  console.log(`\n🔗 Token Mint Explorer: ${mintLink}`);
  console.log(`🔗 PDA Explorer: ${pdaLink}`);

  console.log("\n📝 Environment Variables to Save:");
  console.log("━".repeat(60));
  console.log(`TOKEN_MINT_ADDRESS="${tokenMint.toBase58()}"`);
  console.log(`GAME_AUTHORITY_PDA="${gameAuthorityPDA.toBase58()}"`);
  console.log(`PROGRAM_ID="${PROGRAM_ID.toBase58()}"`);
  console.log("━".repeat(60));

  console.log("\n🎯 Next Steps:");
  console.log("1. Initialize your program with this token mint");
  console.log("2. The program can now mint tokens through reward_user()");
  console.log("3. Add metadata through Metaplex if needed (requires additional setup)");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
