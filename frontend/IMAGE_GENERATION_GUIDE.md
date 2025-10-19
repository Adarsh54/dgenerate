# 🎨 Image Generation Guide

Learn how to generate AI images for your guessing game using OpenAI's DALL-E 3.

## 🤖 Using the Built-in API

Your app includes a ready-to-use API endpoint for generating images.

### Basic Usage

```bash
curl -X POST http://localhost:3000/api/generate-image \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "A serene Japanese garden with cherry blossoms and a wooden bridge"
  }'
```

Response:

```json
{
  "imageUrl": "https://oaidalleapiprodscus.blob.core.windows.net/...",
  "prompt": "A serene Japanese garden with cherry blossoms..."
}
```

### From Browser Console

```javascript
fetch("/api/generate-image", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    prompt: "A futuristic robot reading a book in a library",
  }),
})
  .then((r) => r.json())
  .then((data) => console.log("Image URL:", data.imageUrl));
```

---

## 📝 Writing Great Prompts

### Prompt Formula

**[Subject] + [Style] + [Setting] + [Mood/Lighting] + [Details]**

### Examples

#### Good Prompts ✅

```
"A majestic lion in a savanna at golden hour, photorealistic style"

"A cozy coffee shop interior with warm lighting, bookshelves,
vintage furniture, and steam rising from a cup"

"An astronaut floating near a colorful nebula, digital art style,
ethereal glow, stars in background"
```

#### Bad Prompts ❌

```
"cat"  // Too vague

"Make me the best image ever with everything amazing"  // Too generic

"a;sldkfj random text here"  // Nonsensical
```

### Style Keywords

- **Photorealistic**: `photorealistic, 4K, detailed, sharp focus`
- **Digital Art**: `digital art, concept art, trending on artstation`
- **Painting**: `oil painting, watercolor, impressionist style`
- **3D Render**: `3D render, octane render, volumetric lighting`
- **Illustration**: `illustration, vector art, flat design`

---

## 🎯 Generating Game Images

### Script to Generate Multiple Images

Create `scripts/generate-game-images.js`:

```javascript
async function generateGameImage(prompt) {
  const response = await fetch("http://localhost:3000/api/generate-image", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });
  return await response.json();
}

const prompts = [
  "A cyberpunk city at night with neon lights and flying cars",
  "A medieval castle on a cliff during sunset",
  "An underwater scene with colorful coral and tropical fish",
  "A steampunk airship flying through clouds",
  "A mystical forest with glowing fireflies and ancient trees",
];

async function generateAll() {
  for (const prompt of prompts) {
    console.log(`\nGenerating: ${prompt}`);
    const result = await generateGameImage(prompt);
    console.log(`URL: ${result.imageUrl}\n`);

    // Wait 2 seconds between generations
    await new Promise((r) => setTimeout(r, 2000));
  }
}

generateAll();
```

Run with:

```bash
node scripts/generate-game-images.js
```

---

## 💾 Saving Generated Images

### Option 1: Use URLs Directly (Recommended)

DALL-E URLs are stable. Just save them:

```typescript
const SAMPLE_IMAGES = [
  {
    id: "image_1",
    url: "https://oaidalleapiprodscus.blob.core.windows.net/...",
    prompt: "Your prompt here",
  },
];
```

### Option 2: Download and Host Yourself

```javascript
async function downloadImage(url, filename) {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  const fs = require("fs");
  fs.writeFileSync(`public/images/${filename}`, Buffer.from(buffer));
}

// Use
downloadImage(imageUrl, "game-image-1.png");
```

Then use local path:

```typescript
url: "/images/game-image-1.png";
```

---

## 🎮 Difficulty Levels

Create images with varying difficulty:

### Easy (Obvious/Specific)

```
"A red apple on a wooden table"
"A golden retriever playing with a tennis ball"
"A blue sports car parked on a street"
```

### Medium (Descriptive)

```
"A cozy coffee shop on a rainy day with warm lighting"
"A magical library with floating books and candles"
"A space station orbiting a purple planet"
```

### Hard (Abstract/Artistic)

