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
├── App.tsx                     # Intro picker → intro → the TV; routes /work and /blog
├── components/
│   ├── IntroSelector.tsx       # "Select experience": VHS Tape, Tube TV or DVD
│   ├── VHSTapeLoadingIntro.tsx # VHS intro: the tape loads
│   ├── TubeTVIntro.tsx         # Tube TV intro: instant signal
│   ├── DVDIntro.tsx            # DVD intro: the disc spins up
│   ├── DVDMenu.tsx             # DVD main menu: nav items load clockwise
│   ├── VHSContainer.tsx        # The main screen: typewriter text, effects, channels, modals
│   ├── VHSNavigationBar.tsx    # Bottom nav that appears as the text mentions each topic
│   ├── VHSTimestamp.tsx        # Top-right REC/STOP clock (opens analytics settings)
│   ├── TVDial.tsx              # Channel dial, including hidden channels
│   ├── SimpleBackgroundManager.tsx # Background photo cycling
│   ├── VHSTransition.tsx, VHSEffects.tsx, TextScrambleEffect.tsx, ... # VHS distortion effects
│   ├── AutoEjectSequence.tsx, OhNoMessage.tsx, OsakaEffects.tsx      # The eject easter egg
│   ├── WorkModal.tsx           # Work panel (Channel 4 and /work)
│   ├── HoldForSpecs.tsx        # HOLD ▶▶ SPECS button on Work cards
│   ├── BlogModal.tsx, AboutModal.tsx, ContactModal.tsx, HelpModal.tsx,
│   │   PhotoGalleryModal.tsx, CatModal.tsx, OsakaModal.tsx, VideoModal.tsx # Modals
│   └── ConsentBanner.tsx       # Analytics consent (REC / STOP)
├── data/
│   ├── portfolio.ts            # Work panel content
│   └── blogPosts.js            # Generated from src/blog/*.md at build time
├── hooks/
│   ├── useTypewriter.ts        # Character-by-character typing
│   └── useChannel.ts           # Current channel and switching
├── utils/
│   ├── analytics.ts            # Consent-gated Google Analytics
│   ├── logger.ts               # console logging in development only
│   ├── markdownLoader.ts       # Blog Markdown → HTML
│   └── japanese*.ts, phoneticJapanese.ts # Text-scramble characters for the effects
└── blog/                       # Blog posts as Markdown
public/
├── bg/                         # Background photos
├── cats/                       # Charlie and Papago (metadata stripped)
└── og-image.jpg                # Link-preview image (1200×630)
```

### Packages

| Package | Why |
| --- | --- |
| `react`, `react-dom` | The UI. |
| `react-router-dom` | Real URLs for `/work` and `/blog/<post>`, so they can be shared and opened directly. |
| `react-helmet-async` | Per-page `<title>` and meta tags, such as the Work panel's description for link previews. |
| `marked` | Turns the blog's Markdown files into HTML. |
| `typescript` | Type checking for the app's components and data. |
| `@testing-library/*`, `@types/*` | Tests and type definitions. |

No CSS framework: all styling is hand-written CSS per component.

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

- Content lives in `src/data/portfolio.ts` (current role, freelance work, personal projects, earlier roles). Edit that file to update the portfolio; `WorkModal.tsx` only handles layout.
- Cards are written casually. Any item with a `specs` field (and the Fullstory summary's `summarySpecs`) gets a **HOLD ▶▶ SPECS** tape-deck button: holding it with mouse, touch, Space or Enter fast-forwards to the technical version with a tracking flicker, and letting go switches back (`HoldForSpecs.tsx`). Both versions share one grid cell, so cards don't change size.
- Styling is in `WorkModal.css`: Channel 4's navy and white palette with light scanlines, and VT323 for headings only so body copy stays readable.
- Site keyboard shortcuts are paused while the panel is open so it can scroll normally. Escape closes it.

## DVD intro

The intro picker on `/` offers three experiences: VHS Tape, Tube TV and **DVD**. Picking DVD plays a short disc intro (`DVDIntro.tsx`): the tray slides out, the disc drops in and spins up with a rainbow sheen, and a click skips ahead. It then opens a glossy early-2000s **Main Menu** (`DVDMenu.tsx`), where the site's nav items (WORK, MUSIC, PHOTOS, CHARLIE, PAPAGO, PHOENIX, DESERT) load one by one, clockwise from 12 o'clock, around a spinning PLAY disc.

- PLAY enters the site with the intro text already typed. WORK and the cats open their panel over the menu, and closing it returns to the menu. The links open in a new tab and the menu stays put.
- Arrow keys move around the ring like a remote; Enter picks.
- Ring positions and load delays are plain CSS rules per item (`--angle`, `--delay`), so there are no inline styles. Adding an item means adding a CSS rule and respacing the angles (360° ÷ item count).

## Analytics consent

Google Analytics only loads after a visitor agrees. A small VCR-style on-screen display ("RECORD THIS VISIT?") rises from the bottom-left on any page, intro included, until the visitor answers; **● REC** allows analytics and **■ STOP** declines. The choice is saved in `localStorage` (`vhs-analytics`), and both **Analytics settings** in the Help modal and the top-right REC timestamp reopen the banner, with the current choice and a short description of what each button does.

- Logic lives in `src/utils/analytics.ts`, styling in `src/components/ConsentBanner.css`. It's ported from Show Log's banner.
- The banner and GA never run on localhost or Netlify deploy previews (`--` in the hostname), so local testing and previews don't count.
- GA is configured with Google signals and ad personalization off. No extra packages: gtag.js is injected by hand.
