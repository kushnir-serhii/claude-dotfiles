# ALMA — Mindfulness & Ambient Audio App

A **mobile-first design prototype** for a meditation and ambient audio application. Built as a static web app running entirely in the browser — no build step, no backend — to allow rapid visual iteration on UI/UX before any native implementation.

---

## What this is

ALMA is a **visual design prototype**, not a production app. The goal is to define and refine:

- The complete screen-by-screen UI of a mobile meditation app
- Interaction patterns (navigation, sheets, pickers, players)
- The design language: typography, color, motion, spacing
- The data model: what concepts the app tracks (tracks, rituals, sessions, user progress)

The prototype runs inside a simulated iOS device frame in a browser. When the design is validated, the screens and interactions serve as the spec for building the real app in React Native, SwiftUI, or another mobile stack.

---

## Running the app

Open `ALMA.html` with a local HTTP server. The simplest option:

- **VS Code Live Server** — right-click `ALMA.html` → Open with Live Server
- **Python** — `python -m http.server 5500` in `alma-locket/`, then open `http://localhost:5500/ALMA.html`

No install, no build. The file loads React 18 and Babel from CDN and compiles JSX in the browser.

---

## Features

### Sanctuary (Home)
The main discovery screen. Shows:
- **Master Tracks** — a horizontal scroll of curated meditation audio cards (artwork orb + title + duration). Tapping opens a quick-config sheet to set duration and launch.
- **Your Rituals** — saved session presets with a track + ambient layer combination. One tap to launch.
- **Pinned Files** — user-uploaded audio files pinned to the home screen for quick access.
- Theme toggle (Moon / Sun) in the header.

### Mixer
Custom session builder. The user:
1. Picks a **Focus Track** (main audio)
2. Adds an **Ambient Layer** (continuous background sound: rain, ocean, bowls, etc.)
3. Adds a **Bell** (session marker — intro/outro or interval)
4. Sets **Duration** and **Interval** (how often the bell rings)
5. Launches the session or saves it as a Ritual

### Vault
Personal library management:
- **Rituals** — list of saved presets; rename or delete them; tap to launch
- **My Files** — user-uploaded raw audio files; pin/unpin to Sanctuary; customise cover art and icon; delete

### Profile
User identity and progress tracking:
- **Hero** — day-of-week lotus image (Mon=lotus_1 … Sun=lotus_7) with a breathing animation. Stage title changes with the day: Awakening Bud → Unfolding Layers → First Petals → Opening Heart → Radiant Flower → Sacred Bloom → Infinite Essence.
- **Weekly Stats** — total meditation time this week, 7-day GitHub-style streak heatmap (squares colored by minutes per day), weekly goal progress bar (gradient fill).
- **Account Settings** — editable display name, daily session goal picker (5/10/15/20/30 min), weekly goal picker (30m/1h/1.5h/2h/3h).
- **Statistics link** — opens the full Statistics screen.
- **Plan badge** — Free/Pro indicator with Upgrade button.
- **Account actions** — Log Out, Delete Account (confirm-gated).

### Statistics Screen
Full-screen overlay showing:
- 2×2 summary tiles: Total Time, Sessions, Avg Session, This Week
- Weekly goal progress card (current week, gradient bar, % complete)
- Past weeks history (5 weeks of bars)

### Full Player
Immersive session view:
- Animated mandala (breathing concentric rings, color-keyed to accent)
- Track artwork orb
- Countdown timer with scrub bar
- Play/pause, mute, collapse to mini-player
- Save current session as a Ritual
- Customize (jump to Mixer with current track loaded)

### Mini Player
Persistent pill above the tab bar showing current track, elapsed/total, play/pause toggle, close.

---

## Design language

### Themes
Two modes switchable via the header toggle on Sanctuary:

| Token | Moon (dark espresso) | Sun (light sand) |
|---|---|---|
| `--bg-0` | `#0E0B09` | `#F6F1EA` |
| `--text` | `#F4F1EC` | `#2B2118` |
| `--surface` | `rgba(255,255,255,0.045)` | `rgba(43,33,24,0.05)` |

The accent color (`--accent`) defaults to indigo `#4839F4` and is user-selectable (5 presets via the Tweaks panel).

### Typography
`Outfit` (Google Fonts) — weights 300/400/500/600/700. Warm-neutral, geometric, readable at small mobile sizes.

