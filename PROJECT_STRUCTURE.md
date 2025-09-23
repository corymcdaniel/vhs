# VHS Portfolio Project Structure

## Important: This is the Main Project Directory

**This `vhs-portfolio/` folder is the actual React TypeScript project that gets deployed.**

### Project Layout
```
September/                          <- Parent folder (ignore for development)
├── vhs-portfolio/                  <- **MAIN PROJECT** (work here)
│   ├── src/                        <- React components and hooks
│   │   ├── components/
│   │   │   ├── VHSContainer.tsx    <- Main VHS component
│   │   │   ├── BackgroundManager.tsx <- Background cycling system
│   │   │   ├── CatModal.tsx
│   │   │   ├── ContactModal.tsx
│   │   │   └── RecordingModal.tsx
│   │   ├── hooks/
│   │   │   └── useTypewriter.ts    <- Custom typewriter hook
│   │   └── App.tsx                 <- Main app
│   ├── public/                     <- Static assets
│   │   ├── bg/                     <- Optimized background images (3.7MB)
│   │   ├── cats/                   <- Cat photos
│   │   └── index.html
│   ├── package.json                <- Dependencies and scripts
│   ├── compress-images.js          <- Image optimization script
│   ├── tsconfig.json               <- TypeScript config
│   └── build/                      <- Production build output
├── index.html                      <- Old static version (ignore)
├── style.css                       <- Old static version (ignore)
├── script.js                       <- Old static version (ignore)
└── backgrounds/                    <- Old large images (ignore)
```

## Development Setup

**Always work from the `vhs-portfolio/` directory:**

```bash
cd vhs-portfolio
npm start          # Development server
npm run build      # Production build
npm test           # Run tests
npm run compress-images  # Optimize new images
```

## WebStorm Configuration

**Set `vhs-portfolio/` as your project root in WebStorm:**

1. File → Open → Select `vhs-portfolio/` folder
2. Or use "Change Project Root" to point to `vhs-portfolio/`

This ensures:
- ✅ Proper TypeScript/React IntelliSense
- ✅ Correct import paths
- ✅ Build scripts work properly
- ✅ Git integration points to right files

## Deployment

**Netlify Configuration:**
- **Base directory**: `vhs-portfolio`
- **Build command**: `npm run build`
- **Publish directory**: `vhs-portfolio/build`

## Parent Directory Notes

The parent `September/` folder contains:
- **Legacy static files**: Old HTML/CSS/JS version (pre-React)
- **Original images**: Large unoptimized images (not used)
- **Documentation**: This may have useful context but isn't part of the app

**For development, ignore everything outside `vhs-portfolio/`.**

## Key Files for Development

- **`src/components/VHSContainer.tsx`** - Main UI component
- **`src/components/BackgroundManager.tsx`** - Background cycling system
- **`src/hooks/useTypewriter.ts`** - Typewriter effect
- **`compress-images.js`** - Image optimization tool
- **`package.json`** - Dependencies and scripts

---

**TL;DR: Always `cd vhs-portfolio` first. Everything else is legacy/context.**