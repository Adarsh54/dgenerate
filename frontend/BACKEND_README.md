# 🚀 Backend Setup - Quick Start

Your Sora Guesser app now has a **Supabase backend** that stores images, guesses, and user stats using wallet IDs for authentication!

## ⚡ 5-Minute Setup

### 1. Create Supabase Account

Go to [supabase.com](https://supabase.com) and create a free account.

### 2. Create a New Project

- Click "New Project"
- Name it `sora-guesser`
- Choose a region close to you
- Wait ~2 minutes for setup

### 3. Get Your API Keys

In Supabase dashboard:

- Go to **Settings** → **API**
- Copy your **Project URL** and **anon public key**

### 4. Add Keys to .env.local

Create `frontend/.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 5. Create Database Tables

In Supabase dashboard:

1. Go to **SQL Editor**
2. Click **+ New query**
3. Copy everything from `frontend/supabase/schema.sql`
4. Paste and click **Run**

### 6. Test It!

```bash
cd frontend
npm run dev
```

Connect your wallet and submit a guess - it will save to Supabase! 🎉

---

## 📚 Full Documentation

For detailed instructions, troubleshooting, and API reference:

👉 **[READ THE FULL GUIDE: SUPABASE_SETUP.md](./SUPABASE_SETUP.md)**

---

## ✅ What You Get

- **User Stats**: Tracks guesses, accuracy, tokens earned per wallet
- **Image Storage**: All AI-generated images and prompts
- **Guess History**: Every guess with similarity scores
- **Leaderboard**: Top players by tokens earned
- **Auto-updating**: Stats update automatically via triggers

---

## 🔑 Required Environment Variables

```env
# Supabase (REQUIRED for backend)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI (Optional - only for generating images)
OPENAI_API_KEY=sk-...

# Solana
NEXT_PUBLIC_SOLANA_NETWORK=devnet
```

---

## 🆘 Quick Troubleshooting

**Error: "Failed to fetch"**

- Restart dev server after adding env vars
- Check `.env.local` has correct keys

**Stats not showing**

- Make sure you ran the schema.sql file
- Hard refresh browser (Cmd/Ctrl + Shift + R)

**Can't submit guesses**

- Connect your Solana wallet first
- Check browser console for errors

---

## 📁 Project Structure

```
frontend/
├── app/
│   └── api/
│       ├── submit-guess/      # Submit user guesses
│       ├── user-stats/         # Get user statistics
│       ├── leaderboard/        # Get top players
│       └── images/             # Manage images
├── lib/
│   └── supabase.ts            # Supabase client
├── supabase/
│   └── schema.sql             # Database schema
└── components/
    ├── ImageChallenge.tsx     # Updated to use backend
    └── GameStats.tsx          # Shows real user stats
```

---

## 🎯 Next Steps

After setup, you can:

1. ✅ Play the game and see stats update in real-time
2. ✅ Generate AI images: `npm run generate-images`
3. ✅ View data in Supabase Table Editor
4. ✅ Build a leaderboard UI
5. ✅ Integrate with Solana smart contract for token rewards

---

**Need help?** Check the full guide: `SUPABASE_SETUP.md`

