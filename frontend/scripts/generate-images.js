#!/usr/bin/env node

/**
 * Generate AI images for the game using OpenAI's DALL-E 3
 * Run: node scripts/generate-images.js
 */

const fs = require('fs');
const path = require('path');

// Sample prompts for the game (only 2 for cost-effective testing)
const prompts = [
  "A futuristic city at sunset with flying cars and neon lights, digital art style",
  "A magical forest with glowing mushrooms and fireflies, fantasy illustration"
];

async function generateImage(prompt) {
  console.log(`\n🎨 Generating: "${prompt}"`);
  
  try {
    const response = await fetch('http://localhost:3000/api/generate-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to generate image');
    }

    const data = await response.json();
    console.log(`✅ Generated: ${data.imageUrl}`);
    
    return {
      id: `image_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      url: data.imageUrl,
      prompt: prompt
    };
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    return null;
  }
}

async function generateAll() {
  console.log('🚀 Starting AI image generation...');
  console.log('⚠️  Make sure your dev server is running on http://localhost:3000\n');

  const images = [];

  for (let i = 0; i < prompts.length; i++) {
    const prompt = prompts[i];
    console.log(`\n[${i + 1}/${prompts.length}]`);
    
    const image = await generateImage(prompt);
    if (image) {
      images.push(image);
    }

    // Wait 2 seconds between requests to avoid rate limits
    if (i < prompts.length - 1) {
      console.log('⏳ Waiting 2 seconds...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  // Save results to JSON file
  const outputPath = path.join(__dirname, 'generated-images.json');
  fs.writeFileSync(outputPath, JSON.stringify(images, null, 2));

  console.log(`\n\n✅ Generated ${images.length} images!`);
  console.log(`📄 Saved to: ${outputPath}`);
  
  // Only update page.tsx if we actually generated images
  if (images.length === 0) {
    console.log('\n⚠️  No images were generated successfully.');
    console.log('❌ NOT updating app/page.tsx to preserve existing images.');
    console.log('\nPossible issues:');
    console.log('  • OpenAI billing not set up');
    console.log('  • API key invalid');
    console.log('  • Network issues');
    return;
  }
  
  // Automatically update app/page.tsx
  try {
    const pagePath = path.join(__dirname, '..', 'app', 'page.tsx');
    let pageContent = fs.readFileSync(pagePath, 'utf8');
    
    // Find and replace the SAMPLE_IMAGES array
    const imagesArrayString = 'const SAMPLE_IMAGES = ' + JSON.stringify(images, null, 2) + ';';
    
    // Replace the existing SAMPLE_IMAGES definition
    const regex = /const SAMPLE_IMAGES = \[[\s\S]*?\];/;
    
    if (regex.test(pageContent)) {
      pageContent = pageContent.replace(regex, imagesArrayString);
      fs.writeFileSync(pagePath, pageContent);
      console.log('✅ Automatically updated app/page.tsx!');
      console.log('🔄 Your dev server should hot-reload with the new images');
    } else {
      console.log('⚠️  Could not find SAMPLE_IMAGES in app/page.tsx');
      console.log('📋 Please manually add this to your app/page.tsx:\n');
      console.log(imagesArrayString);
    }
  } catch (error) {
    console.error('⚠️  Could not automatically update page:', error.message);
    console.log('\n📋 Manually copy this to your app/page.tsx:\n');
    console.log('const SAMPLE_IMAGES = ' + JSON.stringify(images, null, 2) + ';');
  }
  
  console.log('\n💰 Estimated cost: $' + (images.length * 0.04).toFixed(2));
  console.log('\n🎉 Done! Visit http://localhost:3000 to see your AI-generated images!');
}

// Check if server is running
async function checkServer() {
  try {
    const response = await fetch('http://localhost:3000');
    return true;
  } catch (error) {
    return false;
  }
}

async function main() {
  const serverRunning = await checkServer();
  
  if (!serverRunning) {
    console.error('❌ Error: Dev server is not running!');
    console.error('\nPlease start your dev server first:');
    console.error('  cd frontend');
    console.error('  npm run dev');
    console.error('\nThen run this script again.');
    process.exit(1);
  }

  await generateAll();
}

main().catch(console.error);

