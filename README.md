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