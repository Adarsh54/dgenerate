# 🚀 Quick Start - Image Generation Version

This is a streamlined guide to get your **AI Image Guesser** up and running with OpenAI's DALL-E.

## 🎯 What You're Building

A game where users:

1. View AI-generated images
2. Guess the prompts that created them
3. Earn Solana tokens for correct guesses

---

## ⚡ 5-Minute Setup

### Step 1: Get OpenAI API Key (2 mins)

1. Visit [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Click "Create new secret key"
3. Copy the key (starts with `sk-`)
4. Add payment method at [billing page](https://platform.openai.com/account/billing/overview)

### Step 2: Install & Configure (2 mins)

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
# Add your OpenAI key
OPENAI_API_KEY=sk-YOUR_KEY_HERE

# For now, use these defaults
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_PROGRAM_ID=Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS
NEXT_PUBLIC_TOKEN_MINT=YOUR_TOKEN_MINT_ADDRESS
```

### Step 3: Run! (1 min)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 🎮 Using the App

### View Pre-loaded Images

The app comes with 3 sample images. You can:

- Click **Previous/Next** to navigate
- Try guessing the prompts
- See how the similarity matching works

### Generate New Images (Optional)

Want to add your own AI-generated images?

1. The API route is ready at `/api/generate-image`
2. You can call it to generate new images:

```bash
curl -X POST http://localhost:3000/api/generate-image \
  -H "Content-Type: application/json" \
  -d '{"prompt": "A magical forest with glowing mushrooms"}'
```

3. Add the returned image URL to `app/page.tsx` in the `SAMPLE_IMAGES` array

---

## 💰 About Costs

### OpenAI (Required for generation)

- **DALL-E 3**: ~$0.04 per image
- **Viewing images**: FREE (uses pre-generated URLs)

**Tip**: Use the included sample images for testing before generating new ones!

### Solana (For token rewards)

- **Devnet**: FREE forever ✨
- **Mainnet**: Real SOL needed

---

## 🔧 Getting Solana Keys (Later)

For now, the app works with sample images. When you're ready to add blockchain features:

1. **Deploy your program**: `anchor deploy`
2. **Create token**: `npm run create-token` (in root directory)
3. **Update .env.local** with real values

See [HOW_TO_GET_KEYS.md](./HOW_TO_GET_KEYS.md) for complete instructions.

---

## 📝 Sample Image Sources

The app uses three placeholder images from Unsplash:

- Futuristic city
- Magical forest
- Astronaut in space

These are just examples! Replace them with:

- Your own AI-generated images
- Images from DALL-E API
- Any images with known prompts

---

## 🎨 Customizing Images

Edit `frontend/app/page.tsx`:

```typescript
const SAMPLE_IMAGES = [
  {
    id: "image_1",
    url: "https://your-image-url.jpg",
    prompt: "Your actual prompt",
  },
  // Add more images...
];
```

---

## 🧪 Testing the Guess System

The app uses **word similarity matching**:

- Breaks prompts into words
- Compares your guess to the actual prompt
- 70%+ similarity = correct!

Example:

```
Actual: "A futuristic city at sunset with flying cars"
Guess:  "futuristic city sunset flying cars"
Result: ✅ Correct! (High word overlap)
```

---

## 🔌 Connecting Solana Wallet

1. Install [Phantom Wallet](https://phantom.app/)
2. Create/import wallet
3. Switch to Devnet in settings
4. Get free SOL from [faucet.solana.com](https://faucet.solana.com/)
5. Click "Connect Wallet" in the app

---

## 🚀 Next Steps

### Immediate

- [x] Install and run the app
- [ ] Try guessing some images
- [ ] Connect your wallet
- [ ] Test the UI

### Short-term

- [ ] Generate custom images with DALL-E
- [ ] Deploy Solana program
- [ ] Create your token
- [ ] Test token rewards

### Long-term

- [ ] Add more images
- [ ] Customize styling
- [ ] Deploy to production
- [ ] Add leaderboard

---

## 🎯 Feature Status

| Feature           | Status     | Notes                    |
| ----------------- | ---------- | ------------------------ |
| Image Display     | ✅ Working | Uses sample images       |
| Guess Submission  | ✅ Working | Client-side validation   |
| Wallet Connection | ✅ Working | Connect Phantom/Solflare |
| Token Display     | ⚙️ Partial | Needs token mint address |
| Token Rewards     | ⏳ Coming  | Needs program deployment |
| Image Generation  | ✅ Ready   | API route created        |

---

## 💡 Pro Tips

1. **Start Simple**: Use sample images first
2. **Test on Devnet**: Always test before mainnet
3. **Save API Costs**: Generate images in batches
4. **Cache Images**: Store URLs to avoid regeneration
5. **Monitor Usage**: Check OpenAI usage dashboard

---

## 🐛 Common Issues

### App won't start

```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
npm run dev
```

### "API key not configured"

- Check `.env.local` is in `frontend/` directory
- Verify key starts with `sk-`
- Restart dev server after adding key

### Images not loading

- Check image URLs are accessible
- Try opening URLs directly in browser
- Verify no CORS issues

---

## 📚 Learn More

- [HOW_TO_GET_KEYS.md](./HOW_TO_GET_KEYS.md) - Get all required keys
- [README.md](./README.md) - Complete documentation
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System design

---

## 🎉 You're All Set!

Your app is ready to use! Start by:

1. Running `npm run dev`
2. Opening http://localhost:3000
3. Trying to guess the sample images
4. Connecting your wallet
5. Having fun! 🎮

When you're ready to generate custom images and add blockchain features, check out the other guides.

Happy guessing! 🚀
