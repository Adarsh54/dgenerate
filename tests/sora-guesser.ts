import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { SoraGuesser } from "../target/types/sora_guesser";
import {
  TOKEN_PROGRAM_ID,
  createMint,
  createAccount,
  mintTo,
  getAccount,
  setAuthority,
  AuthorityType,
} from "@solana/spl-token";
import { assert } from "chai";

describe("sora-guesser", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.SoraGuesser as Program<SoraGuesser>;
  
  let tokenMint: anchor.web3.PublicKey;
  let gameState: anchor.web3.PublicKey;
  let winnerTokenAccount: anchor.web3.PublicKey;
  let gameAuthority: anchor.web3.PublicKey;
  let gameBump: number;
  let authority: anchor.web3.Keypair;
  let creator: anchor.web3.Keypair;
  let guesser: anchor.web3.Keypair;

  before(async () => {
    // Generate keypairs
    authority = anchor.web3.Keypair.generate();
    creator = anchor.web3.Keypair.generate();
    guesser = anchor.web3.Keypair.generate();

    // Airdrop SOL to keypairs
    await provider.connection.requestAirdrop(authority.publicKey, 2 * anchor.web3.LAMPORTS_PER_SOL);
    await provider.connection.requestAirdrop(creator.publicKey, 2 * anchor.web3.LAMPORTS_PER_SOL);
    await provider.connection.requestAirdrop(guesser.publicKey, 2 * anchor.web3.LAMPORTS_PER_SOL);

    // Wait for airdrops to confirm
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Find PDA for game authority
    const [authorityPDA, bump] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("game_authority")],
      program.programId
    );
    gameAuthority = authorityPDA;
    gameBump = bump;

    // Create token mint
    tokenMint = await createMint(
      provider.connection,
      provider.wallet.payer,
      provider.wallet.publicKey, // Initial mint authority
      null,
      9 // 9 decimals
    );

    // Set the game authority as the mint authority
    await setAuthority(
      provider.connection,
      provider.wallet.payer,
      tokenMint,
      gameAuthority,
      AuthorityType.MintTokens,
      provider.wallet.publicKey
    );

    // Create winner's token account
    winnerTokenAccount = await createAccount(
      provider.connection,
      provider.wallet.payer,
      tokenMint,
      provider.wallet.publicKey
    );

    // Generate game state address
    gameState = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("game_state")],
      program.programId
    )[0];
  });

  it("Initializes the game", async () => {
    await program.methods
      .initialize()
      .accounts({
        gameState,
        tokenMint,
        gameAuthority,
        authority: authority.publicKey,
        payer: provider.wallet.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([authority])
      .rpc();

    const state = await program.account.gameState.fetch(gameState);
    assert.ok(state.tokenMint.equals(tokenMint));
    assert.equal(state.totalMinted.toNumber(), 0);
    assert.equal(state.currentReward.toNumber(), 100);
    assert.equal(state.halvingThreshold.toNumber(), 100000);
  });


  it("Rewards user when API returns true", async () => {
    // Create recipient's token account
    const recipientTokenAccount = await createAccount(
      provider.connection,
      guesser,
      tokenMint,
      guesser.publicKey
    );

    // Get initial token balance
    const initialBalance = await getAccount(provider.connection, recipientTokenAccount);
    const initialAmount = Number(initialBalance.amount);

    // Call reward_user with API response = true
    await program.methods
      .rewardUser(true, guesser.publicKey)
      .accounts({
        gameState,
        tokenMint,
        gameAuthority,
        recipientTokenAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc();

    // Verify tokens were minted
    const finalBalance = await getAccount(provider.connection, recipientTokenAccount);
    const finalAmount = Number(finalBalance.amount);
    assert.equal(finalAmount - initialAmount, 100);

    // Verify game state updated
    const gameStateAccount = await program.account.gameState.fetch(gameState);
    assert.equal(gameStateAccount.totalMinted.toNumber(), 100);
  });

  it("Does not reward user when API returns false", async () => {
    // Create recipient's token account
    const recipientTokenAccount = await createAccount(
      provider.connection,
      guesser,
      tokenMint,
      guesser.publicKey
    );

    // Get initial token balance
    const initialBalance = await getAccount(provider.connection, recipientTokenAccount);
    const initialAmount = Number(initialBalance.amount);

    try {
      // Call reward_user with API response = false
      await program.methods
        .rewardUser(false, guesser.publicKey)
        .accounts({
          gameState,
          tokenMint,
          gameAuthority,
          recipientTokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .rpc();
      
      assert.fail("Should have thrown an error");
    } catch (error) {
      assert.include(error.message, "InvalidApiResponse");
    }

    // Verify no tokens were minted
    const finalBalance = await getAccount(provider.connection, recipientTokenAccount);
    const finalAmount = Number(finalBalance.amount);
    assert.equal(finalAmount - initialAmount, 0);
  });

  it("Updates reward amount (authority only)", async () => {
    const newReward = 200;

    await program.methods
      .updateReward(new anchor.BN(newReward))
      .accounts({
        gameState,
        authority: authority.publicKey,
      })
      .signers([authority])
      .rpc();

    const gameStateAccount = await program.account.gameState.fetch(gameState);
    assert.equal(gameStateAccount.currentReward.toNumber(), newReward);
  });

  it("Prevents unauthorized reward updates", async () => {
    const newReward = 300;

    try {
      await program.methods
        .updateReward(new anchor.BN(newReward))
        .accounts({
          gameState,
          authority: guesser.publicKey, // Using wrong authority
        })
        .signers([guesser])
        .rpc();
      
      assert.fail("Should have thrown an error");
    } catch (error) {
      assert.include(error.message, "Unauthorized");
    }
  });

  it("Halves reward after 100,000 tokens", async () => {
    // Reset reward to 100 for this test
    await program.methods
      .updateReward(new anchor.BN(100))
      .accounts({
        gameState,
        authority: authority.publicKey,
      })
      .signers([authority])
      .rpc();

    // Simulate minting up to halving threshold
    for (let i = 0; i < 999; i++) {
      await program.methods
        .rewardUser(true, guesser.publicKey)
        .accounts({
          gameState,
          tokenMint,
          gameAuthority,
          recipientTokenAccount: winnerTokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .rpc();
    }

    const state = await program.account.gameState.fetch(gameState);
    assert.equal(state.currentReward.toNumber(), 50); // Reward should be halved
    assert.ok(state.totalMinted.toNumber() < 100000); // Total minted should reset
  });
});
