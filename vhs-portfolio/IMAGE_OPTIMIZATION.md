# Image Optimization Guide

## Current Issues
Your background images are **19MB total** - way too large for web:
- `bg.jpg`: 5.3MB → Should be ~500KB
- `20250315_152239.jpg`: 2.7MB → Should be ~300KB
- `20250329_180257.jpg`: 2.4MB → Should be ~300KB
- All others: 1-2MB each → Should be ~200-300KB each

## Quick Fix Options

### Option 1: Online Tools (Easiest)
1. Go to https://tinypng.com or https://squoosh.app
2. Upload each image in `/public/backgrounds/`
3. Download compressed versions
4. Replace original files

**Target sizes:**
- Keep quality at 80-85%
- Aim for 200-500KB per image
- Use JPG format (already correct)

### Option 2: Command Line (If you have ImageMagick)
```bash
# Navigate to backgrounds folder
cd vhs-portfolio/public/backgrounds/

# Compress all images to 85% quality
for file in *.jpg; do
  magick "$file" -quality 85 "optimized_$file"
done
```

### Option 3: Modern Formats (Best)
Convert to WebP with JPG fallbacks:
- WebP: 25-35% smaller than JPG
- Still supported by 95% of browsers
- Automatic fallback to JPG for older browsers

## Expected Results
- **Before:** 19MB total, 3-8 second load times
- **After:** 2-3MB total, <1 second load times
- **Improvement:** 85-90% size reduction

## Implementation
The loading screen I just added will show while images preload, making the slow loading less noticeable until you optimize the images.

## Priority
🔴 **CRITICAL** - Do this before launching. Large images are the #1 reason portfolios feel slow and unprofessional.