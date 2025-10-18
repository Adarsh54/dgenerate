import * as anchor from "@coral-xyz/anchor";
import { 
  createMint, 
  createAccount,
  getMint,
  TOKEN_PROGRAM_ID 
} from "@solana/spl-token";
import { 
  createCreateMetadataAccountV3Instruction,
  PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID 
} from "@metaplex-foundation/mpl-token-metadata";

// This script shows how to create a token with metadata
async function createTokenWithMetadata() {
  const provider = anchor.AnchorProvider.env();
  const connection = provider.connection;
  const wallet = provider.wallet;

  // 1. Create the token mint
  const tokenMint = await createMint(
    connection,
    wallet.payer,
    wallet.publicKey, // mint authority
    null, // freeze authority
    9 // decimals
  );

  console.log("Token Mint:", tokenMint.toString());

  // 2. Create metadata account
  const metadataAccount = anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("metadata"),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      tokenMint.toBuffer(),
    ],
    TOKEN_METADATA_PROGRAM_ID
  )[0];

  // 3. Create metadata instruction
  const createMetadataInstruction = createCreateMetadataAccountV3Instruction(
    {
      metadata: metadataAccount,
      mint: tokenMint,
      mintAuthority: wallet.publicKey,
      payer: wallet.publicKey,
      updateAuthority: wallet.publicKey,
    },
    {
      createMetadataAccountArgsV3: {
        data: {
          name: "Sora Guesser Token",
          symbol: "SGT",
          uri: "https://your-metadata-uri.com/token.json", // JSON metadata
          sellerFeeBasisPoints: 0,
          creators: null,
          collection: null,
          uses: null,
        },
        isMutable: true,
        collectionDetails: null,
      },
    }
  );

  // 4. Send transaction
  const transaction = new anchor.web3.Transaction();
  transaction.add(createMetadataInstruction);

  const signature = await connection.sendTransaction(transaction, [wallet.payer]);
  console.log("Metadata created:", signature);

  return { tokenMint, metadataAccount };
}

// Example metadata JSON file (hosted at your URI)
const exampleMetadataJson = {
  "name": "Sora Guesser Token",
  "symbol": "SGT", 
  "description": "Reward token for correctly guessing Sora video prompts",
  "image": "https://your-domain.com/sora-guesser-token.png",
  "attributes": [
    {
      "trait_type": "Game",
      "value": "Sora Guesser"
    },
    {
      "trait_type": "Token Type", 
      "value": "Reward Token"
    },
    {
      "trait_type": "Blockchain",
      "value": "Solana"
    }
  ],
  "properties": {
    "files": [
      {
        "uri": "https://your-domain.com/sora-guesser-token.png",
        "type": "image/png"
      }
    ],
    "category": "image"
  }
};

export { createTokenWithMetadata, exampleMetadataJson };
