#!/usr/bin/env node

/**
 * Download DALL-E images and save them locally
 * This prevents expiration issues
 */

const fs = require('fs');
const path = require('path');

const imagesJsonPath = path.join(__dirname, 'generated-images.json');

async function downloadImage(url, filename) {
  console.log(`📥 Downloading: ${filename}`);
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const publicDir = path.join(__dirname, '..', 'public', 'images');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    const filepath = path.join(publicDir, filename);
    fs.writeFileSync(filepath, buffer);
    
    console.log(`✅ Saved: ${filename}`);
    return `/images/${filename}`;
  } catch (error) {
    console.error(`❌ Error downloading ${filename}:`, error.message);
    return null;
  }
}

async function main() {
  console.log('🚀 Downloading DALL-E images to save them locally...\n');
  
  // Check if generated-images.json exists
  if (!fs.existsSync(imagesJsonPath)) {
    console.error('❌ No generated-images.json found!');
    console.error('Run "npm run generate-images" first.');
    process.exit(1);
  }
  
  const images = JSON.parse(fs.readFileSync(imagesJsonPath, 'utf8'));
  
  if (!images || images.length === 0) {
    console.error('❌ No images found in generated-images.json');
    process.exit(1);
  }
  
  console.log(`Found ${images.length} images to download\n`);
  
  const updatedImages = [];
  
  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    console.log(`[${i + 1}/${images.length}]`);
    
    const filename = `${image.id}.png`;
    const localPath = await downloadImage(image.url, filename);
    
    if (localPath) {
      updatedImages.push({
        ...image,
        url: localPath  // Update to local path
      });
    }
    
    console.log('');
  }
  
  // Update page.tsx with local paths
  const pagePath = path.join(__dirname, '..', 'app', 'page.tsx');
  let pageContent = fs.readFileSync(pagePath, 'utf8');
  
  const imagesArrayString = 'const SAMPLE_IMAGES = ' + JSON.stringify(updatedImages, null, 2) + ';';
  const regex = /const SAMPLE_IMAGES = \[[\s\S]*?\];/;
  
  if (regex.test(pageContent)) {
    pageContent = pageContent.replace(regex, imagesArrayString);
    fs.writeFileSync(pagePath, pageContent);
    console.log('✅ Updated app/page.tsx with local image paths!');
  }
  
  console.log(`\n🎉 Done! Downloaded ${updatedImages.length} images`);
  console.log('📂 Images saved to: frontend/public/images/');
  console.log('🔄 Your images will now never expire!');
}

main().catch(console.error);


