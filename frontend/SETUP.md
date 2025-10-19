# Quick Setup Guide

This guide will help you get the Sora Guesser frontend up and running in minutes.

## Prerequisites Checklist

- [ ] Node.js 18+ installed
- [ ] Solana wallet extension (Phantom or Solflare)
- [ ] Your Anchor program deployed
- [ ] Token mint created

## Step-by-Step Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment

Copy the example environment file:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and update these values:

```env
# Your deployed program ID (from Anchor.toml or anchor deploy output)
NEXT_PUBLIC_PROGRAM_ID=YOUR_PROGRAM_ID_HERE

# Your token mint address (from scripts/create-token-mint.ts output)
NEXT_PUBLIC_TOKEN_MINT=YOUR_TOKEN_MINT_HERE

# Network (devnet for testing, mainnet-beta for production)
NEXT_PUBLIC_SOLANA_NETWORK=devnet
```

### 3. Copy IDL File (Important!)

After building your Anchor program, copy the IDL:

```bash
# From the root of your project
cp target/idl/sora_guesser.json frontend/lib/idl.json
```

Then update `frontend/lib/anchor.ts` to import the IDL:

```typescript
import idl from "./idl.json";

// Replace this line:
const idl = {} as Idl;

// With:
const idl = idl as Idl;
```

### 4. Update Token Mint Address

In `frontend/components/TokenBalance.tsx`, update the TOKEN_MINT:

```typescript
const TOKEN_MINT = new PublicKey("YOUR_TOKEN_MINT_ADDRESS");
```

### 5. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Customization

### Adding Real Videos

Replace the sample videos in `app/page.tsx`:

```typescript
const SAMPLE_VIDEOS = [
  {
    id: "video_1",
    url: "https://your-video-url.mp4",
    prompt: "The actual AI prompt",
  },
  // Add more...
];
```

### Connecting to Backend API

To validate guesses against a backend API instead of using the smart contract directly:

1. Create `lib/api.ts`:

```typescript
export async function validateGuess(videoId: string, guess: string) {
  const response = await fetch("/api/validate-guess", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ videoId, guess }),
  });
  return response.json();
}
```

2. Update `components/VideoChallenge.tsx` to use the API.

### Changing Theme Colors

Edit `tailwind.config.ts` to customize colors:

```typescript
colors: {
  primary: {
    // Your custom primary colors
  },
  accent: {
    // Your custom accent colors
  },
}
```

## Troubleshooting

### "Module not found: Can't resolve '@solana/wallet-adapter-react-ui/styles.css'"

Install all dependencies:

```bash
npm install
```

### Wallet connection fails

1. Ensure you have a wallet extension installed
2. Check you're on the correct network
3. Verify your wallet has some SOL for fees

### Token balance shows 0 despite having tokens

1. Verify TOKEN_MINT address is correct
2. Ensure you have a token account (create one if needed)
3. Check you're connected to the right network

### Transaction fails

1. Ensure your program is initialized
2. Check you have enough SOL for transaction fees
3. Verify all accounts are correct in the transaction

## Production Deployment

### Build for Production

```bash
npm run build
npm start
```

### Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Update for Mainnet

1. Update `.env.local`:

   ```env
   NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
   ```

2. Update program ID to mainnet deployment

3. Update token mint to mainnet token

4. Consider using a custom RPC endpoint for better performance

## Next Steps

- [ ] Add real Sora-generated videos
- [ ] Implement backend API for guess validation
- [ ] Add leaderboard functionality
- [ ] Implement video upload for challenge creators
- [ ] Add social features (sharing, comments)
- [ ] Create admin dashboard
- [ ] Add analytics and monitoring

## Support

If you need help:

1. Check the main [README.md](./README.md)
2. Review [Solana documentation](https://docs.solana.com/)
3. Check [Anchor documentation](https://www.anchor-lang.com/)
4. Open an issue on GitHub

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Solana Wallet Adapter](https://github.com/solana-labs/wallet-adapter)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Anchor Framework](https://www.anchor-lang.com/)
