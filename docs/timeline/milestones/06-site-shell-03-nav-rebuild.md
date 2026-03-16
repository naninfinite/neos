# SITE-SHELL-03 — Persistent Navigation Bar

**Date:** 2026-03-16
**Lane:** SITE-SHELL
**Status:** Complete

## What we were trying to do

Rebuild the navigation bar as the first component on the blank canvas, coordinated through agentchattr with all three agents (Claude, Codex, Gemini) aligned before implementation began.

## What happened

The team discussed two approaches in `#00-restart`: a burger/slider menu versus a persistent top nav bar. All three agents recommended persistent top nav for the OS-shell metaphor — channels should always be visible and one click away, like a real OS taskbar. The user agreed.

Design decisions locked through chat:
- Unified nav bar (not separate pills — the previous version had pill-shaped tabs that looked disjointed)
- Warm neutral palette per D-22/D-26: warm base (#f5e6d3), warm dark text (#2d2520), warm accent (#c4956a) for active states
- Active channel animation: subtle upward lift (`translateY(-2px)`) with slight left bias (`translateX(-1px)`)
- CONNECT.EXE appears in the nav but is visually dimmed and non-interactive until wired

## What changed

### New files

- **`src/site/SiteNav.tsx`** — persistent top navigation component wired to `siteStore`
- **`src/site/SiteNav.css`** — nav bar styling with unified bar layout, active state animation, and disabled tab support

### Updated files

- **`src/site/SiteShell.tsx`** — mounts `SiteNav`, uses CSS variable for background instead of hardcoded colour
- **`src/styles/tokens.css`** — design tokens updated to warm neutral palette (D-22/D-26):
  - `--color-bg-base: #f5e6d3` (warm neutral base)
  - `--color-nav-surface: transparent` (nav sits on same background plane as page)
  - `--color-accent-primary: #c4956a` (warm accent)

## Why this matters

This is the first component rebuilt after the hard reset, and the first piece built with full agent coordination via agentchattr. The nav bar establishes the channel-switching foundation that all future content surfaces will sit beneath.

## In plain English

The site now has a clean navigation bar at the top showing all five channels. Clicking a channel switches the active selection with a subtle lift animation. CONNECT.EXE is visible but greyed out until it's ready. The colour scheme follows D-22/D-26: warm neutral background with the nav on the same background plane, warm dark text, and a warm accent for the active tab.

## What the UI looks like

- A sticky top bar with "NEOS" brand on the left
- Five channel tabs in the centre: HOME, ME.EXE, YOU.EXE, THIRD.EXE, CONNECT.EXE
- Active tab shifts up and left with a warm accent colour
- CONNECT.EXE is dimmed at 40% opacity
- A small status label on the right showing the current channel name
- Below the nav: flat white page (content surfaces come next)

## Important code

```tsx
const CHANNELS: ChannelEntry[] = [
  { id: 'home', label: 'HOME' },
  { id: 'me', label: 'ME.EXE' },
  { id: 'you', label: 'YOU.EXE' },
  { id: 'third', label: 'THIRD.EXE' },
  { id: 'connect', label: 'CONNECT.EXE', disabled: true },
];
```

```css
.siteNav-tab--active {
  color: var(--color-accent-primary);
  background: var(--color-nav-active);
  transform: translate(-1px, -2px);
  font-weight: 600;
}
```

## Code explained simply

The channels are defined as a simple list. Adding a future channel (like `news.exe`) means adding one line to this array. The active tab gets a colour change and a tiny physical shift to make it feel selected without being flashy.

## Architecture notes

- Navigation reads from and writes to `siteStore` (no local React state)
- Adding channels requires only a new entry in the `CHANNELS` array
- The `disabled` flag lets channels appear in the nav before they're functional
- TypeScript and Vite builds pass clean

## Future channels (discussion only)

The following channels were discussed but are **not being implemented** until the original four channels (HOME, ME.EXE, YOU.EXE, THIRD.EXE) plus CONNECT.EXE are operational. These are placeholders for future discussion and note updates only.

- **NEWS.EXE** — aggregated feed / news surface
- **RADIO.EXE / SIGNAL.EXE** — audio/broadcast channel (name TBD)
- **EARTH.EXE** — world/global exploration surface

These will not be added to the nav bar, `SiteChannel` type, or any runtime code until they are formally scoped.

## What comes next

1. Channel routing — content surfaces that respond to the active channel
2. Hero + 3-stack layout for the HOME channel
3. Glass re-integration when layout is stable
