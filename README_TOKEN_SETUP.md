# Sora Token Setup Guide

This guide will help you create your Sora token mint following the [Solana Token Program course](https://solana.com/developers/courses/tokens-and-nfts/token-program).

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment
```bash
# Copy the example environment file
cp env.example .env

# Edit .env and add your Solana wallet private key
# SECRET_KEY="your_private_key_here"
```

### 3. Create Your Token Mint
```bash
npm run create-token
```

This will create your Sora token mint and output the token mint address. **Save this address!**

### 4. Create Token Account
```bash
# Update the TOKEN_MINT_ADDRESS in scripts/create-token-account.ts
# Then run:
npm run create-account
```

### 5. Mint Initial Tokens
```bash
# Update the addresses in scripts/mint-tokens.ts
# Then run:
npm run mint-tokens
```

### 6. Test Token Transfer
```bash
# Update the addresses in scripts/transfer-tokens.ts
# Then run:
npm run transfer-tokens
```

## 📋 Step-by-Step Process

### Step 1: Create Token Mint
- **What it does**: Creates the basic token mint account
- **Output**: Token mint address (save this!)
- **Command**: `npm run create-token`

### Step 2: Create Token Account  
- **What it does**: Creates an Associated Token Account to hold your tokens
- **Requirements**: Need token mint address from Step 1
- **Command**: `npm run create-account`

### Step 3: Mint Tokens
- **What it does**: Mints 1000 Sora tokens to your account
- **Requirements**: Need both addresses from Steps 1 & 2
- **Command**: `npm run mint-tokens`

### Step 4: Transfer Tokens
- **What it does**: Transfers 10 tokens to another wallet
- **Requirements**: All previous steps completed
- **Command**: `npm run transfer-tokens`

## 🔧 Token Specifications

- **Name**: Sora Token (SORA)
- **Symbol**: SORA  
- **Decimals**: 9 (standard)
- **Initial Supply**: 1000 tokens
- **Network**: Solana Devnet

## 📝 Important Addresses

After running the scripts, you'll get these important addresses:

1. **Token Mint Address**: The unique identifier for your token
2. **Token Account Address**: Where your tokens are stored
3. **Transaction Signatures**: Links to view on Solana Explorer

## 🔗 Explorer Links

All scripts will output Solana Explorer links so you can:
- View your token mint
- Check token balances
- See transaction details
- Verify everything worked correctly

## 🛠️ Troubleshooting

### Common Issues:

1. **"Please update TOKEN_MINT_ADDRESS"**
   - Run `npm run create-token` first to get your token mint address
   - Copy the address to the other scripts

2. **"Insufficient funds"**
   - Make sure you have SOL in your devnet wallet
   - Get devnet SOL from: https://faucet.solana.com/

3. **"Invalid private key"**
   - Check your .env file has the correct SECRET_KEY format
   - Private key should be base58 encoded

## 🎯 Next Steps

Once your token is created:
1. Add metadata (name, symbol, image) using Metaplex
2. Integrate with your smart contract
3. Deploy to mainnet when ready

## 📚 Resources

- [Solana Token Program Course](https://solana.com/developers/courses/tokens-and-nfts/token-program)
- [SPL Token Documentation](https://spl.solana.com/token)
- [Solana Explorer](https://explorer.solana.com/)
