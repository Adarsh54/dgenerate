# Frontend Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER'S BROWSER                          │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐   │
│  │              Next.js Frontend (React)                  │   │
│  │                                                        │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │   │
│  │  │   Header     │  │    Video     │  │   Token     │ │   │
│  │  │  Component   │  │  Challenge   │  │   Balance   │ │   │
│  │  │  (Wallet)    │  │  Component   │  │  Component  │ │   │
│  │  └──────────────┘  └──────────────┘  └─────────────┘ │   │
│  │                                                        │   │
│  │  ┌────────────────────────────────────────────────┐   │   │
│  │  │      Solana Wallet Adapter Layer               │   │   │
│  │  │  (Phantom, Solflare, etc.)                     │   │   │
│  │  └────────────────────────────────────────────────┘   │   │
│  └────────────────────────────────────────────────────────┘   │
│                              │                                  │
└──────────────────────────────┼──────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SOLANA BLOCKCHAIN                          │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐   │
│  │         Your Sora Guesser Program (Anchor)             │   │
│  │                                                        │   │
│  │  • initialize()                                        │   │
│  │  • reward_user(api_response, wallet)                  │   │
│  │  • update_reward(new_amount)                          │   │
│  │                                                        │   │
│  │  State Accounts:                                       │   │
│  │  ├─ GameState                                         │   │
│  │  ├─ TokenMint                                         │   │
│  │  └─ User Token Accounts                               │   │
│  └────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
App (layout.tsx)
│
├─ WalletProvider (Solana wallet context)
│  │
│  └─ Page (page.tsx)
│     │
│     ├─ Header
│     │  └─ WalletMultiButton
│     │
│     ├─ GameStats
│     │  ├─ Current Reward
│     │  ├─ Active Players
│     │  ├─ Total Minted
│     │  └─ Challenges
│     │
│     ├─ VideoChallenge
│     │  ├─ Video Player
│     │  ├─ Guess Form
│     │  ├─ Result Display
│     │  └─ RewardAnimation (conditional)
│     │
│     └─ TokenBalance
│        ├─ Balance Display
│        └─ Auto-refresh Logic
```

## Data Flow

### User Guess Submission Flow

```
1. User watches video
   │
   ▼
2. User types guess in textarea
   │
   ▼
3. User clicks "Submit Guess"
   │
   ▼
4. VideoChallenge component validates input
   │
   ▼
5. Check if wallet is connected
   │
   ├─ No → Show "Connect wallet" message
   │
   └─ Yes → Continue to step 6
   │
   ▼
6. Call Solana program via Anchor
   │
   ├─ Parameters:
   │  ├─ Guess text
   │  ├─ Video challenge PDA
   │  ├─ User's wallet pubkey
   │  └─ User's token account
   │
   ▼
7. Program validates guess
   │
   ├─ Incorrect → Return error
   │  └─ Show red error message
   │
   └─ Correct → Continue to step 8
   │
   ▼
8. Program mints tokens to user
   │
   ▼
9. Transaction confirmed
   │
   ▼
10. Frontend shows success
    │
    ├─ Display success message
    ├─ Show reward animation
    └─ Update token balance
```

### Token Balance Update Flow

```
User connects wallet
   │
   ▼
TokenBalance component mounts
   │
   ▼
Derive associated token address
   │
   ▼
Fetch token account balance
   │
   ▼
Display balance
   │
   ▼
Set up 10-second refresh interval
   │
   ▼
[Every 10 seconds]
   │
   └─→ Fetch latest balance
       └─→ Update display
```

## State Management

### Client State (React)

```typescript
// VideoChallenge Component
const [guess, setGuess] = useState(""); // User's current guess
const [submitting, setSubmitting] = useState(false); // Loading state
const [result, setResult] = useState(null); // Success/failure
const [showReward, setShowReward] = useState(false); // Reward animation

// TokenBalance Component
const [balance, setBalance] = useState(null); // Token balance
const [loading, setLoading] = useState(false); // Loading state

