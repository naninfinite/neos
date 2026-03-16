# SITE-SHELL-02 — Hard Reset: Blank Canvas

**Date:** 2026-03-16
**Lane:** SITE-SHELL
**Status:** Complete

## What we were trying to do

Start the home page UI fresh after repeated back-and-forth on the liquid glass implementation proved unproductive. The goal was to strip the surface layer down to a blank working page while preserving all infrastructure, then rebuild collaboratively one piece at a time.

## What happened — the liquid glass struggle

Between SITE-SHELL-01 and this milestone, multiple AI agents (Claude, Codex, Gemini) were iterating on the home page surface in parallel. The work involved:

- Implementing a WebGL2 liquid glass renderer calibrated to the archisvaze reference
- Establishing a 3-tier material hierarchy (heavy WebGL glass, CSS support glass, readability veils)
- Building a hero card + channel stack layout with glassmorphic styling
- Adding a live wallpaper switching system
- Repeated visual tuning cycles

The problem was **churn, not quality**. Each iteration was well-built in isolation, but the agents kept going back and forth — adjusting glass parameters, restructuring layouts, changing colour palettes — without converging on a stable visual direction. The SiteShell and ChannelSurface files grew to 135 and 517 lines respectively, packed with inline style objects that were hard to coordinate across agents.

The decision was made to **hard reset the surface layer** and rebuild incrementally using agentchattr for coordinated planning, rather than letting agents independently push competing visions.

## What changed

### Gutted (contents removed, files kept)

- **`SiteShell.tsx`** — stripped to an empty `<main>` with a warm background colour. No nav bar, no glass canvas, no boot overlay.
- **`ChannelSurface.tsx`** — stripped to an empty `<section>`. Interface and type exports preserved for downstream compatibility.
- **`styles.css`** — stripped to base CSS resets only (box-sizing, margin, font smoothing). All component-specific classes removed (~800 lines of channel bar, desktop panel, launcher, taskbar, connect, and boot overlay styles removed).

### Deleted

- **`App.tsx`** — unused duplicate entry point that imported from `./shell/SiteShell` (wrong path). Removed entirely.

### Kept intact

- **`main.tsx`** — entry point unchanged (`SiteShell` mount)
- **`siteStore.ts`** — state management infrastructure (channels, boot state)
- **`SiteBootOverlay.tsx`** — boot overlay component (not currently mounted but preserved)
- **`src/site/glass/`** — entire WebGL2 glass module (6 files: renderer, shaders, registry, store, canvas, hook)
- **`src/windowing/`**, **`src/apps/`**, **`src/core/`**, **`src/services/`**, **`src/ui/`** — all untouched
- **`docs/`**, **`scripts/`**, all config files — untouched
- **`styles/tokens.css`** — design token variables preserved

## Why this matters

This is a process milestone, not a feature milestone. It acknowledges that the multi-agent collaborative approach needs coordination tooling (agentchattr) to avoid churn. The codebase is now in a known-clean state where each piece can be added deliberately with agreement before implementation.

## In plain English

We tried building the home page with multiple AI agents working in parallel, and while each agent did good work individually, the result kept changing direction without settling. Rather than continue the cycle, we wiped the screen clean and decided to rebuild step by step, with all agents coordinating through a shared chat channel before writing code.

## What the UI looked like

- A full-page warm neutral background with no mounted navigation or cards
- No active glass canvas or registered glass regions
- No boot overlay or route chrome at the site root
- A deliberately empty page that marks the new rebuild baseline

![SITE-SHELL-02 hard reset blank shell](../assets/05-site-shell-02-hard-reset/site-shell-02-hard-reset-blank-shell.png)

## Important code

```tsx
export function SiteShell(): JSX.Element {
  return (
    <main id="site-shell-bg" aria-label="Site shell" style={shellStyle}>
      {/* Blank canvas — rebuild one piece at a time */}
    </main>
  );
}
```

## Code explained simply

The root component now renders a single dependable container and nothing else. That gives the team a clean baseline before any new nav, cards, or glass effects are added back.

## Architecture notes

- The glass module is fully preserved and can be re-integrated when the layout is ready for it
- The store and type system are intact — no breaking changes to the module graph
- TypeScript and Vite builds pass clean after the reset
- The site renders a blank warm-neutral page at `/`

## What comes next

Rebuilding will be coordinated through agentchattr, one piece at a time:
1. Navigation bar
2. Channel routing
3. Content surfaces per channel
4. Glass integration (when layout is stable)

## Notes

- No `src/desktop/*`, `src/windowing/*`, or `src/apps/*` code was touched
- No dependencies were added or removed
- The glass module can be re-mounted in SiteShell with a single import when ready
