# 🔑 How to Get All Required Keys

This guide will walk you through getting every key and configuration value you need to run your Sora Guesser frontend.

## Overview

You need **3 main keys** to run the application:

1. ✅ **OpenAI API Key** - For image generation
2. ⚙️ **Solana Program ID** - Your deployed smart contract
3. 🪙 **Token Mint Address** - Your custom token

---

## 1. 🤖 Getting Your OpenAI API Key

### Step 1: Create an OpenAI Account

1. Go to [https://platform.openai.com/signup](https://platform.openai.com/signup)
2. Sign up with your email or continue with Google/Microsoft
3. Verify your email address

### Step 2: Add Payment Method

1. Go to [https://platform.openai.com/account/billing/overview](https://platform.openai.com/account/billing/overview)
2. Click **"Add payment method"**
3. Add a credit/debit card
4. **Note**: You'll need at least $5-10 credit to start

**Pricing**: DALL-E 3 costs approximately:

- $0.040 per 1024×1024 standard quality image
- $0.080 per 1024×1024 HD quality image

### Step 3: Generate API Key

1. Go to [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Click **"Create new secret key"**
3. Give it a name (e.g., "Sora Guesser App")
4. Click **"Create secret key"**
5. **IMPORTANT**: Copy the key immediately! You won't be able to see it again.

Your API key will look like:

```
sk-proj-abcdefghijklmnopqrstuvwxyz123456789ABCDEFGHIJKLMNOP
```

### Step 4: Add to Environment

In your `frontend/.env.local` file:

```env
OPENAI_API_KEY=sk-proj-YOUR_ACTUAL_KEY_HERE
```

### ⚠️ Security Notes

- **NEVER** commit your API key to git
- **NEVER** expose it in client-side code
- Keep it in `.env.local` (which is gitignored)
- The key is only used server-side in API routes

---

## 2. ⚙️ Getting Your Solana Program ID

The Program ID is the address of your deployed smart contract on Solana.

### Option A: Deploy Your Program (Recommended)

#### Prerequisites

```bash
# Make sure you have these installed
solana --version
anchor --version
```

#### Step 1: Build Your Program

```bash
# From your project root
cd /path/to/sora_guesser
anchor build
```

#### Step 2: Get a Solana Wallet (If you don't have one)

```bash
# Generate a new keypair
solana-keygen new --outfile ~/.config/solana/id.json
```

#### Step 3: Get Some SOL for Deployment

**For Devnet (Free - Recommended for Testing):**

```bash
# Switch to devnet
solana config set --url devnet

# Get your wallet address
solana address

# Request airdrop (2 SOL)
solana airdrop 2

# Check balance
solana balance
```

**For Mainnet (Real SOL Required):**

```bash
# Switch to mainnet
solana config set --url mainnet-beta

# You'll need to buy SOL and transfer to your wallet
```

#### Step 4: Deploy

```bash
# Deploy to devnet
anchor deploy

# The output will show:
# Program Id: Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS
```

**Copy the Program ID** from the output!

#### Step 5: Add to Environment

```env
NEXT_PUBLIC_PROGRAM_ID=Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS
```

### Option B: Use Existing Program ID

If you already deployed, you can find your Program ID in:

1. **Anchor.toml** file:

```toml
[programs.devnet]
sora_guesser = "Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS"
```

2. **Or run**:

```bash
solana address -k target/deploy/sora_guesser-keypair.json
```

---

## 3. 🪙 Getting Your Token Mint Address

The Token Mint is the address of your custom SPL token.

### Step 1: Make Sure Program is Deployed

You need your program deployed first (see section 2 above).

### Step 2: Create Your Token

**From your project root**, run:

```bash
# This will create a new SPL token
npm run create-token
```

Or manually:

```bash
# Navigate to scripts
cd scripts

# Run the token creation script
npx esrun create-token-mint.ts
```

### Step 3: Copy the Token Mint Address

The script will output:

```
✅ Token mint created: 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU
```

**Copy this address!**

### Step 4: Initialize the Game

After creating the token, you need to initialize the game state:

```bash
# From project root
anchor test
```

Or manually call the initialize function.

### Step 5: Add to Environment

```env
NEXT_PUBLIC_TOKEN_MINT=7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU
```

**Also update** in `frontend/components/TokenBalance.tsx` line 10:

```typescript
const TOKEN_MINT = new PublicKey(
  "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"
);
```

---

## 4. 📝 Complete .env.local Example

After getting all keys, your `frontend/.env.local` should look like:

```env
# OpenAI API Key (for image generation)
OPENAI_API_KEY=sk-proj-abcdefghijklmnopqrstuvwxyz123456789

# Solana Network Configuration
NEXT_PUBLIC_SOLANA_NETWORK=devnet

# Program ID (from anchor deploy)
NEXT_PUBLIC_PROGRAM_ID=Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS

# Token Mint Address (from create-token script)
NEXT_PUBLIC_TOKEN_MINT=7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU

# Custom RPC Endpoint (optional)
NEXT_PUBLIC_RPC_ENDPOINT=
```

---

## 5. 🔍 Verification Checklist

Before running your app, verify:

- [ ] OpenAI API key starts with `sk-`
- [ ] OpenAI account has payment method added
- [ ] Solana program is deployed (`anchor deploy` completed)
- [ ] Program ID is in Anchor.toml
- [ ] Token mint is created (`npm run create-token` completed)
- [ ] Game state is initialized (run `anchor test`)
- [ ] All keys are in `frontend/.env.local`
- [ ] Token mint is updated in `TokenBalance.tsx`

---

## 6. 🧪 Testing Your Setup

### Test OpenAI Integration

```bash
# From frontend directory
cd frontend

# Start the development server
npm run dev
```

Visit `http://localhost:3000` and try viewing an image.

### Test Wallet Connection

1. Install Phantom wallet browser extension
2. Create/import a wallet
3. Switch to devnet in Phantom settings
4. Get devnet SOL: Visit [https://faucet.solana.com/](https://faucet.solana.com/)
5. Connect wallet on your app

### Test Token Balance

If you see your token balance displayed, everything is working!

---

## 7. 💰 Cost Breakdown

### OpenAI Costs (Approximate)

| Usage     | Images      | Cost  |
| --------- | ----------- | ----- |
| Testing   | 50 images   | ~$2   |
| Light use | 500 images  | ~$20  |
| Heavy use | 5000 images | ~$200 |

**Tip**: Use pre-generated images during development to save costs!

### Solana Costs (Devnet)

- **FREE** on devnet! ✨
- Unlimited testing
- Get free SOL from faucet

### Solana Costs (Mainnet)

- Deployment: ~0.5-2 SOL ($50-200 depending on SOL price)
- Transactions: ~0.000005 SOL each (very cheap!)
- Token operations: ~0.00001 SOL each

---

## 8. 🔐 Security Best Practices

### API Keys

✅ **DO:**

- Keep keys in `.env.local`
- Use environment variables
- Rotate keys periodically
- Use separate keys for dev/prod

❌ **DON'T:**

- Commit keys to git
- Share keys publicly
- Use same key across projects
- Expose keys in client code

### Wallet Security

✅ **DO:**

- Use a separate wallet for development
- Keep seed phrases secure
- Test on devnet first
- Verify all transactions

❌ **DON'T:**

- Use main wallet for testing
- Share private keys
- Skip transaction verification
- Deploy to mainnet without testing

---

## 9. 🐛 Troubleshooting

### "OpenAI API key not configured"

**Problem**: API key not set or incorrect

**Solution**:

1. Check `.env.local` exists in `frontend/` directory
2. Verify key starts with `sk-`
3. Restart dev server after adding key
4. Check for typos

### "Program not found"

**Problem**: Program ID incorrect or not deployed

**Solution**:

1. Run `anchor deploy`
2. Copy exact Program ID from output
3. Update `NEXT_PUBLIC_PROGRAM_ID`
4. Restart dev server

### "Token account not found"

**Problem**: Token mint address incorrect or not created

**Solution**:

1. Run `npm run create-token` from project root
2. Copy the Token Mint address
3. Update both `.env.local` AND `TokenBalance.tsx`
4. Create a token account for your wallet

### "Insufficient funds"

**Problem**: No SOL in wallet

**Solution**:

- **Devnet**: Get free SOL from [faucet.solana.com](https://faucet.solana.com/)
- **Mainnet**: Buy SOL and transfer to wallet

---

## 10. 📚 Additional Resources

- [OpenAI API Documentation](https://platform.openai.com/docs/api-reference)
- [OpenAI API Pricing](https://openai.com/pricing)
- [Solana Documentation](https://docs.solana.com/)
- [Anchor Framework Docs](https://www.anchor-lang.com/)
- [SPL Token Guide](https://spl.solana.com/token)
- [Solana Devnet Faucet](https://faucet.solana.com/)

---

## 🎉 You're Ready!

Once you have all three keys configured, you're ready to run your app:

```bash
cd frontend
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) and start playing! 🚀

---

## 📞 Need Help?

If you're stuck:

1. Double-check all steps above
2. Review error messages carefully
3. Check the console for detailed errors
4. Make sure all prerequisites are installed
5. Try restarting the dev server

For deployment issues, check `../README.md` for more details.
