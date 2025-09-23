#!/usr/bin/env node

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const INPUT_DIR = './public/backgrounds';
const OUTPUT_DIR = './public/bg';
const MAX_DIMENSION = 1200;
const QUALITY = 85;

async function compressImage(inputPath, outputPath) {
  try {
    const stats = fs.statSync(inputPath);
    const originalSizeKB = Math.round(stats.size / 1024);

    console.log(`📸 Processing: ${path.basename(inputPath)} (${originalSizeKB}KB)`);

    const image = sharp(inputPath);
    const metadata = await image.metadata();

    // Calculate resize dimensions
    const { width, height } = metadata;
    let newWidth = width;
    let newHeight = height;

    if (width > height && width > MAX_DIMENSION) {
      newWidth = MAX_DIMENSION;
      newHeight = Math.round((height * MAX_DIMENSION) / width);
    } else if (height > MAX_DIMENSION) {
      newHeight = MAX_DIMENSION;
      newWidth = Math.round((width * MAX_DIMENSION) / height);
    }

    // Compress and resize to output folder
    await image
      .resize(newWidth, newHeight, {
        kernel: sharp.kernel.lanczos3,
        withoutEnlargement: true
      })
      .jpeg({
        quality: QUALITY,
        progressive: true,
        mozjpeg: true
      })
      .toFile(outputPath);

    const newStats = fs.statSync(outputPath);
    const newSizeKB = Math.round(newStats.size / 1024);
    const savings = Math.round(((originalSizeKB - newSizeKB) / originalSizeKB) * 100);

    console.log(`✅ Output: ${path.basename(outputPath)} - ${originalSizeKB}KB → ${newSizeKB}KB (${savings}% smaller)`);
    console.log(`📐 Resized: ${width}x${height} → ${newWidth}x${newHeight}`);

  } catch (error) {
    console.error(`❌ Error processing ${inputPath}:`, error.message);
  }
}

async function main() {
  console.log('🎬 VHS Background Image Compressor');
  console.log('==================================');
  console.log(`📁 Input: ${INPUT_DIR}`);
  console.log(`📁 Output: ${OUTPUT_DIR}`);
  console.log(`📏 Max dimension: ${MAX_DIMENSION}px`);
  console.log(`🎯 Quality: ${QUALITY}%`);
  console.log('');

  try {
    // Create output directory if it doesn't exist
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
      console.log(`📁 Created output directory: ${OUTPUT_DIR}`);
    }

    const files = fs.readdirSync(INPUT_DIR)
      .filter(file => /\.(jpg|jpeg)$/i.test(file));

    if (files.length === 0) {
      console.log('❌ No JPEG files found in backgrounds folder');
      return;
    }

    console.log(`📸 Found ${files.length} images to process:`);
    files.forEach(file => console.log(`   - ${file}`));
    console.log('');

    for (const file of files) {
      const inputPath = path.join(INPUT_DIR, file);
      const outputPath = path.join(OUTPUT_DIR, file);

      await compressImage(inputPath, outputPath);
      console.log(''); // Empty line between files
    }

    console.log('🎉 All images processed!');
    console.log('');
    console.log('💡 Tips:');
    console.log(`   - Compressed images saved to: ${OUTPUT_DIR}`);
    console.log(`   - Original files remain in: ${INPUT_DIR}`);
    console.log('   - Update your React code to use the /bg folder');

  } catch (error) {
    console.error('❌ Script failed:', error.message);
  }
}

// Check if sharp is installed
try {
  require.resolve('sharp');
  main();
} catch (error) {
  console.error('❌ Sharp not installed. Run: npm install sharp');
  console.error('   Then run this script again.');
}