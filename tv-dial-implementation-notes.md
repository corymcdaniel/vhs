# TV Dial Implementation Notes

## Current Status

The channel system is fully built and ready to test. The only remaining step is assigning background images to each channel.

---

## Images to Assign

You added 3 images to `./a1/`:

| File | Channel | Theme |
|------|---------|-------|
| `a1/20250515_115302.jpg` | ? | ? |
| `a1/20240309_180848.jpg` | ? | ? |
| `a1/20240308_142426.jpg` | ? | ? |

**Channels needing images:**

| Channel | Theme | Vibe |
|---------|-------|------|
| Channel 2 | Michigan Summers | Light, warm greens, golden light, lake reflections, fireflies |
| Channel 4 | Desert Nights | Dark, Sonoran blue-black sky, stars, saguaro silhouettes |
| Channel 3.5 | Hidden | Creepy, atmospheric, dark, mysterious |

**To assign images:** Edit `script.js` and update the `channelTemplates` object (around line 16-78) with the correct paths.

---

## What's Been Built

### Files Modified

1. **`channel-system.md`** - Full documentation of the channel system architecture
2. **`style.css`** - Added CSS variables for theming, dial styles, smack animations
3. **`script.js`** - Added channel state manager, dial component, smack mechanic
4. **`index.html`** - Added dial HTML and smack prompt

### Channel System Features

- **Channel State Manager** (`channelState` object)
  - Tracks current/previous channel
  - Manages smack count for 3.5
  - Handles transitions

- **Channel Templates** (`channelTemplates` object)
  - Each channel defines: name, CSS class, backgrounds, effect settings
  - Easy to customize per-channel behavior

- **CSS Variables** (in `:root` and `body.channel-*` classes)
  - `--bg-primary`, `--bg-overlay-1/2/3`
  - `--text-primary`, `--text-glow`, `--text-glow-dark`
  - `--link-color`, `--link-hover`, `--cat-link-color`
  - `--static-opacity`, `--scanline-opacity`, `--tracking-opacity`, `--scramble-opacity`
  - `--chromatic-offset`

- **TV Dial Component**
  - Click and drag rotation
  - Touch support for mobile
  - Rotation mapping:
    - 0-60° → Channel 2
    - 60-120° → Channel 3
    - 120-145° → Channel 3.5 (hidden zone)
    - 145-180° → Channel 4
  - Snaps to channel positions (except 3.5)

- **Smack Mechanic** (Channel 3.5)
  - Stop dial between 3 and 4 → static appears
  - Wait 2 seconds → prompt appears
  - Press spacebar 3 times to "smack" the TV
  - Progressive VHS degradation on each smack
  - Final smack reveals hidden site

---

## How to Test

1. Open `index.html` in browser
2. Starts on Channel 3 (VHS mode with full effects)
3. Drag the dial:
   - Left → Channel 2 (Michigan Summers)
   - Right → Channel 4 (Desert Nights)
   - Stop between 3 and 4 → Channel 3.5 (static)
4. On Channel 3.5:
   - Wait for "press space to smack the TV" prompt
   - Press spacebar 3 times
   - Watch the VHS aesthetic break down
   - Hidden site reveals

---

## Next Steps

1. **Assign images to channels** - View images, decide which goes where, update `channelTemplates`

2. **Refine dial interaction** (optional)
   - Add detent/click feel when snapping to channels
   - Add sound effects (dial click, static, smack)

3. **Build hidden site content** (Channel 3.5 destination)
   - What prose/content appears?
   - Background image choice
   - Interaction model

---

## Key Code Locations

| Feature | File | Location |
|---------|------|----------|
| Channel templates | `script.js` | Lines 16-78 |
| `switchChannel()` | `script.js` | Lines 81-130 |
| `applyChannelConfig()` | `script.js` | Lines 132-175 |
| Smack mechanic | `script.js` | Lines 262-365 |
| Dial component | `script.js` | Lines 367-503 |
| CSS variables | `style.css` | Lines 1-135 |
| Dial styles | `style.css` | Lines 730-850 |
| Smack animations | `style.css` | Lines 850-950 |

---

## Bugs Fixed (for reference)

1. Duplicate interval functions causing performance issues
2. Hardcoded overlay colors not respecting channel themes
3. VHS effects running on non-VHS channels
4. Touch event passive warnings
5. Touch event null reference errors
6. Smack prompt text not resetting
7. Typewriter effect destroying HTML links
8. Static overlay styles not resetting properly
