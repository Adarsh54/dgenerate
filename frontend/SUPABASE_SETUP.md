# 🗄️ Supabase Backend Setup Guide

This guide will walk you through setting up Supabase as the backend for Sora Guesser.

## 📋 What You'll Build

A complete backend that:

- ✅ Stores AI-generated images and prompts
- ✅ Records user guesses with similarity scoring
- ✅ Tracks user stats (guesses, accuracy, tokens earned)
- ✅ Uses Solana wallet IDs for authentication (no passwords!)
- ✅ Provides leaderboard functionality

---

## 🚀 Step 1: Create a Supabase Project

### 1.1 Sign up for Supabase

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub (recommended) or email

### 1.2 Create a New Project

1. Click "New Project"
2. Choose your organization (or create one)
3. Fill in:
   - **Project Name**: `sora-guesser` (or your choice)
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to your users
4. Click "Create new project"
5. Wait 2-3 minutes for setup to complete ☕

---

## 🔑 Step 2: Get Your API Keys

### 2.1 Find Your Project Settings

1. In your Supabase dashboard, click **Settings** (gear icon, bottom left)
2. Click **API** in the sidebar

### 2.2 Copy Your Keys

You'll see:

- **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
- **anon public key**: `eyJhbGc...` (long string)

### 2.3 Add to Your .env.local

1. In your `frontend/` directory, create or edit `.env.local`:

```bash
cd frontend
touch .env.local
```

2. Add your keys:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# OpenAI (if you're generating AI images)
OPENAI_API_KEY=sk-...

# Solana
NEXT_PUBLIC_SOLANA_NETWORK=devnet
```

**⚠️ Important**: Never commit `.env.local` to git! It should be in your `.gitignore`.

---

## 🗃️ Step 3: Create Database Tables

### 3.1 Open the SQL Editor

1. In Supabase dashboard, click **SQL Editor** (left sidebar)
2. Click **+ New query**

### 3.2 Run the Schema Script

1. Open the file: `frontend/supabase/schema.sql`
2. Copy ALL the contents
3. Paste into the Supabase SQL Editor
4. Click **Run** (or press Cmd/Ctrl + Enter)

You should see:

```
Success. No rows returned
```

### 3.3 Verify Tables Were Created

1. Click **Database** in the left sidebar
2. Click **Tables**
3. You should see 3 tables:
   - ✅ `users` - User statistics
   - ✅ `images` - AI-generated images and prompts
   - ✅ `guesses` - User guess submissions

---

## 🔒 Step 4: Configure Row Level Security (RLS)

The schema automatically sets up RLS policies that:

- Anyone can **view** images (public)
- Users can **submit** guesses with their wallet ID
- Users can **view** their own stats and the leaderboard

**This is already done by the schema.sql file!** ✅

---

## 📊 Step 5: Verify Sample Data

### 5.1 Check Sample Images

1. Go to **Table Editor** → **images**
2. You should see 3 sample images with prompts
3. These are placeholder images from Picsum

### 5.2 Test with API (Optional)

In your browser console (when dev server is running):

```javascript
fetch("/api/images")
  .then((r) => r.json())
  .then(console.log);
