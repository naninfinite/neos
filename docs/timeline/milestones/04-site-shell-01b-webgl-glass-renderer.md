# SITE-SHELL-01B — WebGL2 Liquid Glass Renderer + Visual Refinement

**Date:** 2026-03-14
**Lane:** SITE-SHELL
**Status:** Complete

## What we were trying to do

Add a real-time WebGL2 liquid glass renderer underneath the site shell panels, calibrate it to match the archisvaze/liquid-glass reference, and remove the blue colour palette in favour of warm neutral tones.

## What changed

### New module: `src/site/glass/`

Five new files implementing raw WebGL2 liquid glass — zero Three.js dependency:

- **`shaders.ts`** — GLSL ES 3.0 vertex + fragment shaders. Multi-region support (up to 16 glass panes per pass). SDF rounded rect, Snell's law refraction, 16-tap Poisson-disk blur, specular rim lighting, convex squircle surface profile.
- **`glassRenderer.ts`** — Full-screen quad renderer. Compiles shaders, manages a WebGL2 context, renders the background gradient to an offscreen canvas as a refraction texture, runs a `requestAnimationFrame` loop. Handles resize and cleanup.
- **`glassRegistry.ts`** — Global registry where React components register their bounding rects as glass regions. The renderer reads this each frame.
- **`useGlassRegion.ts`** — React hook. Accepts a ref and corner radius, tracks the element via `ResizeObserver` + scroll listeners, and keeps the registry current.
- **`GlassCanvas.tsx`** — Full-screen `<canvas>` positioned behind all DOM content (`pointer-events: none`, `z-index: 0`). Mounts the renderer on load.

### Glass tuning — calibrated to reference

Parameters now match the archisvaze/liquid-glass reference defaults:

| Parameter | Before | After |
|-----------|--------|-------|
| IOR (index of refraction) | 1.8 | **3.0** |
| Blur | 16 px | **2 px** (nearly clear) |
| Bezel width | 55 px | **60 px** |
| Specular | 0.7 | **0.5** |
| Surface profile | `pow(t, 1.6)` | **convex squircle** `pow(1 - pow(1-t, 4), 0.25)` |
| White tint | 18 % | **6 %** |
| Alpha range | 0.60 – 0.92 | **0.45 – 0.82** |

### Visual style — no blue

- Background gradient replaced: blue tones (`#eef4ff → #dbe4fa`) → warm neutral (`#f5e6d3 → #c4956a`)
- WebGL background texture updated to match
- All text colours: dark blue (`#1f2b4f`, `#1d2a4e`) → warm dark (`#2d2520`)
- Buttons: solid white fill (0.56 opacity) → nearly transparent glass (0.12 opacity + `backdrop-filter: blur(12px)`)
- Active nav button: green tint → neutral white highlight

## Why this matters

The site shell now renders a physically-grounded refraction effect rather than a CSS blur approximation. The convex squircle profile produces a natural lens-like bulge. The low blur setting keeps the distorted content visible through the glass — matching the reference's signature "clear glass" look rather than a frosted panel.

The warm neutral palette removes the blue-glass tech aesthetic and moves toward a cleaner, more timeless material feel.

## In plain English

The glass panels on the site shell now genuinely bend and distort the background behind them, exactly like the reference demo. The colour palette shifted from cool blue to warm neutral. Buttons are transparent glass too — they pick up the background colour through refraction rather than filling with white.

## Architecture notes

- The glass layer is a pure visual effect. The WebGL canvas sits behind all DOM content at `z-index: 0` with `pointer-events: none`. No React component tree, routing, or interaction logic was changed.
- Glass regions register themselves via `useGlassRegion` on mount and unregister on unmount — the renderer is never aware of component lifecycle.
- CSS `backdrop-filter` is kept on DOM elements as a fallback for devices where WebGL2 is unavailable.
- Bundle size is unchanged — no new runtime dependencies added.

## Important code

```ts
// src/site/glass/glassRenderer.ts — tuning constants
const IOR       = 3.0;   // index of refraction — matches reference
const THICKNESS = 1.6;   // refraction strength
const BLUR      = 2.0;   // Poisson blur radius (px) — nearly clear
const BEZEL     = 60.0;  // edge bevel width (px)
const SPECULAR  = 0.5;   // rim light strength
```

```glsl
// src/site/glass/shaders.ts — convex squircle surface profile
float surfaceHeight(float t) {
  return pow(1.0 - pow(1.0 - t, 4.0), 0.25);
}
```

## Notes

- No `src/desktop/*` components were touched.
- CONNECT remains frozen and untouched.
- Screenshots pending Playwright capture (see `scripts/timeline/capture-site-shell-01.mjs`).
