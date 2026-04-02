const fs = require('fs');
const path = require('path');

const bgDir    = path.join(__dirname, '../public/bg');
const outputFile = path.join(__dirname, '../src/data/backgroundImages.js');

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

// Per-channel subfolders inside /public/bg/
const CHANNEL_FOLDERS = {
  ch2:  'ch2',  // Channel 2 — Michigan Summers
  ch4:  'ch4',  // Channel 4 — Desert Nights
  ch6:  'ch6',  // Channel 6 — TBD
  ch35: 'ch35', // Channel 6.5 — Hidden / greyscale
};

function scanImages(dir, urlPrefix) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(f => IMAGE_EXTENSIONS.includes(path.extname(f).toLowerCase()))
    .map(f => `${urlPrefix}/${f}`)
    .sort();
}

try {
  if (!fs.existsSync(bgDir)) {
    console.error('❌ Background directory not found:', bgDir);
    process.exit(1);
  }

  // Default pool — flat images in /public/bg/ (channel 3)
  const defaultImages = scanImages(bgDir, '/bg');

  // Per-channel pools
  const channelImages = {};
  for (const [key, folder] of Object.entries(CHANNEL_FOLDERS)) {
    const dir = path.join(bgDir, folder);
    const images = scanImages(dir, `/bg/${folder}`);
    channelImages[key] = images;

    // Folder is populated by compress-images.js from ./bg/<folder>/
    // If missing, it just means no images have been compressed for that channel yet.
  }

  const dataDir = path.dirname(outputFile);
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

  const output = `// Auto-generated background images list
// Generated on: ${new Date().toISOString()}
// Default (CH3): ${defaultImages.length} images
// Per-channel pools: ${Object.entries(channelImages).map(([k,v]) => `${k}=${v.length}`).join(', ')}

// Channel 3 default pool — images in /public/bg/
export const backgroundImages = ${JSON.stringify(defaultImages, null, 2)};

// Per-channel image pools — images in /public/bg/<folder>/
// If a channel folder is empty, SimpleBackgroundManager falls back to backgroundImages.
export const channelBackgroundImages = {
  ch2:  ${JSON.stringify(channelImages.ch2, null, 2)},
  ch4:  ${JSON.stringify(channelImages.ch4, null, 2)},
  ch6:  ${JSON.stringify(channelImages.ch6, null, 2)},
  ch35: ${JSON.stringify(channelImages.ch35, null, 2)},
};

export const getRandomImage = () =>
  backgroundImages[Math.floor(Math.random() * backgroundImages.length)];

export const getImageCount = () => backgroundImages.length;

export const getImageByIndex = (index) =>
  backgroundImages[index % backgroundImages.length];
`;

  fs.writeFileSync(outputFile, output);

  console.log(`✅ Generated background images list:`);
  console.log(`   📁 Source: ${bgDir}`);
  console.log(`   📄 Output: ${outputFile}`);
  console.log(`   🖼️  CH3 default: ${defaultImages.length} images`);
  for (const [key, images] of Object.entries(channelImages)) {
    console.log(`   🖼️  ${key}: ${images.length} images`);
  }

} catch (error) {
  console.error('❌ Error generating image list:', error.message);
  process.exit(1);
}
