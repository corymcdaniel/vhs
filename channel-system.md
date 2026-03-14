# TV Dial Channel System

## Overview

The channel system transforms the site into a multi-themed experience controlled by a TV dial metaphor. Each "channel" represents a different version of the site with its own visual identity, content focus, and effect configuration.

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      TV Dial UI                         │
│                   (rotation input)                      │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│                  Channel State                          │
│  { current: 3, previous: null, smackCount: 0 }         │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│               Channel Templates                         │
│  Defines: backgrounds, effects, content, colors         │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│              applyChannelConfig()                       │
│  - Sets CSS class on body                               │
│  - Toggles effect layers                                │
│  - Updates background images                            │
│  - Starts/stops glitch intervals                        │
└─────────────────────────────────────────────────────────┘
```

---

## Channels

### Channel 2 — Michigan Summers
- **Theme:** Light mode, nostalgic, warm
- **Visual Direction:** Warm greens, golden light, lake reflections, fireflies
- **Content Focus:** Personal history, roots, where I came from
- **Effects:** Minimal - subtle scanlines only, no VHS degradation

### Channel 3 — VHS Default
- **Theme:** Current site aesthetic
- **Visual Direction:** VHS green, CRT glow, tape degradation
- **Content Focus:** Main site content
- **Effects:** Full VHS treatment - static, scanlines, glitches, chromatic aberration

### Channel 4 — Desert Nights
- **Theme:** Dark mode, Sonoran desert at night
- **Visual Direction:** Blue-black sky, stars, saguaro silhouettes
- **Content Focus:** Professional/current work, Phoenix life
- **Effects:** Clean and minimal, slight scanlines for texture

### Channel 3.5 — Hidden
- **Theme:** Dark, atmospheric, mysterious
- **Visual Direction:** Full background image, slow prose reveal
- **Content Focus:** Experiential, exploratory
- **Effects:** None - stripped of all TV aesthetic
- **Access:** Hidden channel, requires "smack" mechanic to unlock

---

## File Structure

```
├── index.html          # Dial HTML added
├── style.css           # Channel CSS variables + dial styles
├── script.js           # Channel state, templates, dial logic
└── channel-system.md   # This documentation
```

---

## CSS Variables

Each channel sets its own CSS custom properties:

```css
:root {
  /* Channel 3 defaults */
  --bg-primary: #000;
  --text-primary: #00ff00;
  --text-glow: #00ff00;
  --accent: #00ffff;
  --filter-sepia: 0.3;
  --filter-contrast: 1.2;
  --scanline-opacity: 1;
  --static-opacity: 0.05;
}

body.channel-2 { /* Michigan Summers overrides */ }
body.channel-3 { /* VHS Default - uses root */ }
body.channel-4 { /* Desert Nights overrides */ }
body.channel-35 { /* Hidden overrides */ }
```

All existing CSS that uses hardcoded colors should reference these variables instead.

---

## Channel State

```javascript
const channelState = {
  current: 3,        // Active channel (2, 3, 3.5, or 4)
  previous: null,    // Last channel (for transitions)
  smackCount: 0,     // Smack counter for 3.5 mechanic
  isTransitioning: false  // Prevents rapid switching
};
```

---

## Channel Templates

```javascript
const channelTemplates = {
  2: {
    name: 'Michigan Summers',
    bodyClass: 'channel-2',
    backgrounds: [...],
    effects: { static: false, scanlines: 0.1, glitches: false, vhsFilter: false },
    content: { ... }
  },
  3: { /* VHS Default */ },
  4: { /* Desert Nights */ },
  3.5: { /* Hidden */ }
};
```

---

## Key Functions

### `switchChannel(channel)`
Main entry point for changing channels.
1. Updates `channelState`
2. Swaps body class
3. Calls `applyChannelConfig()`
4. Resets smack count if leaving 3.5

### `applyChannelConfig(config)`
Applies a channel template to the DOM:
1. Updates background images array
2. Shows/hides effect layers (static, scanlines)
3. Starts/stops glitch intervals
4. Toggles VHS filter class

### `handleSmack()`
Handles spacebar press when on channel 3.5:
1. Increments smack counter
2. Triggers progressive degradation effect
3. On third smack, reveals hidden site

### `triggerSmackEffect(level)`
Applies visual degradation based on smack level:
- **Level 1:** Jitter, tracking lines, distorted audio
- **Level 2:** Color bleed, frame tilt, edge static
- **Level 3:** Full breakdown, transition to hidden site

---

## TV Dial Component

### HTML Structure
```html
<div class="tv-dial-container">
  <div class="tv-dial">
    <div class="dial-knob"></div>
    <div class="dial-markers">
      <span class="marker" data-channel="2">2</span>
      <span class="marker" data-channel="3">3</span>
      <span class="marker" data-channel="4">4</span>
    </div>
  </div>
</div>
```

### Rotation Mapping
```
Degrees → Channel
0-90°   → Channel 2
90-170° → Channel 3
170-190° → Channel 3.5 (hidden zone, unmarked)
190-270° → Channel 4
```

### Interaction
- Click and drag to rotate
- Detents/stops at each channel
- 3.5 has no detent (easy to pass through)
- Visual feedback: dial position, channel indicator

---

## Smack Mechanic (Channel 3.5)

### Discovery Flow
1. User rotates dial to space between 3 and 4
2. Screen shows static/instability (channel 3.5 detected)
3. After ~2 seconds, subtle prompt appears in static
4. User presses spacebar to "smack" the TV

### Smack Progression

**Smack 1:**
- Picture jitters hard
- Tracking lines shoot across screen
- VHS effects glitch momentarily

**Smack 2:**
- Color starts bleeding/desaturating
- Frame tilts slightly
- Static creeps in at edges
- More VHS effects drop out

**Smack 3:**
- Hard cut or collapse animation
- Beat of silence
- Hidden site appears suddenly

### State Reset
- Smack count resets if user turns away from 3.5
- Must complete all 3 smacks in one session

---

## Transitions

### Channel Switch Transition
1. Brief static burst (like tuning an old TV)
2. Optional "chunk" sound effect
3. New channel fades/cuts in
4. Effects initialize based on channel config

### 3.5 Reveal Transition
1. Progressive VHS degradation (smacks 1-3)
2. Final breakdown animation
3. Clean cut to hidden site (no VHS framing)

---

## Keyboard Controls

| Key | Channel 3 | Channel 3.5 | Other Channels |
|-----|-----------|-------------|----------------|
| Space | Static burst | Smack TV | — |
| G | Text glitch | — | — |
| B | Background glitch | — | — |
| N | Next background | — | Next background |

---

## Future Considerations

- **Audio:** Channel-specific ambient audio, dial click sounds, smack effects
- **Persistence:** Remember last channel in localStorage
- **Content:** Unique content per channel vs. shared content with different presentation
- **Mobile:** Touch-friendly dial interaction
- **Accessibility:** Keyboard navigation for dial, reduced motion options
