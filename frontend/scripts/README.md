# 🎨 Image Generation Scripts

Scripts to help you generate AI images for your game.

## 🚀 Quick Start

### Generate Real AI Images

1. **Make sure your dev server is running:**

   ```bash
   # In a separate terminal
   cd frontend
   npm run dev
   ```

2. **Make sure you have your OpenAI key in `.env.local`:**

   ```env
   OPENAI_API_KEY=sk-proj-your-key-here
   ```

3. **Run the generation script:**

   ```bash
   # From the frontend directory
   npm run generate-images
   ```

4. **The script will:**
   - Generate 2 AI images using DALL-E 3
   - Save them to `generated-images.json`
   - **Automatically update `app/page.tsx` with the new images**
   - Your dev server will hot-reload with the new images!

## 💰 Cost

- Each DALL-E 3 image costs ~$0.04
- Generating 2 images = ~$0.08 ✨ (perfect for testing!)
- The script includes delays to respect rate limits

## 📝 Customizing Prompts

Edit `scripts/generate-images.js` and modify the `prompts` array:

```javascript
const prompts = [
  "Your custom prompt here",
  "Another creative prompt",
  // Add more...
];
```

## 🎯 Using the Generated Images

The script **automatically updates** your `app/page.tsx` file!

✅ No copying/pasting needed - just run the script and refresh your browser.

If automatic update fails, the script will show you the code to manually copy.

## ⚡ Quick Test (Generate Just One)

Want to test first? Open your browser console on http://localhost:3000 and run:

```javascript
fetch("/api/generate-image", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    prompt: "A magical cat wizard casting spells",
  }),
})
  .then((r) => r.json())
  .then((data) => console.log("Image URL:", data.imageUrl));
```

## 🐛 Troubleshooting

### "Dev server is not running"

Start the dev server: `npm run dev`

### "API key not configured"

Add your OpenAI key to `frontend/.env.local`

### "Rate limit exceeded"

Wait a minute and try again. The script includes 2-second delays between requests.

### Images don't persist

DALL-E URLs are temporary (expire after ~1 hour). For production:

1. Download images: See `IMAGE_GENERATION_GUIDE.md`
2. Upload to your hosting (Vercel, S3, etc.)
3. Use your hosted URLs instead
