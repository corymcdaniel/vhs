# VHS Portfolio

A retro VHS-themed portfolio website with authentic tape distortion effects, typewriter animations, and progressive navigation.

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Open [http://localhost:3000](http://localhost:3000) to view the site

## Project Overview

This project started as a vanilla HTML/CSS/JS website and was converted to React TypeScript for better maintainability and debugging. The site features:

### VHS Aesthetic Features
- **Authentic VHS distortion effects**: Static overlays, scan lines, tracking lines, and background scrambling
- **Dynamic background cycling**: Rotates through background images with VHS transition effects
- **Chromatic aberration**: Red/blue text shadows for that classic VHS look
- **Typewriter animation**: Progressive text reveal with realistic typing variations
- **Accessibility controls**: Toggle to reduce effects for photosensitive users

### Technical Implementation
- **React TypeScript**: Modern component-based architecture
- **Custom Hooks**: `useTypewriter` hook for realistic typing effects
- **CSS Animations**: Complex keyframe animations for VHS distortions
- **Progressive Navigation**: Navigation elements appear as relevant content is typed
- **Modal System**: Cat photo gallery with VHS-styled modals
- **Z-index Management**: Careful layering to maintain effects while preserving interactivity

### Development Journey

#### Initial Challenges (Vanilla Implementation)
- **Data-text overflow**: CSS `::before` content was bleeding outside span boundaries
- **Unclickable links**: VHS effects layers were blocking pointer events
- **Excessive flashing**: Rapid animations caused accessibility concerns
- **Complex link rendering**: Conditional link rendering within typewriter text was problematic

#### Solutions Implemented
1. **CSS Layering Fix**: Restructured z-index hierarchy to separate effects from interactive elements
2. **React Conversion**: Migrated to React TypeScript for better state management and debugging
3. **Navigation Bar Approach**: Separated interactive elements from typewriter text into a progressive navigation bar
4. **Accessibility Controls**: Added toggle for users sensitive to flashing effects
5. **Background Effects Restoration**: Carefully restored all VHS visual effects after React conversion

### Project Structure

```
src/
├── components/
│   ├── VHSContainer.tsx      # Main VHS component with typewriter and navigation
│   ├── VHSContainer.css      # All VHS styling and animations
│   └── CatModal.tsx          # Modal component for cat photos
├── hooks/
│   └── useTypewriter.ts      # Custom hook for typewriter effect
└── App.tsx                   # Main app component with state management
```

### Key Components

#### VHSContainer
- Manages typewriter text progression
- Controls background image cycling
- Handles VHS effect animations
- Progressive navigation bar rendering

#### useTypewriter Hook
- Character-by-character text revelation
- Realistic typing variations with random delays
- Line-by-line progression with proper state management
- Completion tracking for navigation triggers

#### CSS Effects System
- Multiple overlay layers for authentic VHS distortion
- Blend modes (multiply, screen) for realistic color interactions
- Complex keyframe animations for various distortion types
- Responsive design maintaining VHS aesthetic

### Available Scripts

- `npm start` - Development server on port 3000
- `npm run build` - Production build
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App (not recommended)

### Browser Compatibility

Optimized for modern browsers with support for:
- CSS Grid and Flexbox
- CSS Blend Modes
- Complex CSS Animations
- ES6+ JavaScript features

### Performance Considerations

- Optimized animation loops to prevent excessive CPU usage
- Conditional effect rendering based on user preferences
- Efficient React state management
- Minimal re-renders through proper dependency arrays

This project demonstrates the evolution from a simple static site to a sophisticated React application while maintaining the authentic VHS aesthetic and improving user experience.

**Production Status**: ✅ Deployed and optimized
## Work channel (Channel 4 and /work)

Channel 4 is the work channel. Tuning to it opens the **Work** panel, and a WORK button sits in the navigation bar on every channel, just ahead of MUSIC. `corymcdaniel.com/work` skips the intro and opens the panel directly, so the portfolio can be shared as a plain link.

- Content lives in `src/data/portfolio.ts` (current role, stats, personal projects, earlier roles). Edit that file to update the portfolio; `WorkModal.tsx` only handles layout.
- Styling is in `WorkModal.css`: Channel 4's navy and white palette with light scanlines, and VT323 for headings only so body copy stays readable.
- Site keyboard shortcuts are paused while the panel is open so it can scroll normally. Escape closes it.

## Analytics consent

Google Analytics only loads after a visitor agrees. A small VCR-style on-screen display ("RECORD THIS VISIT?") rises from the bottom-left on any page, intro included, until the visitor answers; **● REC** allows analytics and **■ STOP** declines. The choice is saved in `localStorage` (`vhs-analytics`), and **Analytics settings** in the Help modal reopens the banner.

- Logic lives in `src/utils/analytics.ts`, styling in `src/components/ConsentBanner.css`. It's ported from Show Log's banner.
- The banner and GA never run on localhost or Netlify deploy previews (`--` in the hostname), so local testing and previews don't count.
- GA is configured with Google signals and ad personalization off. No extra packages: gtag.js is injected by hand.
