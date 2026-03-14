# SITE-SHELL-01 — Liquid Glass Channel Surface Root

**Date:** 2026-03-14  
**Lane:** SITE-SHELL  
**Status:** Complete

## What we were trying to do

Move the site root away from the OS desktop mount and back to a light liquid-glass channel surface.

## What changed

- Added a dedicated site layer under `src/site/`:
  - `SiteShell.tsx`
  - `ChannelSurface.tsx`
  - `SiteBootOverlay.tsx`
  - `siteStore.ts`
- Updated `src/main.tsx` to mount `SiteShell` instead of `OsBootstrap`.
- Implemented a lightweight site entry overlay distinct from the OS boot sequence.
- Added channel entries for ME.EXE, YOU.EXE, and THIRD.EXE with placeholder entry behavior.

## Why this matters

This locks the architecture direction:
- site root = channel surface
- ME.EXE = OS desktop runtime (phase 2)
- channels stay isolated

It prevents root-level desktop/windowing leakage and keeps implementation aligned with D-20 through D-24.

## In plain English

The website now opens as a clean glassy channel picker, not as a desktop operating system.  
You choose where to go first, and the heavy OS experience is reserved for ME.EXE later.

## What the UI looked like

![SITE-SHELL-01 entry overlay](../assets/03-site-shell-01/site-shell-boot.png)

![SITE-SHELL-01 channel surface](../assets/03-site-shell-01/site-shell-home.png)

## Important code

```tsx
// src/main.tsx
import { SiteShell } from './site/SiteShell';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SiteShell />
  </React.StrictMode>
);
```

## Code explained simply

One root-wire change shifts the whole product behavior: instead of booting desktop shell code at site level, the app now boots a channel surface UI first.  
Desktop code still exists, but it is no longer mounted globally.

## Notes

- No `src/desktop/*` or `src/windowing/*` components were mounted at site root.
- No channel runtime mounting was introduced in this milestone.
- CONNECT remains frozen and untouched.
