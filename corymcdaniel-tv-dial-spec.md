# corymcdaniel.com TV Dial Navigation

## Concept Overview

The site uses an old TV dial as the primary navigation metaphor. Each "channel" represents a different version/mode of the site, with a hidden channel accessible through a secret interaction.

---

## Channels

### Channel 3 (Default)
- The main site as it currently exists
- VHS aesthetic, full effects
- This is the "normal" broadcast — where you'd tune in for the VCR

### Channel 4 — Desert Nights
- Dark mode, but thematically tied to the Sonoran desert at night
- Present-day, "who I am now"
- Could hold more professional/current work, Phoenix life
- Visual direction: Sonoran blue-black sky, stars, saguaro silhouettes

### Channel 2 — Michigan Summers
- Light mode, tied to Michigan geography
- Nostalgic, open, "where I came from"
- Could hold more personal/roots content
- Visual direction: warm greens, golden light, lake reflections, fireflies

---

## The Hidden Channel: 3.5

### Discovery
- Channel 3.5 is not shown on the dial
- User must stop the dial in the space between 3 and 4
- When they hit this spot, the screen goes to static or something unstable (picture rolls, horizontal line sweep, detuned TV feel)
- Nothing obvious happens at first — most people would just keep turning

### The Smack Mechanic
- After ~2 seconds on channel 3.5, a subtle prompt appears (could be faint text in the static, or just a feeling that something is waiting)
- Pressing **spacebar** "smacks" the TV
- Three smacks are required to break through to the dark site

### Smack Progression

**Smack 1**
- Picture jitters hard
- Tracking lines shoot across the screen
- TV hum gets louder or more distorted
- VHS effects glitch momentarily

**Smack 2**
- Color starts bleeding or desaturating
- Frame tilts slightly, like the TV is losing its grip
- Static creeps in at the edges
- More VHS effects drop out — like the tape is being damaged

**Smack 3**
- TBD on exact transition (Cory to decide)
- Could be: hard cut to black, picture collapses to single horizontal line (like old TVs turning off), beat of silence
- Then the dark site appears — possibly sudden, not faded, like it was always there underneath

### Conceptual Note
The user is literally *breaking* the TV/VHS aesthetic to get somewhere they're not supposed to be. The degradation of effects is intentional — breaking through the nostalgia layer to find something underneath.

---

## The Dark Site (Channel 3.5 destination)

### Current Vision
- Full background image (creepy/atmospheric — TBD)
- Prose that appears slowly on top of the image
- Exact content and interaction TBD
- May not have traditional navigation — more of a space you wander through or just experience

### Open Questions
- Does this page retain any TV framing, or is the metaphor completely gone once you're there?
- Single page or explorable space?
- What is the background image? (Sonoran landscape at night? Something more abstract/surreal?)
- What prose appears? (Desert mythology fragments? Cryptic writing?)

---

## UI Notes

### The Dial
- Should look/feel like an old TV dial
- Physical, tactile interaction
- Channels 2, 3, 4 are visible
- 3.5 is not marked but exists in the interaction space between 3 and 4

### Transitions
- Channel switching could have that old TV "chunk" feel
- Maybe brief static between channels
- Each channel should feel like tuning into a different broadcast, not just a theme toggle

---

## Technical Considerations
- Current site is VHS-themed (multilingual VHS chaos project in GitHub)
- Need to preserve existing Channel 3 functionality
- Channel 2 and 4 could share core content with different presentation, or have unique content — TBD
- Smack counter needs to track state during the 3.5 interaction
- Spacebar listener only active when dial is on 3.5
- Consider: should smack progress reset if you turn away from 3.5?
