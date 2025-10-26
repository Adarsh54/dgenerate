import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SoraGuesser } from "../target/types/sora_guesser";
import { TOKEN_PROGRAM_ID, createMint, createAccount, getAccount, setAuthority, AuthorityType } from "@solana/spl-token";
import { assert } from "chai";
type GameState = {
  tokenMint: anchor.web3.PublicKey;
  totalMinted: anchor.BN;
  currentReward: anchor.BN;
  halvingThreshold: anchor.BN;
  authority: anchor.web3.PublicKey;
};

describe("sora-guesser", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const wallet = provider.wallet as anchor.Wallet & { payer: anchor.web3.Keypair };

  const program = anchor.workspace.SoraGuesser as Program<SoraGuesser>;
  
  let tokenMint: anchor.web3.PublicKey;
  let gameState: anchor.web3.PublicKey;
  let gameStateKeypair: anchor.web3.Keypair;
  let winnerTokenAccount: anchor.web3.PublicKey;
  let guesserTokenAccount: anchor.web3.PublicKey;
  let gameAuthority: anchor.web3.PublicKey;
  let gameBump: number;
  let authority: anchor.web3.Keypair;
  let creator: anchor.web3.Keypair;
  let guesser: anchor.web3.Keypair;

  before(async () => {
    // Create game state keypair (program does not use seeds for init)
    gameStateKeypair = anchor.web3.Keypair.generate();
    gameState = gameStateKeypair.publicKey;

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
    tokenMint = await createMint(provider.connection, wallet.payer, wallet.publicKey, null, 9);

    // Transfer mint authority from provider to the game authority PDA
    await setAuthority(
      provider.connection,
      wallet.payer,
      tokenMint,
      wallet.publicKey, // current authority
      AuthorityType.MintTokens,
      gameAuthority // new authority
    );

    // Create token accounts
    winnerTokenAccount = await createAccount(provider.connection, wallet.payer, tokenMint, wallet.publicKey);
    guesserTokenAccount = await createAccount(provider.connection, wallet.payer, tokenMint, guesser.publicKey);

  });

  it("Initializes the game", async () => {
    await program.methods
      .initialize()
      .accounts({
        gameState,
        tokenMint,
        authority: authority.publicKey,
        payer: provider.wallet.publicKey,
      })
      .signers([authority, gameStateKeypair])
      .rpc();

    const state = (await program.account.gameState.fetch(gameState)) as unknown as GameState;
    assert.ok(state.tokenMint.equals(tokenMint));
    assert.equal(state.totalMinted.toNumber(), 0);
    assert.equal(state.currentReward.toNumber(), 10000);
    assert.equal(state.halvingThreshold.toNumber(), 10000000000);
  });


  it("Mints reward to recipient", async () => {
    // Get initial token balance
    const initialBalance = await getAccount(provider.connection, guesserTokenAccount);
    const initialAmount = Number(initialBalance.amount);

    // Call reward_user
    await program.methods
      .rewardUser(guesser.publicKey)
      .accounts({
        gameState,
        tokenMint,
        recipientTokenAccount: guesserTokenAccount,
      })
      .rpc();

    // Verify tokens were minted
    const finalBalance = await getAccount(provider.connection, guesserTokenAccount);
    const finalAmount = Number(finalBalance.amount);
    assert.equal(finalAmount - initialAmount, 10000);

    // Verify game state updated
    const gameStateAccount = (await program.account.gameState.fetch(gameState)) as unknown as GameState;
    assert.equal(gameStateAccount.totalMinted.toNumber(), 10000);
  });

  it("Accumulates total minted without halving below threshold", async () => {
    const before = (await program.account.gameState.fetch(gameState)) as unknown as GameState;
    const previousTotal = before.totalMinted.toNumber();
    const previousReward = before.currentReward.toNumber();

    // Mint a few times; should not reach halving threshold (which is very large)
    const mints = 3;
    for (let i = 0; i < mints; i++) {
      await program.methods
        .rewardUser(guesser.publicKey)
        .accounts({
          gameState,
          tokenMint,
          recipientTokenAccount: guesserTokenAccount,
        })
        .rpc();
    }

    const after = (await program.account.gameState.fetch(gameState)) as unknown as GameState;
    assert.equal(after.currentReward.toNumber(), previousReward);
    assert.equal(after.totalMinted.toNumber(), previousTotal + previousReward * mints);
  });
});
