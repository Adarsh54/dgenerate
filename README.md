# Sora Guesser - TikTok-style Video Guessing Game with Token Rewards

A Solana-based application where users guess the prompts for Sora-generated videos and earn token rewards. Built with Anchor framework.

## Features

- 🎥 **Video Challenges**: Create and solve video guessing challenges
- 🪙 **Token Rewards**: Earn tokens for correct guesses (starts at 100 tokens)
- 📉 **Reward Halving**: Rewards are halved every 100,000 tokens minted
- 🔐 **Secure**: Built on Solana with proper authority controls
- 🧪 **Tested**: Comprehensive test suite included

## Architecture

### Smart Contract Functions

1. **`initialize`** - Sets up the game state and token mint
2. **`create_video_challenge`** - Creates a new video challenge with correct prompt
3. **`submit_guess`** - Submits a guess and rewards tokens if correct
4. **`update_reward`** - Admin function to update reward amount (authority only)

### Key Components

- **GameState**: Tracks total minted tokens, current reward, and halving threshold
- **VideoChallenge**: Stores video ID, correct prompt, creator, and solution status
- **Token Minting**: Automatic token minting to winner's wallet
- **Reward Halving**: Automatic reward reduction every 100,000 tokens

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/download/)
- [Rust](https://rustup.rs/)
- [Solana CLI](https://docs.solana.com/cli/install-solana-cli-tools)
- [Anchor Framework](https://www.anchor-lang.com/docs/installation)

### Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Build the program: `anchor build`
4. Run tests: `anchor test`

### Usage

#### Initialize the Game
```typescript
await program.methods
  .initialize()
  .accounts({
    gameState: gameStatePDA,
    tokenMint: tokenMint,
    gameAuthority: gameAuthorityPDA,
    authority: authority.publicKey,
    payer: payer.publicKey,
    tokenProgram: TOKEN_PROGRAM_ID,
    systemProgram: SystemProgram.programId,
  })
  .signers([authority, payer])
  .rpc();
```

#### Create a Video Challenge
```typescript
await program.methods
  .createVideoChallenge("video_123", "A cat playing with a ball of yarn")
  .accounts({
    videoChallenge: videoChallengePDA,
    creator: creator.publicKey,
    systemProgram: SystemProgram.programId,
  })
  .signers([creator])
  .rpc();
```

#### Submit a Guess
```typescript
await program.methods
  .submitGuess("A cat playing with a ball of yarn")
  .accounts({
    videoChallenge: videoChallengePDA,
    gameState: gameStatePDA,
    tokenMint: tokenMint,
    gameAuthority: gameAuthorityPDA,
    guesser: guesser.publicKey,
    guesserTokenAccount: guesserTokenAccount,
    tokenProgram: TOKEN_PROGRAM_ID,
  })
  .signers([guesser])
  .rpc();
```

## Token Economics

- **Initial Reward**: 100 tokens per correct guess
- **Halving Mechanism**: Rewards are halved every 100,000 tokens minted
- **Example Progression**:
  - 0-99,999 tokens: 100 tokens per guess
  - 100,000-199,999 tokens: 50 tokens per guess
  - 200,000-299,999 tokens: 25 tokens per guess
  - And so on...

## Security Features

- **Authority Controls**: Only authorized users can update rewards
- **Single Solution**: Each video challenge can only be solved once
- **PDA Security**: Uses Program Derived Addresses for secure token minting
- **Overflow Protection**: All arithmetic operations use checked math

## Testing

The project includes comprehensive tests covering:
- Game initialization
- Video challenge creation
- Correct guess submission and token rewards
- Prevention of solving already solved challenges
- Authority-based reward updates
- Reward halving mechanism

Run tests with: `anchor test`

## Project Structure

```
sora_guesser/
├── programs/
│   └── sora_guesser/
│       └── src/
│           └── lib.rs          # Main program logic
├── tests/
│   └── sora-guesser.ts          # Test suite
├── Anchor.toml                  # Anchor configuration
├── package.json                 # Dependencies
└── README.md                    # This file
```

## Deployment

1. Build the program: `anchor build`
2. Deploy to devnet: `anchor deploy --provider.cluster devnet`
3. Deploy to mainnet: `anchor deploy --provider.cluster mainnet`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is licensed under the MIT License.