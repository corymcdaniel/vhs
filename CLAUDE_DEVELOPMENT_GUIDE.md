# Claude Development Guide - VHS Portfolio Project

This document serves as a quick reference for Claude when working on the VHS Portfolio project to prevent recurring issues and maintain consistency.

## 🚨 CRITICAL ISSUES TO NEVER BREAK

### VHS Static Flash Effect
**LOCATION**: `src/components/SimpleBackgroundManager.tsx`
**IMPLEMENTATION**: Must use `.static-flash` CSS class from `VHSContainer.css`

```typescript
// ✅ CORRECT - Use CSS class
container.classList.add('static-flash');
setTimeout(() => {
  container.classList.remove('static-flash');
}, 800);

// ❌ WRONG - Never use inline styles for static effect
container.style.filter = 'contrast(8) brightness(0.1)'; // This is barely visible!
```

**WHY IT KEEPS BREAKING**: The proper CSS class exists but developers keep replacing it with weak inline CSS filters.

**THE RULE**: Always use the `.static-flash` CSS class. Never replace with inline styles.

---

## 📁 Project Structure (FLATTENED)

```
C:\Code\Generative\September\           <- ROOT (React project)
├── src/
│   ├── components/
│   │   ├── VHSContainer.tsx           <- Main component
│   │   ├── VHSContainer.css           <- Contains .static-flash CSS!
│   │   ├── SimpleBackgroundManager.tsx <- Background cycling + static effect
│   │   ├── VHSEffects.tsx
│   │   └── ContactModal.tsx
│   ├── hooks/
│   │   └── useTypewriter.ts
│   └── App.tsx
├── public/bg/                         <- Optimized images (~3MB total)
├── package.json                       <- React scripts (NOT minimal!)
├── netlify.toml                       <- Deployment config
└── build/                            <- Production output
```

**IMPORTANT**: The project was flattened from `vhs-portfolio/` subdirectory to root. No `vhs-portfolio/` folder should exist.

---

## 🚀 Deployment (Netlify)

### Settings
- **Repository**: `https://github.com/corymcdaniel/vhs`
- **Production Branch**: `main` (NOT `master`!)
- **Base Directory**: *(empty/blank)*
- **Build Command**: `npm ci && npm run build`
- **Publish Directory**: `build` (no leading slash!)

### Common Issues
1. **Branch Mismatch**: Netlify was deploying from `master` instead of `main`
2. **Wrong package.json**: Finds minimal package.json instead of React one
3. **Missing netlify.toml**: Config file not being detected

### Troubleshooting Commands
```bash
# Verify files are committed
git ls-files | grep netlify
git show HEAD:package.json | head -5

# Check branch
git branch -a
git log --oneline -3
```

---

## 📦 Package.json Requirements

**Must contain React scripts**:
```json
{
  "name": "vhs-portfolio",
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test"
  },
  "dependencies": {
    "react": "^19.1.1",
    "react-scripts": "5.0.1"
    // ... other React deps
  }
}
```

**If Netlify shows "2 packages audited"**: Wrong package.json being used (check branch settings).

---

## 🎬 VHS Effects Architecture

### Core Components
1. **VHSContainer.tsx** - Main component with typewriter and navigation
2. **SimpleBackgroundManager.tsx** - Background cycling with static flash
3. **VHSEffects.tsx** - Additional VHS visual effects
4. **VHSContainer.css** - All VHS styling including `.static-flash`

### Static Flash Effect Details
**CSS Class** (in VHSContainer.css):
```css
.static-flash {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: /* Complex static pattern */;
  opacity: 1;
  z-index: 5;
  animation: staticNoise 800ms ease-out forwards;
  mix-blend-mode: screen;
}
```

**Trigger** (in SimpleBackgroundManager.tsx):
```typescript
const changeBackground = useCallback(() => {
  // Add static flash
  container.classList.add('static-flash');

  setTimeout(() => {
    // Change background
    container.style.backgroundImage = `url('${newBackground}')`;

    // Remove static flash after animation completes
    setTimeout(() => {
      container.classList.remove('static-flash');
    }, 800); // Must match CSS animation duration
  }, 200);
}, []);
```

---

## 🐛 Common Debugging Issues

### "Static Effect Disappeared"
1. Check if `.static-flash` CSS class exists in `VHSContainer.css`
2. Verify `SimpleBackgroundManager.tsx` uses `classList.add/remove()` not inline styles
3. Ensure timing matches CSS animation duration (800ms)

### "Build Fails on Netlify"
1. Check production branch is set to `main`
2. Verify `netlify.toml` is committed and pushed
3. Ensure base directory is empty (not pointing to old subdirectory)

### "Package.json Not Found"
1. Netlify is likely deploying from wrong branch
2. Check if branch was recently changed from `master` to `main`
3. Clear Netlify cache and redeploy

### "Images Not Loading"
1. Images are in `public/bg/` directory
2. Background paths use `/bg/filename.jpg` (no `public/` prefix)
3. Check if `SimpleBackgroundManager` image array is correct

---

## 📝 Development Workflow

### Before Making Changes
1. Always check current branch: `git branch`
2. Verify you're in project root (has `package.json` and `src/`)
3. Test locally: `npm start`

### After Making Changes
1. Test build: `npm run build`
2. Commit with descriptive message
3. Push to `main` branch
4. Monitor Netlify deployment

### When Adding Features
1. Follow existing VHS aesthetic patterns
2. Use CSS classes instead of inline styles
3. Document any critical functionality
4. Test on multiple screen sizes

---

## 💡 Quick Reference Commands

```bash
# Local development
npm start                    # Start dev server
npm run build               # Test production build
npm run compress-images     # Optimize new images

# Git workflow
git status                  # Check current state
git add . && git commit -m "message"
git push origin main        # Deploy to production

# Debugging
find . -name "package.json" -not -path "./node_modules/*"  # Find package.json files
git show HEAD:netlify.toml  # Check deployed config
git ls-tree HEAD | grep -E "(package|netlify)"  # Verify files are committed
```

---

## 🎯 Project Goals

- **Authentic VHS aesthetic** with proper static, distortion, and chromatic effects
- **Progressive navigation** that appears as typewriter content is revealed
- **Responsive design** that works on mobile and desktop
- **Fast loading** with optimized images (~3MB total, down from 19MB)
- **Accessible** with effects toggle for photosensitive users

---

## ⚠️ Things to NEVER Do

1. **Don't replace `.static-flash` CSS with inline styles**
2. **Don't move files back into `vhs-portfolio/` subdirectory**
3. **Don't change Netlify branch from `main` to `master`**
4. **Don't add unoptimized images larger than 500KB**
5. **Don't remove the base directory setting (keep it empty)**
6. **Don't use `git rebase -i` or interactive git commands**

---

## 📞 Emergency Fixes

### If Static Effect Breaks Again
```typescript
// In SimpleBackgroundManager.tsx, ensure this pattern:
container.classList.add('static-flash');  // Not inline styles!
setTimeout(() => {
  container.classList.remove('static-flash');
}, 800);  // Must match CSS animation duration
```

### If Netlify Deployment Fails
1. Check production branch setting in Netlify dashboard
2. Verify `netlify.toml` exists: `git ls-files | grep netlify`
3. Clear cache and redeploy from Netlify dashboard

### If Package.json Issues
```bash
# Verify correct React package.json exists
git show HEAD:package.json | grep react-scripts
# Should show: "react-scripts": "5.0.1"
```

---

*Last Updated: September 23, 2025*
*This guide prevents recurring issues with VHS static effects, deployment, and project structure.*