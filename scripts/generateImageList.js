const fs = require('fs');
const path = require('path');

// Directory containing background images
const bgDir = path.join(__dirname, '../public/bg');
const outputFile = path.join(__dirname, '../src/data/backgroundImages.js');

try {
  // Check if bg directory exists
  if (!fs.existsSync(bgDir)) {
    console.error('❌ Background directory not found:', bgDir);
    process.exit(1);
  }

  // Read directory and filter for image files
  const allFiles = fs.readdirSync(bgDir);
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

  const images = allFiles
    .filter(file => {
      const ext = path.extname(file).toLowerCase();
      return imageExtensions.includes(ext);
    })
    .map(file => `/bg/${file}`)
    .sort(); // Sort alphabetically

  // Generate the JavaScript file content
  const output = `// Auto-generated background images list
// Generated on: ${new Date().toISOString()}
// Total images: ${images.length}

export const backgroundImages = ${JSON.stringify(images, null, 2)};

// Helper functions
export const getRandomImage = () => {
  return backgroundImages[Math.floor(Math.random() * backgroundImages.length)];
};

export const getImageCount = () => backgroundImages.length;

export const getImageByIndex = (index) => {
  return backgroundImages[index % backgroundImages.length];
};
`;

  // Ensure data directory exists
  const dataDir = path.dirname(outputFile);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Write the generated file
  fs.writeFileSync(outputFile, output);

  console.log(`✅ Generated background images list:`);
  console.log(`   📁 Source: ${bgDir}`);
  console.log(`   📄 Output: ${outputFile}`);
  console.log(`   🖼️  Images found: ${images.length}`);

  // List first few images as preview
  if (images.length > 0) {
    console.log(`   📋 Preview:`);
    images.slice(0, 5).forEach((img, i) => {
      console.log(`      ${i + 1}. ${img}`);
    });
    if (images.length > 5) {
      console.log(`      ... and ${images.length - 5} more`);
    }
  }

} catch (error) {
  console.error('❌ Error generating image list:', error.message);
  process.exit(1);
}