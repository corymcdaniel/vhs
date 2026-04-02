#!/usr/bin/env node

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Source: ./backgrounds/ at project root (flat files + per-channel subfolders)
// Output: ./public/bg/ (served by React dev server and included in build)
const INPUT_DIR  = './backgrounds';
const OUTPUT_DIR = './public/bg';

const CHANNEL_FOLDERS = ['ch2', 'ch4', 'ch6', 'ch35'];

const MAX_DIMENSION = 1200;
const QUALITY = 85;

async function compressImage(inputPath, outputPath) {
  try {
    const stats = fs.statSync(inputPath);
    const originalSizeKB = Math.round(stats.size / 1024);

    console.log(`📸 Processing: ${path.basename(inputPath)} (${originalSizeKB}KB)`);

    const image = sharp(inputPath).rotate(); // apply EXIF orientation before anything else
    const metadata = await image.metadata();

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

    console.log(`✅ ${path.basename(outputPath)} — ${originalSizeKB}KB → ${newSizeKB}KB (${savings}% smaller)`);
    console.log(`   📐 ${width}x${height} → ${newWidth}x${newHeight}`);

  } catch (error) {
    console.error(`❌ Error processing ${inputPath}:`, error.message);
  }
}

async function processFolder(inputDir, outputDir, label) {
  if (!fs.existsSync(inputDir)) return 0;

  const files = fs.readdirSync(inputDir)
    .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));

  if (files.length === 0) return 0;

  fs.mkdirSync(outputDir, { recursive: true });

  console.log(`\n📁 ${label} — ${files.length} image(s)`);

  for (const file of files) {
    // Always output as .jpg
    const outName = file.replace(/\.(png|webp)$/i, '.jpg');
    await compressImage(path.join(inputDir, file), path.join(outputDir, outName));
  }

  return files.length;
}

async function main() {
  console.log('🎬 VHS Background Image Compressor');
  console.log('===================================');
  console.log(`📁 Source : ${INPUT_DIR}/ (+ subfolders: ${CHANNEL_FOLDERS.join(', ')})`);
  console.log(`📁 Output : ${OUTPUT_DIR}/`);
  console.log(`📏 Max    : ${MAX_DIMENSION}px`);
  console.log(`🎯 Quality: ${QUALITY}%`);

  if (!fs.existsSync(INPUT_DIR)) {
    console.error(`\n❌ Source folder not found: ${INPUT_DIR}`);
    console.error('   Create it and drop your source images in.');
    process.exit(1);
  }

  try {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });

    let total = 0;

    // Default pool (flat files in ./backgrounds/)
    total += await processFolder(INPUT_DIR, OUTPUT_DIR, 'CH3 default (./backgrounds/)');

    // Per-channel subfolders
    for (const folder of CHANNEL_FOLDERS) {
      total += await processFolder(
        path.join(INPUT_DIR, folder),
        path.join(OUTPUT_DIR, folder),
        `${folder} (./backgrounds/${folder}/)`
      );
    }

    console.log(`\n🎉 Done — ${total} image(s) processed.`);
    console.log(`💡 Run "npm run generate-images" to update the image list.`);

  } catch (error) {
    console.error('❌ Script failed:', error.message);
  }
}

try {
  require.resolve('sharp');
  main();
} catch (error) {
  console.error('❌ Sharp not installed. Run: npm install sharp');
}
