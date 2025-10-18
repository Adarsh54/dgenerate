# Sora Guesser Token Program

A Solana smart contract for the Sora video guessing game that rewards players with tokens for correct guesses.

## Features

- Custom SPL token for rewards
- Initial reward of 100 tokens per correct guess
- Automatic reward halving after every 100,000 tokens minted
- Secure token distribution to winner's wallet

## Contract Structure

The program consists of two main instructions:

1. `initialize` - Sets up the game state and token mint
2. `reward_winner` - Mints and transfers tokens to winners

## Development Setup

1. Install Solana Tool Suite
2. Install Anchor Framework
3. Install project dependencies:
```bash
yarn install
```

## Building

```bash
anchor build
```

## Testing

```bash
anchor test
```

## Deployment

1. Update program ID in `Anchor.toml` and `lib.rs`
2. Deploy to desired Solana cluster:
```bash
anchor deploy
```

## Security Considerations

- The program uses PDA for mint authority
- Implements overflow checks for token calculations
- Validates all account constraints
