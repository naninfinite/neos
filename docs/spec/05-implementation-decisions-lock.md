# 05 - Implementation Decisions Lock

## Purpose

This file contains the final locked resolutions Codex should treat as settled before implementation.

If older wording in Blueprint or Runtime Architecture conflicts with this file, this file wins.

## Locked decisions

### D-01 - Fresh rewrite posture
Build v2 in a fresh repo or fresh project folder. The legacy Terminal-OS repo is read-only reference only.

### D-02 - Working title is provisional
Use **Terminal-OS v2** as the current working title. A later rename is allowed and does not affect architecture or contracts.

### D-03 - App registration model
`AppManifest` contains metadata only. App modules register through:

```ts
appRegistry.register(manifest, () => import('./App'));
```

### D-04 - Lazy app loading
All apps are lazy-loaded through dynamic imports.

### D-05 - Shell layer model
Use shell layer constants:

```ts
export const Z_LAYER = {
  WALLPAPER: 1,
  DESKTOP_ICONS: 2,
  WINDOWS: 3,
  TASKBAR: 4,
  OVERLAY: 5,
} as const;
```

Within `WindowLayer`, window z-order is relative and stored on `WindowState.zIndex` as `1..N`.

### D-06 - `WindowState.zIndex` is stored
`WindowState` includes `zIndex`, and the window store owns it.

### D-07 - `OsApi` is window-scoped
Apps receive `windowId` via `AppProps`. `OsApi` methods do not take `windowId` as a normal caller parameter.

### D-08 - `launchApp()` return value
`launchApp(appId, args?)` returns the new `windowId`.

### D-09 - `OsApi` includes VFS
`OsApi` exposes:
- `vfs.resolve`
- `vfs.readDir`
- `vfs.readFile`
- `vfs.search`

### D-10 - Notification routing
`osApi.notify()` must call `notificationService.push()` and return the notification id.

### D-11 - Canonical VFS path format
Use forward-slash absolute paths, for example:
- `C:/`
- `C:/WORK/`
- `C:/WORK/project-alpha/README.md`

### D-12 - Canonical file-open event
Use:

```ts
'vfs:open-file'
```

Earlier file-open names are superseded.

### D-13 - Viewer apps are hidden registered apps
At minimum, register:
- `viewer_text`
- `viewer_image`
- `viewer_pdf`

These are hidden from launcher UI but valid app ids for `launchApp()`.

### D-14 - Desktop icon persistence
Desktop icon positions are not persisted in v2.

### D-15 - Settings keys
Define settings keys centrally:

```ts
export const SETTINGS_KEYS = {
  CRT_ENABLED: 'crtEnabled',
  WINDOW_CONTROL_STYLE: 'windowControlStyle',
} as const;
```

### D-16 - CONNECT.EXE scope
CONNECT.EXE is not part of the locked initial v2 app set unless later reintroduced by spec.

### D-17 - Alt+Tab behaviour
Alt+Tab includes minimized windows. Selecting a minimized window restores it, then focuses it.

### D-18 - Mobile history cleanup
Closing a window must remove its id from `mobileHistory`.

### D-19 - Boot / VFS timing
Boot does not block on VFS readiness. `vfs.prefetch()` starts during bootstrap, and VFS-dependent apps handle their own loading states.

## Home/Desktop vs Channel Runtime Boundary

- The NEOS / Terminal-OS v2 home desktop is a **lightweight preview surface**, not a live application runtime.
- Desktop channel panels (for example ME.EXE, YOU.EXE, THIRD.EXE) must not expose full channel interaction directly from the desktop surface.
- Users may **enter** a channel from the desktop, but the desktop itself must not host active channel systems.
- Heavy runtimes must only mount after **explicit channel entry**.

### Runtime constraints
- WebGL / three.js scenes must **not** boot on the desktop.
- Desktop panels may use static artwork, lightweight CSS motion, thumbnails, poster frames, or other non-runtime preview states.
- Audio contexts, simulation loops, render loops, physics, multiplayer presence, and other heavy channel systems must remain inactive until the user enters that channel.
- On channel exit, heavy runtimes should pause, unmount, or dispose according to that channel’s lifecycle policy.

### Product intent
- Home/Desktop = orientation, identity, preview, routing.
- Channel = live runtime.
- This boundary exists for clarity, performance, thermal safety on mobile, and predictable scaling as richer channel runtimes are added.