### Motion
- `breathe` — slow scale oscillation (1.0 → 1.04), used on the lotus hero image and mandala
- `almaFade` — opacity 0 → 1 for screen transitions
- `almaFadeUp` — opacity 0 + translateY(12px) → full, for list items
- `press` CSS class — `scale(0.96)` on active for tactile button feedback

### Icons
All icons are hand-built Lucide-style SVGs via a `_lucide(children)` factory:
- `stroke="currentColor"`, `strokeWidth: 1.8`, `fill: none`, `viewBox: "0 0 24 24"`
- No emoji anywhere in the UI

### Cover art system
The `ALMA_GRADIENTS` map provides backgrounds for track orbs:
- **Image covers** — `.webp` files for master tracks (atmospheric photo-paintings)
- **Gradient images** — `gradient1.webp` … `gradient6.webp` for rituals and progress states
- **CSS gradients** — inline radial/linear gradients for ambient layers and pin-file thumbnails

---

## File structure

```
alma-locket/
├── ALMA.html          ← The entire app — single self-contained file
├── images/            ← Track artwork (referenced by ALMA_GRADIENTS in the HTML)
│   ├── *.webp         ← Atmospheric photo covers for master tracks
│   └── mandala/       ← SVG mandala assets
├── alma/
│   └── img/           ← Images referenced by path inside the app
│       ├── gradient1–6.webp   ← Ritual/progress gradient covers
│       └── lotus/
│           └── lotus_1–7.webp ← Day-of-week hero images for Profile
└── nature/            ← Audio files
    ├── master-tracks/ ← Main meditation tracks (.mp3)
    ├── effects/       ← Bells, binaural beats, bowls (.mp3/.wav)
    └── *.mp3/.wav     ← Ambient layers (rain, ocean, forest, fire)
```

### Single-file architecture

`ALMA.html` is the entire app. It contains:
- All CSS inlined in a `<style>` block
- All components inlined in one `<script type="text/babel">` block, in dependency order:

```
data → icons → components → mandala → player → sanctuary →
mixer → vault → tweaks → ios-frame → stats → profile → app
```

React 18 and Babel are loaded from CDN — no install, no build step. The `alma/img/` and `images/` folders are the only external dependencies the HTML file references.

---

## Architecture notes

### React hook aliasing
Because all components share one Babel script block, `const { useState }` can only be declared once per block scope. Each screen section aliases the hooks it needs:

| Section | Aliases |
|---|---|
| App | `useStateA`, `useEffectA`, `useRefA` |
| Player | `useStateP`, `useEffectP`, `useRefP` |
| Sanctuary | `useStateS` |
| Profile | `useStateProf`, `useEffectProf`, `useRefProf` |
| … | pattern repeats per section |

### Audio engine
`useAudioEngine()` manages two `<audio>` elements (main track + ambient layer). Volumes are fixed at 0.85 (main) and 0.45 (layer). Bells use short-lived `new Audio()` instances so they never interrupt the main session.

### State persistence
User preferences stored in `localStorage`:
- `alma-name` — display name
- `alma-goal` — daily session goal (minutes)
- `alma-weekly-goal` — weekly goal (minutes)
- `alma-theme` — `'moon'` | `'sun'`

### Overlay z-index stack
```
Tab bar          z-index: 40
Stats screen     z-index: 50
Mini player      z-index: 30 (above scrollbody)
Full player      z-index: 60 (deck slide-up)
Sheets           z-index: 70
Toast            z-index: 80
```

---

## Data model (prototype/mock)

All data is hardcoded inside `ALMA.html`. In a real app these would come from an API or local database.

```
MASTER_TRACKS     — curated audio tracks available in the library
SAVED_RITUALS     — user's saved session presets (track + layer + duration)
AMBIENT_LAYERS    — ambient background sounds and session bells
RAW_AUDIO         — user's own uploaded files (pin-able to Sanctuary)
WEEK_SESSION_DATA — mock 7-day history (minutes per day, Mon–Sun)
WEEKLY_HISTORY    — mock 5-week history for the Statistics screen
LIFETIME_STATS    — mock total sessions and total minutes
PROGRESS_STATES   — 7 stage titles mapped to lotus images (one per day of week)
```

---

## Extending the prototype

When adding a new screen or feature, everything happens inside `ALMA.html`:

1. Add new data constants in the data section; include them in `Object.assign(window, {...})`
2. Add new icons using `_lucide(<path ... />)` in the icons section
3. Write the new component in the correct position in the script block (maintain dependency order)
4. Wire it into the App component (new tab, new state, or new overlay)
5. Use unique hook aliases (`useStateFoo`) to avoid block-scope conflicts with other sections