```
"An abstract representation of time and space, cosmic energy"
"Surreal landscape where day and night meet, dreamlike atmosphere"
"Emotions visualized as colors and shapes, expressionist style"
```

---

## 📊 Managing Costs

### Price per Image

- **Standard Quality 1024×1024**: $0.040
- **HD Quality 1024×1024**: $0.080

### Cost-Saving Tips

1. **Batch Generate**: Create images in batches, not on-demand
2. **Cache Everything**: Never regenerate the same prompt
3. **Use Standard Quality**: HD not needed for web display
4. **Test Prompts Cheaply**: Use DALL-E 2 for testing ($0.020/image)
5. **Set Budget Alerts**: Monitor usage in OpenAI dashboard

### Example Budget

```
10 images = $0.40
50 images = $2.00
100 images = $4.00
500 images = $20.00
```

---

## 🔧 Advanced Configuration

### Customize API Route

Edit `app/api/generate-image/route.ts`:

```typescript
const response = await openai.images.generate({
  model: "dall-e-3",
  prompt: prompt,
  n: 1,
  size: "1024x1024", // or "1792x1024", "1024x1792"
  quality: "standard", // or "hd"
  style: "vivid", // or "natural"
});
```

### Size Options

- `1024x1024` - Square (recommended)
- `1792x1024` - Landscape
- `1024x1792` - Portrait

### Style Options

- `vivid` - Hyper-real and dramatic
- `natural` - More natural, less dramatic

---

## 🎨 Creating Themed Collections

### Fantasy Theme

```javascript
const fantasyPrompts = [
  "A dragon perched on a mountain peak at sunrise",
  "An enchanted forest with glowing mushrooms",
  "A wizard's tower filled with magical artifacts",
  "A fairy village built into giant flowers",
];
```

### Sci-Fi Theme

```javascript
const sciFiPrompts = [
  "A space colony on Mars with biodomes",
  "A holographic interface in a futuristic lab",
  "An alien marketplace with exotic creatures",
  "A time machine in a quantum physics laboratory",
];
```

### Nature Theme

```javascript
const naturePrompts = [
  "A mountain lake reflecting autumn colors",
  "A tropical beach at golden hour",
  "A snowy forest with pine trees",
  "A desert oasis with palm trees",
];
```

---

## 🔄 Dynamic Generation (Advanced)

### Generate on User Request

```typescript
// Add to your frontend
const [generating, setGenerating] = useState(false);

async function generateNewChallenge() {
  setGenerating(true);

  const prompt = getRandomPrompt(); // Your prompt logic

  const response = await fetch("/api/generate-image", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  const data = await response.json();

  // Add to challenges
  addNewChallenge({
    id: generateId(),
    url: data.imageUrl,
    prompt: prompt,
  });

  setGenerating(false);
}
```

---

## 📈 Best Practices

### DO ✅

- Pre-generate images for better UX
- Store image URLs in a database
- Cache generated images
- Test prompts before bulk generation
- Monitor OpenAI usage dashboard
- Set spending limits
- Use descriptive prompts
- Include style keywords

### DON'T ❌

- Generate images on every page load
- Regenerate the same prompts
- Use the API without rate limiting
- Forget to handle errors
- Expose API key in frontend
- Generate images without user need
- Use vague prompts
- Exceed your budget

---

## 🧪 Testing Prompts

Before generating expensive batches:

```javascript
// Test prompt quality
const testPrompts = [
  "A simple test prompt",
  "A more detailed test with specific style, lighting, and mood",
];

// Generate one at a time
// Review results
// Refine prompts
// Then batch generate
```

---

## 📚 Resources

- [DALL-E 3 Guide](https://platform.openai.com/docs/guides/images)
- [Prompt Engineering](https://platform.openai.com/docs/guides/prompt-engineering)
- [OpenAI Pricing](https://openai.com/pricing)
- [Image Generation Best Practices](https://help.openai.com/en/articles/6516417-dall-e-guide)

---

## 🎉 Ready to Generate!

You now have everything you need to create amazing AI images for your guessing game.

Start with the sample prompts, experiment, and build your perfect image collection!

Happy generating! 🎨
