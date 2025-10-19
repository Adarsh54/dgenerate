# Sora Guesser Frontend

A beautiful, modern frontend for the Sora Guesser game - a TikTok-style video guessing game where users earn tokens for correctly guessing AI-generated video prompts.

## Features

✨ **Modern UI/UX**

- Beautiful gradient-based design
- Smooth animations and transitions
- Responsive layout for all devices
- TikTok-style video interface

🎮 **Game Features**

- Watch Sora AI-generated videos
- Submit prompt guesses
- Real-time token rewards
- Live balance updates

🔐 **Solana Integration**

- Wallet connection (Phantom, Solflare)
- Token balance display
- Automatic reward distribution
- Secure transactions

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Blockchain**: Solana Web3.js + Anchor
- **Wallet**: Solana Wallet Adapter
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Solana wallet (Phantom or Solflare recommended)
- Some SOL for transaction fees (get free SOL from [Solana Faucet](https://faucet.solana.com/) for devnet)

### Installation

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file from the example:

```bash
cp .env.local.example .env.local
```

4. Update the `.env.local` file with your configuration:
   - Set your deployed program ID
   - Set your token mint address
   - Configure the Solana network (devnet/mainnet)

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

Build the application:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## Configuration

### Environment Variables

Create a `.env.local` file with the following variables:

```env
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_PROGRAM_ID=your_program_id_here
NEXT_PUBLIC_TOKEN_MINT=your_token_mint_address_here
NEXT_PUBLIC_RPC_ENDPOINT=https://api.devnet.solana.com
```

### Connecting Your Program

To connect the frontend to your deployed Solana program:

1. **Generate IDL**: After building your Anchor program, copy the IDL file:

   ```bash
   cp ../target/idl/sora_guesser.json ./lib/idl.json
   ```

2. **Update Program ID**: In `lib/anchor.ts`, update the `PROGRAM_ID` with your deployed program address.

3. **Update Token Mint**: In `components/TokenBalance.tsx`, update `TOKEN_MINT` with your token mint address.

## Project Structure

```
frontend/
├── app/
│   ├── globals.css          # Global styles and Tailwind config
│   ├── layout.tsx           # Root layout with wallet provider
│   └── page.tsx             # Main game page
├── components/
│   ├── Header.tsx           # Navigation header with wallet button
│   ├── VideoChallenge.tsx   # Main video challenge component
│   ├── TokenBalance.tsx     # Token balance display
│   ├── GameStats.tsx        # Game statistics cards
│   └── WalletProvider.tsx   # Solana wallet provider setup
├── lib/
│   └── anchor.ts            # Anchor program utilities
├── public/                  # Static assets
├── .env.local.example       # Environment variables template
└── README.md               # This file
```

## Usage

### For Players

1. **Connect Wallet**: Click the wallet button in the top-right corner
2. **Watch Video**: A Sora-generated video will play automatically
3. **Make Your Guess**: Type what you think the prompt was in the text area
4. **Submit**: Click "Submit Guess" to check if you're correct
5. **Earn Tokens**: Receive SORA tokens for correct guesses!

### For Developers

#### Adding New Videos

Edit the `SAMPLE_VIDEOS` array in `app/page.tsx`:

```typescript
const SAMPLE_VIDEOS = [
  {
    id: "video_1",
    url: "your_video_url",
    prompt: "The actual prompt used",
  },
  // Add more videos...
];
```

#### Customizing Rewards

The reward logic is in the Solana program. To display different reward amounts, update the values in:

- `components/GameStats.tsx` (Current Reward display)
- `components/VideoChallenge.tsx` (Success message)

#### Styling

The project uses Tailwind CSS with custom utilities:

- `btn-primary`: Primary button style
- `btn-secondary`: Secondary button style
- `card`: Card container style
- `input-field`: Input/textarea style

Customize colors in `tailwind.config.ts`.

## Integration with Solana Program

The frontend interacts with your Solana program through:

1. **Initialize Game**: Set up the game state (admin only)
2. **Submit Guess**: Submit a guess and receive rewards if correct
3. **Fetch Balance**: Display current token balance
4. **Game Stats**: Show total minted tokens and current reward

Key integration points:

- `lib/anchor.ts`: Program initialization and PDA derivation
- `components/VideoChallenge.tsx`: Guess submission logic
- `components/TokenBalance.tsx`: Balance fetching

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Configure environment variables in Vercel dashboard
4. Deploy!

### Deploy to Other Platforms

The app can be deployed to any platform that supports Next.js:

- Netlify
- AWS Amplify
- Railway
- Render

## Troubleshooting

### Wallet Not Connecting

- Ensure you have a Solana wallet extension installed
- Check that you're on the correct network (devnet/mainnet)
- Try refreshing the page

### Transactions Failing

- Ensure you have sufficient SOL for transaction fees
- Verify your program is deployed and initialized
- Check the browser console for detailed error messages

### Token Balance Not Showing

- Ensure your token account exists (create one if needed)
- Verify the `TOKEN_MINT` address is correct
- Check you're connected to the right network

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Support

For issues and questions:

- Check the [main project README](../README.md)
- Open an issue on GitHub
- Review Anchor and Solana documentation

## Links

- [Solana Documentation](https://docs.solana.com/)
- [Anchor Framework](https://www.anchor-lang.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