// Page Component
const [currentVideoIndex, setCurrentVideoIndex] = useState(0); // Current video
const [refreshKey, setRefreshKey] = useState(0); // Force refresh
```

### Blockchain State (Solana)

```rust
// GameState Account
pub struct GameState {
    pub token_mint: Pubkey,        // Token mint address
    pub total_minted: u64,         // Total tokens minted
    pub current_reward: u64,       // Current reward per guess
    pub halving_threshold: u64,    // Tokens before halving
    pub authority: Pubkey,         // Admin authority
}
```

## Key Integrations

### 1. Wallet Adapter

```typescript
// Provides:
- useWallet() hook → Get connected wallet
- useConnection() hook → Get RPC connection
- WalletMultiButton → Pre-built wallet UI
```

### 2. Anchor Program

```typescript
// Provides:
- Program instance → Interact with smart contract
- Account fetching → Read blockchain state
- Transaction building → Submit instructions
```

### 3. SPL Token

```typescript
// Provides:
- getAssociatedTokenAddress() → Derive token account
- getAccount() → Fetch token account info
- Token account creation → Create ATA if needed
```

## Security Considerations

### Frontend Security

1. **Wallet Connection**: Only interact with user's connected wallet
2. **Input Validation**: Validate guess before submission
3. **Error Handling**: Don't expose sensitive error details
4. **RPC Calls**: Rate limit and handle failures gracefully

### Transaction Security

1. **User Approval**: All transactions require wallet approval
2. **Account Verification**: Verify all accounts in transaction
3. **Amount Checks**: Validate token amounts before display
4. **Network Selection**: Clearly indicate devnet vs mainnet

## Performance Optimization

### Current Optimizations

1. **Auto-refresh**: Balance updates every 10s (not every second)
2. **Component Loading**: Lazy load heavy components
3. **Image Optimization**: Use Next.js Image component (when needed)
4. **CSS**: Tailwind CSS purges unused styles

### Future Optimizations

1. **Caching**: Cache video challenge data
2. **Prefetching**: Prefetch next video challenge
3. **CDN**: Use CDN for video hosting
4. **RPC**: Use dedicated RPC node for better performance

## Error Handling Strategy

### Network Errors

```typescript
try {
  // Transaction attempt
} catch (error) {
  if (error.message.includes("insufficient funds")) {
    // Show "Need more SOL" message
  } else if (error.message.includes("simulation failed")) {
    // Show "Transaction failed" message
  } else {
    // Generic error message
  }
}
```

### Wallet Errors

```typescript
if (!publicKey) {
  // Show "Connect wallet" prompt
  return;
}

if (!tokenAccount) {
  // Show "Create token account" button
  return;
}
```

## Development vs Production

### Development (Devnet)

- Network: `devnet`
- Free SOL from faucet
- Test transactions
- Debug mode on

### Production (Mainnet)

- Network: `mainnet-beta`
- Real SOL required
- Real token rewards
- Analytics enabled
- Error reporting

## Deployment Pipeline

```
Local Development
   │
   ├─ npm run dev
   └─ Test on localhost:3000
   │
   ▼
Build
   │
   ├─ npm run build
   └─ Optimize production bundle
   │
   ▼
Deploy to Vercel
   │
   ├─ Git push
   ├─ Auto-deploy on commit
   └─ Environment variables set
   │
   ▼
Production
   │
   ├─ Served on CDN
   ├─ Auto-scaling
   └─ Zero downtime updates
```

## Future Architecture Enhancements

### Phase 1: Backend API

```
Add backend API layer for:
- Guess validation (off-chain comparison)
- Video management
- User profiles
- Leaderboards
```

### Phase 2: Database

```
Add database for:
- Video challenge storage
- User statistics
- Game history
- Analytics
```

### Phase 3: Real-time Features

```
Add WebSocket for:
- Live player count
- Real-time leaderboard
- Notifications
- Chat/social features
```

### Phase 4: Advanced Features

```
- AI-powered guess similarity matching
- Video upload for creators
- NFT rewards system
- Mobile app (React Native)
```

## Tech Stack Summary

| Layer              | Technology     | Purpose                     |
| ------------------ | -------------- | --------------------------- |
| Frontend Framework | Next.js 14     | React framework with SSR    |
| Language           | TypeScript     | Type-safe development       |
| Styling            | Tailwind CSS   | Utility-first CSS           |
| Icons              | Lucide React   | Modern icon library         |
| Blockchain         | Solana         | High-performance blockchain |
| Smart Contracts    | Anchor         | Solana framework            |
| Wallet             | Wallet Adapter | Multi-wallet support        |
| Tokens             | SPL Token      | Solana token standard       |
| Deployment         | Vercel         | Hosting & CI/CD             |

## Conclusion

This architecture provides:

- ✅ Clean separation of concerns
- ✅ Scalable component structure
- ✅ Secure wallet integration
- ✅ Efficient state management
- ✅ Good user experience
- ✅ Production-ready deployment