## Channel Mounting Policy

NEOS / Terminal-OS v2 uses a two-layer model:

1. **Desktop layer**
   - Lightweight shell only.
   - Renders panel summaries and navigation affordances.
   - Must not initialise heavy channel engines.

2. **Channel runtime layer**
   - Activated only after explicit user entry into a channel.
   - Responsible for mounting the full runtime for that channel.
   - Owns boot, pause, resume, unmount, and disposal behaviour.

### Technical rule
Desktop cards must never implicitly mount live WebGL / three.js scenes or equivalent heavy subsystems. Any preview shown on the desktop must be non-interactive or near-static unless explicitly defined as lightweight and safe.

### D-20 - Site root is a channel surface, not an OS desktop

`src/main.tsx` mounts the liquid glass channel surface (`src/site/SiteShell`), not `OsBootstrap` or any OS desktop component.

The OS desktop is not visible at the site root. It lives inside ME.EXE.

### D-21 - ME.EXE hosts the OS desktop experience

The windowing system, taskbar, launcher, desktopStore, and all OS shell components operate exclusively within the ME.EXE channel.

The existing `src/desktop/` code from SHELL-01A/01B is correct OS shell code. It must be integrated inside ME.EXE, not mounted at the site root. It is un-mounted from the site root as of this decision.

### D-22 - Aesthetic direction: liquid glass / glassmorphism

The site shell uses a **light, transparent, glassmorphic** aesthetic:
- Light backgrounds with frosted glass panels
- Soft transparency and blur effects
- Subtle borders on glass surfaces
- Light text on glass — not dark terminals at the site level

The OS inside ME.EXE may use its own aesthetic (retro-futurist, dark terminal) as ME.EXE is an isolated channel with its own visual identity.

The dark terminal aesthetic from SHELL-01A/01B applies inside ME.EXE. It does not apply to the site shell.

### D-23 - Channel isolation

Each channel (ME.EXE, YOU.EXE, THIRD.EXE, etc.) is fully isolated:
- Channels do not share runtime state with each other
- Channels do not share runtime state with the site shell
- Each channel owns its own boot, mount, pause, resume, and unmount behaviour
- The site shell provides navigation routing only — it does not render channel internals

### D-24 - SHELL-01A/01B code scope

The code built in SHELL-01A and SHELL-01B (`src/desktop/`, `src/windowing/WindowLayer.tsx`, `src/core/OsBootstrap.ts`) is valid OS shell code scoped to ME.EXE.

It is **not mounted at the site root**. It will be integrated into the ME.EXE channel in Phase 2.

Codex must not reference or mount `Desktop`, `desktopStore`, `OsBootstrap`, `Taskbar`, or `Launcher` from `src/main.tsx` or any site-level component.

### D-25 — WebGL2 liquid glass renderer lives in `src/site/glass/`

The liquid glass refraction effect is implemented as a raw WebGL2 renderer (`src/site/glass/`). No Three.js or other 3D library is used at the site layer.

The renderer is a pure visual layer: a full-screen `<canvas>` at `z-index: 0` with `pointer-events: none`. It has no influence on layout, routing, state, or component lifecycle.

Glass regions self-register via `useGlassRegion`. The renderer reads registered regions each frame and renders all glass panes in one shader pass.

**Canonical tuning parameters (calibrated to archisvaze/liquid-glass reference):**
- IOR: 3.0
- Thickness: 1.6
- Blur: 2.0 px
- Bezel: 60 px
- Specular: 0.5
- Surface profile: convex squircle `pow(1 - pow(1-t, 4), 0.25)`

These defaults may be adjusted per-milestone but changes must be tracked in the timeline.

### D-26 — Site shell colour palette: warm neutral, no blue

The site shell uses a warm neutral palette. Blue tones (`#eef4ff`, `#e5ecff`, `#dbe4fa`) are superseded by warm neutrals (`#f5e6d3 → #c4956a`). Dark text is warm dark (`#2d2520`), not dark blue.

Button fills are nearly transparent (`rgba(255,255,255,0.12)` + `backdrop-filter: blur(12px)`), not opaque white. The glassmorphic fill comes from the WebGL refraction, not from CSS background colour.

## Implementation note

Before starting any milestone, Codex should confirm that the code it is about to write is consistent with this file and `03-type-contracts.md`.

D-20 through D-24 supersede any earlier wording that treated the OS desktop as a site-wide shell.
