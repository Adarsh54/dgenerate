import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { SoraGuesser } from "../target/types/sora_guesser";
import {
  TOKEN_PROGRAM_ID,
  createMint,
  createAccount,
  mintTo,
  getAccount,
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

  before(async () => {
    // Find PDA for game authority
    const [authority, bump] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("game_authority")],
      program.programId
    );
    gameAuthority = authority;
    gameBump = bump;

    // Create token mint
    tokenMint = await createMint(
      provider.connection,
      provider.wallet.payer,
      gameAuthority,
      null,
      9 // 9 decimals
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
        payer: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    const state = await program.account.gameState.fetch(gameState);
    assert.ok(state.tokenMint.equals(tokenMint));
    assert.equal(state.totalMinted.toNumber(), 0);
    assert.equal(state.currentReward.toNumber(), 100);
  });

  it("Rewards winner with tokens", async () => {
    await program.methods
      .rewardWinner()
      .accounts({
        gameState,
        tokenMint,
        gameAuthority,
        winnerTokenAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc();

    const tokenAccount = await getAccount(provider.connection, winnerTokenAccount);
    assert.equal(tokenAccount.amount.toString(), "100");

    const state = await program.account.gameState.fetch(gameState);
    assert.equal(state.totalMinted.toNumber(), 100);
  });

  it("Halves reward after 100,000 tokens", async () => {
    // Simulate minting up to halving threshold
    for (let i = 0; i < 999; i++) {
      await program.methods
        .rewardWinner()
        .accounts({
          gameState,
          tokenMint,
          gameAuthority,
          winnerTokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .rpc();
    }

    const state = await program.account.gameState.fetch(gameState);
    assert.equal(state.currentReward.toNumber(), 50); // Reward should be halved
    assert.ok(state.totalMinted.toNumber() < 100000); // Total minted should reset
  });
});
