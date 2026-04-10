const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const blogSrcDir = path.join(__dirname, '../src/blog');
const blogPublicDir = path.join(__dirname, '../public/blog');
const outputFile = path.join(__dirname, '../src/data/blogPosts.js');

function getFirstCommitTimestamp(filePath) {
  try {
    const result = execSync(
      `git log --follow --format="%at" -- "${filePath}"`,
      { encoding: 'utf8', cwd: path.join(__dirname, '..') }
    ).trim();
    const timestamps = result.split('\n').filter(Boolean);
    if (timestamps.length === 0) return 0;
    // Last entry is the oldest commit
    return parseInt(timestamps[timestamps.length - 1], 10);
  } catch {
    return 0;
  }
}

function extractTitle(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const match = content.match(/^# (.+)$/m);
    return match ? match[1].trim() : path.basename(filePath, '.md');
  } catch {
    return path.basename(filePath, '.md');
  }
}

function extractDescription(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    // Find first non-empty, non-heading, non-html line
    const lines = content.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      if (trimmed.startsWith('#')) continue;
      if (trimmed.startsWith('<')) continue;
      // Strip markdown formatting (*italic*, **bold**, etc.)
      const plain = trimmed.replace(/[*_`~]/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
      if (plain.length > 20) {
        return plain.length > 160 ? plain.slice(0, 157) + '...' : plain;
      }
    }
    return '';
  } catch {
    return '';
  }
}

try {
  if (!fs.existsSync(blogSrcDir)) {
    console.log('No src/blog directory found, skipping blog generation.');
    process.exit(0);
  }

  // Ensure public/blog exists
  if (!fs.existsSync(blogPublicDir)) {
    fs.mkdirSync(blogPublicDir, { recursive: true });
  }

  const mdFiles = fs.readdirSync(blogSrcDir)
    .filter(f => f.endsWith('.md'))
    .sort();

  const posts = mdFiles.map(filename => {
    const srcPath = path.join(blogSrcDir, filename);
    const timestamp = getFirstCommitTimestamp(srcPath);
    const title = extractTitle(srcPath);
    const description = extractDescription(srcPath);
    const slug = path.basename(filename, '.md');
    return { filename, slug, title, description, timestamp };
  });

  // Sort ascending by first commit time
  posts.sort((a, b) => a.timestamp - b.timestamp);

  // Copy each .md to public/blog/
  for (const post of posts) {
    const src = path.join(blogSrcDir, post.filename);
    const dest = path.join(blogPublicDir, post.filename);
    fs.copyFileSync(src, dest);
  }

  // Write data file
  const dataDir = path.dirname(outputFile);
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

  const postsJson = posts.map(({ filename, slug, title, description }) => ({ filename, slug, title, description }));
  const output = `// Auto-generated blog post list
// Generated on: ${new Date().toISOString()}
// Source: src/blog/*.md — ordered by first git commit (ascending)
// DO NOT EDIT — run npm run generate-blog to regenerate

export const blogPosts = ${JSON.stringify(postsJson, null, 2)};
`;

  fs.writeFileSync(outputFile, output);
  console.log(`✅ Blog: ${posts.length} post(s) → src/data/blogPosts.js`);
  posts.forEach(p => console.log(`   ${p.filename}: ${p.title}`));
} catch (err) {
  console.error('Failed to generate blog list:', err);
  process.exit(1);
}