```

You should see the 3 sample images!

---

## 🎮 Step 6: Test the Full Flow

### 6.1 Start Your Dev Server

```bash
cd frontend
npm run dev
```

### 6.2 Connect Your Wallet

1. Open http://localhost:3000
2. Click "Select Wallet" and connect Phantom/Solflare
3. Approve the connection

### 6.3 Submit a Guess

1. Look at an image
2. Type a guess in the text box
3. Click "Submit Guess"
4. Check the console for API calls

### 6.4 Verify in Supabase

1. Go to **Table Editor** → **guesses**
2. You should see your guess recorded!
3. Check **users** table for your wallet ID and stats

---

## 📈 API Endpoints You Now Have

### Submit a Guess

```typescript
POST /api/submit-guess
Body: {
  imageId: string,
  walletId: string,
  guessText: string,
  actualPrompt: string
}
```

### Get User Stats

```typescript
GET /api/user-stats?walletId=YOUR_WALLET_ID
```

### Get Leaderboard

```typescript
GET /api/leaderboard?limit=10
```

### Get Images

```typescript
GET /api/images?limit=10&difficulty=medium
```

### Add New Image

```typescript
POST /api/images
Body: {
  imageUrl: string,
  prompt: string,
  difficulty?: 'easy' | 'medium' | 'hard'
}
```

---

## 🖼️ Step 7: Add Your Own AI Images

### Option A: Via API (Recommended)

```javascript
fetch("/api/images", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    imageUrl: "https://your-image-url.com/image.png",
    prompt: "A beautiful sunset over mountains",
    difficulty: "medium",
  }),
});
```

### Option B: Via Supabase UI

1. Go to **Table Editor** → **images**
2. Click **Insert row**
3. Fill in:
   - `image_url`: Full URL to your image
   - `prompt`: The actual prompt
   - `difficulty`: easy, medium, or hard
4. Click **Save**

### Option C: Generate with OpenAI Script

```bash
cd frontend
npm run generate-images
```

Then update images in Supabase:

1. Run the script
2. It saves to `scripts/generated-images.json`
3. Use Option A or B to add them to Supabase

---

## 🔧 Troubleshooting

### Error: "Failed to fetch"

- ✅ Check `.env.local` has correct Supabase URL and key
- ✅ Restart dev server after adding env vars
- ✅ Make sure variables start with `NEXT_PUBLIC_`

### Error: "Insert failed"

- ✅ Check RLS policies in **Authentication** → **Policies**
- ✅ Verify your wallet is connected
- ✅ Check browser console for detailed error

### Stats not updating

- ✅ Check **Table Editor** → **guesses** for new rows
- ✅ Verify the trigger `update_user_stats_trigger` exists in **Database** → **Triggers**
- ✅ Hard refresh (Cmd/Ctrl + Shift + R)

### Images not showing

- ✅ Verify image URLs are publicly accessible
- ✅ Check CORS settings if using custom domain
- ✅ Use Picsum URLs for testing: `https://picsum.photos/1024/1024?random=X`

---

## 🎯 What's Next?

Now that your backend is set up, you can:

1. **Generate AI Images**: Use `npm run generate-images` (requires OpenAI key)
2. **Add Leaderboard UI**: Display top players
3. **Integrate Solana Program**: Connect to your smart contract for token rewards
4. **Add More Features**:
   - Daily challenges
   - Difficulty levels
   - Multiplayer competitions
   - NFT rewards

---

## 📚 Database Schema Reference

### `users` table

```sql
wallet_id           TEXT PRIMARY KEY
total_guesses       INTEGER
correct_guesses     INTEGER
total_tokens_earned INTEGER
created_at          TIMESTAMP
updated_at          TIMESTAMP
```

### `images` table

```sql
id          UUID PRIMARY KEY
image_url   TEXT
prompt      TEXT
difficulty  TEXT ('easy', 'medium', 'hard')
created_at  TIMESTAMP
```

### `guesses` table

```sql
id               UUID PRIMARY KEY
image_id         UUID (FK → images)
wallet_id        TEXT (FK → users)
guess_text       TEXT
is_correct       BOOLEAN
similarity_score DECIMAL(5,2)
tokens_earned    INTEGER
created_at       TIMESTAMP
```

---

## 🔐 Security Notes

- ✅ RLS policies ensure users can only see/modify appropriate data
- ✅ Wallet ID is used for auth (no passwords stored)
- ✅ `NEXT_PUBLIC_` env vars are safe for client-side
- ✅ Keep your database password and service_role key secret
- ⚠️ Never expose `service_role` key in frontend code

---

## 💡 Tips

1. **Use Table Editor**: Great for manually adding/testing data
2. **Check Logs**: Go to **Logs** → **API** to debug requests
3. **Monitor Usage**: Check **Database** → **Usage** to track your usage
4. **Backup Data**: Go to **Database** → **Backups** (Pro plan)

---

## 🆘 Need Help?

- **Supabase Docs**: https://supabase.com/docs
- **Discord**: https://discord.supabase.com
- **GitHub Issues**: Create an issue in your project repo

---

**🎉 Congrats! Your backend is ready!**

Now run `npm run dev` and start playing! 🚀

