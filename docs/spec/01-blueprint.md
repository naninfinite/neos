# 01 - Blueprint


> [!IMPORTANT]
> This document is part of the Terminal-OS v2 spec pack.
> If this file conflicts with `SOURCE_OF_TRUTH.md` or `05-implementation-decisions-lock.md`, follow those files.
> Working title: **Terminal-OS v2**. Project rename is allowed later; architecture and contracts remain valid.

> [!IMPORTANT]
> **Direction update (2026-03-14):**
> The product direction in this document describes the OS desktop experience, which now lives inside **ME.EXE** only — not at the site root.
> The site root is a **liquid glass channel surface** (light, transparent, glassmorphic) — see D-20–D-24 in `05-implementation-decisions-lock.md`.
> Section 2.4 Design Tone ("dark terminals") applies to ME.EXE's internal aesthetic. The site shell uses a light glassmorphic aesthetic.
> When this document conflicts with the Decisions Lock, the Decisions Lock wins.

## Architecture & UX Blueprint

*Specification Document for the Claude–Codex–Gemini Build Pipeline*

Architecture Guardian: Claude | Implementation: Codex | Validation: Gemini

March 2026 | Repo: github.com/naninfinite/terminal-os

-----

## Table of Contents

1. [Product & UX Audit](#1-product--ux-audit)
2. [Product Vision for Terminal-OS v2](#2-product-vision-for-terminal-os-v2)
3. [Information Architecture](#3-information-architecture)
4. [Desktop & Window System Design](#4-desktop--window-system-design)
5. [UI Design Language](#5-ui-design-language)
6. [App System Architecture](#6-app-system-architecture)
7. [Codebase Architecture](#7-codebase-architecture)
8. [Coding Standards](#8-coding-standards)
9. [Migration Strategy](#9-migration-strategy)
10. [Implementation Roadmap](#10-implementation-roadmap)

-----

## 1. Product & UX Audit

The following audit is based on analysis of the repository structure, README, milestone history, and common failure modes in browser-based OS projects. The current implementation shows strong intent and genuine progress through M5, but exhibits several patterns that accumulate friction as the system grows.

### 1.1 Architectural Friction

- **Subsystem identity vs. window identity blurs:** ME.EXE is both a “shell host” and an “app”, creating ambiguity in the window manager’s mental model. The dock treats ME, YOU, THIRD, CONNECT as peers, but ME is clearly privileged — this asymmetry should be explicit, not implicit.
- Organic growth across M1–M5 likely introduced inconsistent state management patterns between subsystems. YOU and THIRD are flagged as needing “parity” with ME, confirming this.
- localStorage as persistence layer has no clear schema versioning, making breaking changes dangerous across deploys.
- The Supabase integration in YOU.EXE is tightly coupled to the component rather than abstracted into a service layer — this will make testing and future backend swaps difficult.

### 1.2 Discoverability Issues

- First-time users land in a desktop environment with no onboarding. The OS metaphor is clear to developers but opaque to portfolio visitors.
- The dock (ME/YOU/THIRD/CONNECT) is unexplained — a user has no idea what these acronyms mean or what awaits inside.
- Panel grid navigation on the desktop has no visible affordance for what is clickable, draggable, or interactive.
- No “What is this?” escape hatch — a portfolio viewer has no quick way to understand the project’s purpose without digging through the OS itself.

### 1.3 UI Inconsistencies

- Mixed metaphors: the system uses Windows 95 chrome in some places, blackberry-style panels in others, and a raw terminal aesthetic in yet others. These are all valid inspirations but need a unified design language to feel cohesive.
- Context menus exist for dock + desktop panels but likely differ in structure and styling from window chrome context menus.
- The right-click / long-press implementation is scoped to “V1” in the README, suggesting incomplete coverage across the UI.
- Mobile responsiveness is described as a “baseline” — meaning the experience degrades rather than adapts.

### 1.4 Cognitive Load

- Four top-level subsystems (ME, YOU, THIRD, CONNECT) with no apparent hierarchy or grouping creates a flat navigation model that becomes harder to extend.
- “ME runtime”, “VFS boundaries”, “FileMan”, “Viewers” are deeply nested concepts a portfolio visitor should never need to understand.
- The OS illusion breaks when technical implementation bleeds through — e.g. error states that expose React component names, or loading states with no OS-style framing.

### 1.5 Common Browser-OS Failure Modes to Avoid

- **Performance collapse:** Unoptimized drag calculations cause jank. Window z-index storms. React re-renders on window move.
- **The “empty desktop” problem:** Users open the OS and see nothing actionable.
- **App isolation failures:** One crashing app bringing down the window manager.
- **Desktop metaphor mismatch:** Using HTML scroll instead of OS scroll semantics.
- **Keyboard trap:** Focus management that traps keyboard navigation inside windows.

> **Audit summary:** The current system has strong foundations but needs a unified design language, explicit information hierarchy, clearer onboarding, and stricter layer separation to sustain growth. v2 should address all of these structurally, not cosmetically.

-----

## 2. Product Vision for Terminal-OS v2

### 2.1 Core Identity Statement

> Terminal-OS is a retro-futurist personal computing environment that functions as a living portfolio. It is software that thinks about software. It is a creative artifact that uses the vocabulary of operating systems to present the work, personality, and experimentation of its creator.

### 2.2 What Terminal-OS Is (and Is Not)

|IS                                               |IS NOT                                   |
|-------------------------------------------------|-----------------------------------------|
|A portfolio disguised as an operating system     |A real operating system                  |
|A creative digital playground and software museum|A productivity tool                      |
|An interactive, explorable personal environment  |A tech demo of React patterns            |
|A retro-futurist aesthetic statement             |A replacement for a traditional portfolio|

### 2.3 First-Time User Journey

1. Visitor arrives. A boot sequence plays — minimal, evocative, fast. Establishes tone immediately.
2. Desktop loads. A single ambient notification or tooltip says: “Welcome to Terminal-OS. Click anything.”
3. Visitor opens ME.EXE. They see the file system. They understand: this is someone’s world, organized like a computer.
4. They explore. Each app reveals something: work in FileMan, personality in YOU.EXE, experimentation in THIRD.EXE.
5. They leave understanding the creator better than any CV could convey.

### 2.4 Design Tone

|Dimension   |Definition                                                                       |
|------------|---------------------------------------------------------------------------------|
|Aesthetic   |Retro-futurist: dark terminals meet soft glow, phosphor green meets glassmorphism|
|Voice       |Terse and technical on the surface; warm and personal inside each app            |
|Emotion     |Curiosity → delight → discovery                                                  |
|Pacing      |Boot is slow and dramatic; navigation is instant; apps can breathe               |
|Craft signal|Every pixel should feel intentional — not over-designed, but clearly considered  |

### 2.5 Interaction Philosophy

- The OS metaphor is the content, not the wrapper. Apps should feel native to this OS, not like web apps wearing an OS skin.
- Discoverable depth: the surface is clean; secrets and easter eggs reward exploration.
- Graceful degradation on mobile: the OS adapts to touch without abandoning its identity.
- Nothing breaks the fourth wall. Errors look like OS errors. Loading looks like disk activity.
- Keyboard-first for power users; pointer-friendly for casual visitors.

### 2.6 v2 Success Criteria

|Metric       |Target                                                                |
|-------------|----------------------------------------------------------------------|
|Onboarding   |A first-time visitor understands what Terminal-OS is within 30 seconds|
|Performance  |Window drag/resize at 60fps; no jank on app open                      |
|Extensibility|A new app can be added in < 2 hours with zero changes to core         |
|Consistency  |All windows, menus, and controls share a single design language       |
|Mobile       |Core experience works on 375px viewport with touch                    |
|Resilience   |App crashes are isolated; the desktop never goes blank                |

-----

## 3. Information Architecture

### 3.1 Desktop Structure

The desktop is a fixed-viewport canvas (no scroll) with the following permanent layers, from bottom to top:

|Layer         |z-index|Contents                               |Behavior                       |
|--------------|-------|---------------------------------------|-------------------------------|
|Wallpaper     |0      |Ambient animation / static texture     |Always behind everything       |
|Desktop Icons |10     |App shortcuts, folder shortcuts        |Draggable, double-click opens  |
|Windows       |100–899|Running application windows            |Stackable, managed by WM       |
|Taskbar       |900    |Persistent bottom dock                 |Always above windows           |
|System Overlay|1000   |Notifications, context menus, dropdowns|Above everything               |
|Boot/Splash   |9999   |Boot sequence, first-run overlay       |Full-screen, dismisses on ready|

### 3.2 Taskbar Structure

- **Left zone:** OS logo / Start-equivalent button → opens App Launcher
- **Centre zone:** Running app task buttons (icon + name, click to focus/minimise)
- **Right zone:** System tray — clock, volume, network indicator, notifications badge

The taskbar is 48px tall, always visible, never hidden. On mobile it collapses to a bottom-safe-area dock with icon-only buttons.

### 3.3 App Launcher

Triggered by OS logo button or keyboard shortcut (`Ctrl+Space`). Renders as a full-screen overlay (not a window) with:

- Search bar at top — filters all apps by name or tag
- Category grid below search — apps grouped by category
- Recent apps row — last 4 opened apps
- ESC or click-outside to dismiss

### 3.4 App Categories

|Category    |Apps                                   |Icon Style              |
|------------|---------------------------------------|------------------------|
|System      |Terminal.EXE, FileMan.EXE, Settings.EXE|Monochrome utility icons|
|Personal    |ME.EXE (About), YOU.EXE (Message Board)|Warm accent icons       |
|Creative    |THIRD.EXE (3D Sandbox), HomeDashboard  |Gradient/colour icons   |
|Games       |Arcade.EXE (Pong, Snake, Tron)         |Pixel-art game icons    |
|Experimental|Future apps, prototypes, easter eggs   |Glitch/distorted icons  |

### 3.5 Navigation Principles

- **Primary:** Desktop icons → double-click to open
- **Secondary:** Taskbar task list → click to focus
- **Tertiary:** App Launcher → keyboard/search for power users
- No hamburger menus. No sidebars. Every navigation action maps to an OS convention.
- Right-click on desktop → context menu: New Window, Arrange Icons, Settings

### 3.6 Virtual File System (VFS) Structure

The VFS is ME.EXE’s domain. Its root structure maps to human-readable concepts:

```
C:\                     (root)
  WORK\                 (portfolio projects)
  ABOUT\                (personal info, CV)
  EXPERIMENTS\          (prototypes, WIPs)
  GAMES\                (archived game projects)
  SYSTEM\               (OS internals, read-only)
```

VFS files are read-only for visitors. The creator can add content by editing a versioned JSON manifest.

-----

## 4. Desktop & Window System Design

### 4.1 Window Anatomy

Every window shares the same chrome structure:

- **Title bar (32px):** drag handle, app icon, title text, window controls (minimize, maximize, close)
- **Menu bar (optional, 24px):** app-specific menu items
- **Content area:** app renders here, full bleed to edges
- **Resize handles:** 8px hitbox on all 4 edges and 4 corners
- **Status bar (optional, 20px):** app-specific footer info

### 4.2 Window Lifecycle

|State    |Description                                                         |Transition                          |
|---------|--------------------------------------------------------------------|------------------------------------|
|Spawning |Animates in from center (scale 0.9→1.0, opacity 0→1, 150ms ease-out)|App launch                          |
|Active   |Focused window, full opacity, raised z-index                        |Click / launch                      |
|Inactive |Unfocused, slight opacity reduction (0.95), no z-change             |Another window focused              |
|Minimized|Animates to taskbar button (scale→0, 120ms), removed from canvas    |Minimize button / taskbar           |
|Maximized|Fills viewport minus taskbar, no rounded corners                    |Maximize button / double-click title|
|Closing  |Reverse spawn animation (150ms)                                     |Close button / Ctrl+W               |

### 4.3 Focus & Z-Index Management

- Only one window is “active” at a time. Active window receives keyboard input.
- Z-index is managed by a central `WindowManager` service that maintains a stack order array.
- Clicking any part of an inactive window brings it to front and sets it active.
- Z-index values: base=100, each focus push increments by 1, capped at 899 (below taskbar).
- On 900+ windows (unlikely but handled): the stack resets and re-assigns z-index sequentially.

### 4.4 Drag & Resize

- **Drag:** pointer events on title bar. Uses `CSS transform: translate()` — NOT `top/left` — for GPU compositing.
- **Resize:** pointer events on edge/corner handles. Minimum size enforced per-app (default 300×200px).
- **Constraint:** windows cannot be dragged off-screen entirely. At least 100px of title bar must remain within viewport.
- During drag/resize, `will-change: transform` is applied and removed on pointer up.
- Window position and size are stored as pixels in `WindowManager` state, not CSS classes.

### 4.5 Window Snapping

- Drag to left edge → snap to left 50%
- Drag to right edge → snap to right 50%
- Drag to top edge → maximize
- Snap preview ghost appears when threshold reached (within 20px of edge)
- Holding `Alt` suppresses snap

### 4.6 Keyboard Shortcuts

|Shortcut                |Action                                   |
|------------------------|-----------------------------------------|
|`Ctrl+Space`            |Open App Launcher                        |
|`Ctrl+W`                |Close active window                      |
|`Ctrl+M`                |Minimize active window                   |
|`Alt+Tab`               |Cycle through open windows               |
|`Ctrl+Shift+M`          |Maximize/restore active window           |
|`Escape`                |Dismiss overlay / context menu / launcher|
|Arrow Keys (in launcher)|Navigate app grid                        |
|Enter (in launcher)     |Open selected app                        |

### 4.7 Mobile Adaptation

- Viewport < 768px: window system disabled. Each app runs full-screen.
- Bottom navigation dock replaces taskbar (48px safe-area-aware).
- Swipe left/right to switch between open apps (card metaphor).
- Long-press on desktop icon shows context menu.
- App Launcher is a bottom sheet (slides up from dock).

> **Engineering note to Codex:** Window position state must live in a single Zustand slice (`windowManagerStore`). No window should manage its own position in local React state. This is the most common source of bugs in browser-OS implementations.

-----

## 5. UI Design Language

### 5.1 Design Philosophy

Terminal-OS v2 uses a **Retro-Futurist Minimal** system: the aesthetics of retro computing (phosphor screens, monospace type, scanlines) combined with modern interface clarity (sufficient contrast, clear hierarchy, smooth motion). It avoids the trap of pure skeuomorphism (too heavy) or pure flatness (too cold).

### 5.2 Color Tokens

|Token                     |Value                   |Usage                                     |
|--------------------------|------------------------|------------------------------------------|
|`--color-bg-base`         |`#0D0D14`               |Desktop background, app backgrounds       |
|`--color-bg-surface`      |`#1A1A2E`               |Window backgrounds, panel backgrounds     |
|`--color-bg-elevated`     |`#252540`               |Context menus, dropdowns, modals          |
|`--color-bg-hover`        |`#2E2E50`               |Hover states on interactive elements      |
|`--color-accent-primary`  |`#00FF9C`               |Primary CTA, active states, cursor blink  |
|`--color-accent-secondary`|`#00AAFF`               |Links, secondary actions                  |
|`--color-accent-danger`   |`#FF4444`               |Close button, errors, destructive actions |
|`--color-accent-warn`     |`#FFAA00`               |Warnings, pending states                  |
|`--color-text-primary`    |`#E8E8F0`               |Primary body text                         |
|`--color-text-secondary`  |`#9090A8`               |Labels, captions, metadata                |
|`--color-text-disabled`   |`#555568`               |Disabled states                           |
|`--color-border-subtle`   |`#2A2A42`               |Window chrome borders, dividers           |
|`--color-border-active`   |`#00FF9C`               |Active/focused element borders            |
|`--color-glass-bg`        |`rgba(26,26,46,0.85)`   |Glassmorphism surfaces (taskbar, launcher)|
|`--color-glass-border`    |`rgba(255,255,255,0.08)`|Glass surface borders                     |

### 5.3 Typography

|Role                              |Font                                                 |Rationale                                    |
|----------------------------------|-----------------------------------------------------|---------------------------------------------|
|System UI                         |Inter                                                |Clean, modern, high legibility at small sizes|
|Monospace (terminal, code, labels)|JetBrains Mono                                       |Clear at small sizes, good symbol coverage   |
|Display (boot, titles)            |Space Grotesk or Orbitron                            |Geometric, retro-futurist feel               |
|Base size                         |14px / 1rem                                          |                                             |
|Scale                             |10 / 12 / 14 / 16 / 20 / 24 / 32 / 48px              |                                             |
|Line height                       |1.5 body, 1.2 headings, 1.0 monospace                |                                             |
|Font loading                      |Self-hosted via `@font-face`, subset to Latin+symbols|                                             |

### 5.4 Spacing System

All spacing uses a 4px base grid:

|Token       |Value|Usage                    |
|------------|-----|-------------------------|
|`--space-1` |4px  |Icon padding, micro gaps |
|`--space-2` |8px  |Inline element gap       |
|`--space-3` |12px |Label to content gap     |
|`--space-4` |16px |Section internal padding |
|`--space-6` |24px |Section gap              |
|`--space-8` |32px |Major section separation |
|`--space-12`|48px |Page/screen-level spacing|

### 5.5 Window Chrome Specifics

- Title bar height: 32px. Gradient: left-to-right from `--color-bg-elevated` to `--color-bg-surface`
- Window controls: 12px circles — configurable between Windows-style (right) and macOS-style (left cluster) in Settings.EXE
- Active window title bar: accent color left border (3px) to signal focus
- Window corners: `border-radius: 6px` top, 0 bottom (flat bottom like classic OS windows)
- Window shadow: `0 8px 32px rgba(0,0,0,0.6)` — strong to separate from desktop

### 5.6 Animation Philosophy

|Scenario        |Spec                                                       |
|----------------|-----------------------------------------------------------|
|Motion principle|Fast in, slow out — UI should feel responsive, not sluggish|
|Window open     |150ms ease-out, scale 0.92→1.0 + opacity 0→1               |
|Window close    |120ms ease-in, reverse                                     |
|Window minimize |Fly to taskbar: 150ms cubic-bezier(0.4,0,1,1)              |
|App Launcher    |200ms slide-up + blur-in                                   |
|Context menus   |80ms scale from origin point                               |
|Hover states    |60ms color transition                                      |
|Drag/resize     |No easing — follow pointer exactly                         |

### 5.7 Iconography

- 16×16 SVG icons for taskbar and UI chrome
- 32×32 SVG icons for desktop shortcuts and app launcher
- Style: pixel-art meets flat design — 1px strokes, no gradients in icons
- System icons: monochrome (`--color-text-secondary`)
- App icons: can use accent color; each app has a unique color identity
- No external icon library — custom SVG set committed to `src/ui/icons/`

### 5.8 CRT / Scanline Effects

- Optional CRT overlay: subtle scanlines via CSS `repeating-linear-gradient`, 2px pitch, 4% opacity
- Phosphor glow on active elements: `text-shadow: 0 0 8px var(--color-accent-primary)`
- Boot sequence: full CRT on, screen flicker effect using CSS animation
- User can disable all effects in Settings.EXE (`prefers-reduced-motion` always respected)

-----

## 6. App System Architecture

### 6.1 App Manifest Specification

Every app must export a manifest object conforming to the `AppManifest` interface:

```typescript
interface AppManifest {
  id: string;              // Unique snake_case identifier e.g. 'file_man'
  name: string;            // Display name e.g. 'FileMan.EXE'
  version: string;         // Semver e.g. '2.0.0'
  description: string;     // One-line description for launcher
  category: AppCategory;   // 'system' | 'personal' | 'creative' | 'games' | 'experimental'
  icon: string;            // Path to SVG icon
  defaultSize: { w: number; h: number };
  minSize?: { w: number; h: number };
  maxSize?: { w: number; h: number };
  singleton?: boolean;     // If true, only one instance can run
  resizable?: boolean;     // Default: true
  maximizable?: boolean;   // Default: true
  hidden?: boolean;        // If true, doesn't appear in launcher (easter egg apps)
  requiresStorage?: boolean;
  keywords?: string[];     // Launcher search tags
}
```

### 6.2 App Registration

Apps register with the OS via a central `AppRegistry` service at module import time, not at render time:

```typescript
// In each app's index.ts:
import { AppRegistry } from '@/core/AppRegistry';
import { manifest } from './manifest';
import { FileManApp } from './FileManApp';

AppRegistry.register(manifest, FileManApp);
```

The `AppRegistry` is imported once in the OS bootstrap (`main.tsx`). App code is lazy-loaded via dynamic import — apps do not load until opened.

### 6.3 App Component Contract

Every app component receives a standard set of props injected by the window manager:

```typescript
interface AppProps {
  windowId: string;         // Unique ID of this window instance
  isActive: boolean;        // Whether this window is focused
  isMobile: boolean;        // Mobile viewport flag
  osApi: OsApi;             // OS API surface
}
```

### 6.4 OsApi Surface

Apps communicate with the OS exclusively through the `OsApi` interface. Direct access to the window manager store is forbidden from app code:

```typescript
interface OsApi {
  // Window operations
  closeWindow(windowId: string): void;
  minimizeWindow(windowId: string): void;
  setTitle(windowId: string, title: string): void;
  requestFocus(windowId: string): void;
  // App launching
  launchApp(appId: string, args?: Record<string, unknown>): string;
  // Storage
  storage: OsStorageApi;
  // Notifications
  notify(opts: NotifyOptions): void;
  // Event bus
  emit(event: string, payload: unknown): void;
  on(event: string, handler: (payload: unknown) => void): () => void;
}
```

### 6.5 Inter-App Communication

- Apps do not call each other directly. Use the OS event bus via `OsApi`.
- Events are namespaced by emitting app ID to prevent collisions.
- Example: FileMan emits `'file_man:file:open'` with a file path; ME.EXE listens and opens the appropriate viewer.

### 6.6 Storage API

Apps that need persistence use `OsStorageApi`, which wraps localStorage with namespacing and schema versioning:

```typescript
interface OsStorageApi {
  get<T>(key: string): T | null;
  set<T>(key: string, value: T): void;
  delete(key: string): void;
  clear(): void;  // Clears only this app's namespace
}
```

Storage keys are automatically namespaced as `app.{appId}.{key}`.

-----

## 7. Codebase Architecture

### 7.1 Directory Structure

```
src/
  core/                  # OS kernel layer — never import apps from here
    AppRegistry.ts
    EventBus.ts
    OsBootstrap.tsx
    types.ts

  windowing/             # Window Manager — isolated subsystem
    WindowManager.tsx
    Window.tsx
    useWindowManager.ts
    windowStore.ts       # Zustand store
    DragHandle.tsx
    ResizeHandle.tsx
    SnapGuide.tsx

  desktop/               # Desktop shell
    Desktop.tsx
    Taskbar.tsx
    AppLauncher.tsx
    DesktopIcon.tsx
    ContextMenu.tsx
    BootSequence.tsx

  apps/                  # All application code
    terminal/
      index.ts           # Registers with AppRegistry
      manifest.ts
      TerminalApp.tsx
    fileman/
    arcade/
      games/
        pong/
        snake/
        tron/
    me/
    you/
    third/
    home/
    settings/

  ui/                    # Shared UI component library
    icons/
    Button.tsx
    Input.tsx
    ScrollArea.tsx
    ProgressBar.tsx
    Modal.tsx
    Tooltip.tsx
    index.ts

  hooks/                 # Shared React hooks
    useKeyboardShortcut.ts
    useLocalStorage.ts
    useOsApi.ts
    useMobileDetect.ts
    useAnimationFrame.ts

  services/              # Non-React singletons
    VirtualFileSystem.ts
    YouApiClient.ts
    StorageService.ts
    NotificationService.ts

  styles/                # Global SCSS
    tokens.scss          # All design tokens as CSS custom properties
    reset.scss
    typography.scss
    animations.scss
    index.scss

  types/                 # Global TypeScript types
    os.d.ts
    vfs.d.ts
    events.d.ts
```

### 7.2 Layer Boundaries

|Layer       |Can Import From                                               |Cannot Import From                            |
|------------|--------------------------------------------------------------|----------------------------------------------|
|`core/`     |`types/`, `services/`                                         |`windowing/`, `desktop/`, `apps/`, `ui/`      |
|`windowing/`|`core/`, `ui/`, `hooks/`, `styles/`                           |`apps/`, `desktop/`, `services/`              |
|`desktop/`  |`core/`, `windowing/`, `ui/`, `hooks/`, `services/`, `styles/`|`apps/` (uses AppRegistry only)               |
|`apps/*/`   |`ui/`, `hooks/`, `services/`, `core/types`                    |`windowing/` internals, other `apps/` directly|
|`ui/`       |`styles/`, `types/`                                           |Everything else                               |
|`services/` |`types/`                                                      |React components, `windowing/`, `apps/`       |


> **Boundary rule:** If you find yourself importing from `windowing/` inside an app, or from `apps/` inside `desktop/`, you have a layer violation. Refactor via `OsApi` or `EventBus`.

### 7.3 State Management

|Concern         |Solution                                                                 |
|----------------|-------------------------------------------------------------------------|
|OS/Window state |Zustand — `windowStore` (position, size, z-index, open windows)          |
|App-local state |React `useState` / `useReducer` — never leaks outside the app component  |
|Persistent state|`OsStorageApi` (wraps localStorage) — via `hooks/useLocalStorage`        |
|Server state    |TanStack Query — for YOU.EXE API calls only                              |
|Global UI state |Zustand — `desktopStore` (active window ID, launcher open, boot complete)|

-----

## 8. Coding Standards

### 8.1 TypeScript

- `tsconfig`: `strict: true`, `noImplicitAny: true`, `exactOptionalPropertyTypes: true`
- No `any`. Use `unknown` and narrow, or define proper types.
- All exported functions and components have explicit return types.
- Prefer `type` over `interface` for unions; prefer `interface` for object shapes.
- Use string literal unions instead of TypeScript `enum` (better tree-shaking).

### 8.2 Component Patterns

- One component per file. File name matches component name exactly.
- Prefer functional components with hooks. No class components.
- Props interfaces defined in the same file, named `[ComponentName]Props`.
- Avoid prop drilling beyond 2 levels. Use context or Zustand for deeper sharing.
- Never use `React.FC` — declare props explicitly and return `JSX.Element | null`.

### 8.3 Naming Conventions

|Thing            |Convention                   |Example                        |
|-----------------|-----------------------------|-------------------------------|
|React component  |PascalCase                   |`FileManApp.tsx`               |
|Hook             |camelCase, `use` prefix      |`useWindowManager.ts`          |
|Service/singleton|PascalCase + `Service` suffix|`StorageService.ts`            |
|Store (Zustand)  |camelCase + `Store` suffix   |`windowStore.ts`               |
|Type / Interface |PascalCase                   |`AppManifest`, `WindowState`   |
|CSS token        |kebab-case, `--` prefix      |`--color-accent-primary`       |
|SCSS module class|camelCase                    |`styles.titleBar`              |
|Event name       |`domain:action` pattern      |`'file:open'`, `'window:close'`|
|App ID           |snake_case                   |`'file_man'`, `'terminal'`     |

### 8.4 SCSS / Styling

- All design tokens defined in `styles/tokens.scss` as CSS custom properties. Zero magic numbers.
- Component styles use SCSS modules (`.module.scss`). No global class names from component files.
- No inline styles except for dynamic values (window position/size): `style={{ transform: \`translate(${x}px, ${y}px)` }}`
- Media queries use SCSS mixins wrapping breakpoint tokens, not raw pixel values.

### 8.5 Testing

- Vitest for unit tests. React Testing Library for component tests.
- Every service must have unit tests (`services/` has 80%+ coverage requirement).
- Every hook must have unit tests.
- Window Manager core logic (snap, clamp, z-index) must have unit tests.
- Apps: integration test for open/close lifecycle.
- CI gate: `npm test` and `npm run build` must pass before merge.
- No snapshot tests — brittle and add no design-level value.

### 8.6 Documentation

- Every exported function, type, and component has a JSDoc comment (one-liner minimum).
- Complex logic has inline comments explaining *why*, not *what*.
- ADRs in `docs/adr/` for any architectural choice that isn’t obvious.
- `CHANGELOG.md` updated on every milestone merge.

### 8.7 Git Discipline

- One concern per commit. Conventional Commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`.
- No direct commits to `main`. All changes via PR.
- Branch naming: `feature/wm-snap-preview`, `fix/window-z-storm`, `chore/update-tokens`.

-----

## 9. Migration Strategy

> **Core constraint:** The existing repository is reference implementation only. v2 is a clean rewrite, not a refactor. No existing code is copy-pasted without deliberate review against v2 standards.

### 9.1 Guiding Principles

- Green baseline at all times: every PR leaves the project buildable and testable.
- Feature parity gate: no stage is complete until all apps from the previous version are functional.
- Design token first: all visual decisions in tokens before any component styling.
- Window Manager before apps: nothing gets built on an unstable foundation.
- Parallel reference: keep v1 repo available for behavioral reference but never copy code.

### 9.2 Stage Breakdown

#### Stage 1 — Project Foundation

- Vite + React 18 + TypeScript strict config from scratch
- SCSS token system (`tokens.scss` with all design tokens)
- Font loading and reset
- Core types (`os.d.ts`, `vfs.d.ts`, `events.d.ts`)
- `AppRegistry`, `EventBus`, `StorageService`
- Boot sequence (static, no animation yet)
- Vitest + React Testing Library baseline
- CI: GitHub Actions running test + build on PR

#### Stage 2 — Window Manager

- Zustand `windowStore`
- `Window` component (chrome, title bar, controls)
- Drag (pointer events, transform-based, clamping)
- Resize (edge/corner handles)
- Focus and z-index management
- Window lifecycle animations
- Snap preview and snap logic
- Alt+Tab switcher
- WindowManager unit tests

#### Stage 3 — Desktop Shell

- Desktop canvas component
- Taskbar (logo, task list, system tray, clock)
- App Launcher overlay (search, categories, keyboard nav)
- Desktop icon component
- Context menu system (right-click + long-press)
- Boot sequence animation
- Mobile layout (full-screen mode, bottom dock)

#### Stage 4 — Core Apps

- `Terminal.EXE` — basic shell, command parsing
- `FileMan.EXE` — VFS explorer, list/grid view, viewers
- `Settings.EXE` — theme toggle, CRT effects, window chrome style
- `ME.EXE` — about/shell with VFS integration

#### Stage 5 — Social & Creative Apps

- `YOU.EXE` — message board with Supabase backend
- `HomeDashboard` — portfolio overview

#### Stage 6 — Experimental Apps

- `THIRD.EXE` — three.js sandbox (physics, object mode)
- `Arcade.EXE` — Pong, Snake, Tron games
- `CONNECT.EXE` — to be defined

#### Stage 7 — Polish & Launch

- CRT scanline effect system
- Full keyboard navigation audit
- Performance audit (Lighthouse, React DevTools profiler)
- Mobile experience QA
- Accessibility audit (`prefers-reduced-motion`, contrast ratios)
- Production build optimization (code splitting per app, lazy loading)

-----

## 10. Implementation Roadmap

This roadmap is sequenced for the Claude–Codex–Gemini pipeline. Each task is scoped to be implementable in a single Codex session with clear acceptance criteria.

### Phase 1: Foundation (Stages 1–2)

|Task ID|Task                      |Acceptance Criteria                                                          |Agent|
|-------|--------------------------|-----------------------------------------------------------------------------|-----|
|T-01   |Vite + TS + React scaffold|`npm run dev` serves; `npm test` passes empty suite; `npm run build` succeeds|Codex|
|T-02   |Design token SCSS system  |`tokens.scss` exports all tokens; no hardcoded values elsewhere              |Codex|
|T-03   |Core types                |`os.d.ts`, `vfs.d.ts`, `events.d.ts` compile with strict mode; no `any`      |Codex|
|T-04   |AppRegistry + EventBus    |Register/lookup/emit/on work; unit tests pass                                |Codex|
|T-05   |StorageService            |Namespaced get/set/delete/clear work; unit tests pass                        |Codex|
|T-06   |Boot sequence (static)    |Full-screen boot renders and dismisses on click/keypress                     |Codex|
|T-07   |Zustand windowStore       |Open/close/minimize/focus/setPosition/setSize actions; unit tests pass       |Codex|
|T-08   |Window chrome component   |Title bar, controls, content slot render correctly; props match `AppProps`   |Codex|
|T-09   |Drag system               |Transform-based; clamped to viewport; 60fps                                  |Codex|
|T-10   |Resize system             |All 8 handles work; min size respected; 60fps                                |Codex|
|T-11   |Focus + z-index           |Click brings window to front; active border shows; z-index stack correct     |Codex|
|T-12   |Window animations         |Open/close/minimize match spec (150ms ease-out)                              |Codex|
|T-13   |Snap system               |Edge snap preview + snap on release; Alt suppresses                          |Codex|

### Phase 2: Shell (Stage 3)

|Task ID|Task               |Acceptance Criteria                                                     |Agent|
|-------|-------------------|------------------------------------------------------------------------|-----|
|T-14   |Desktop canvas     |Fixed viewport, correct layer z-index, wallpaper renders                |Codex|
|T-15   |Taskbar            |Logo, task buttons, clock, tray render; task button focus/minimize works|Codex|
|T-16   |App Launcher       |Ctrl+Space opens; search filters; keyboard nav; Enter opens app         |Codex|
|T-17   |Desktop icons      |Double-click opens app; right-click context menu appears                |Codex|
|T-18   |Context menu system|Right-click shows correct menu; ESC/click-out dismisses                 |Codex|
|T-19   |Alt+Tab switcher   |Cycles through open windows; correct preview labels                     |Codex|
|T-20   |Mobile layout      |< 768px: full-screen app mode; bottom dock; swipe between apps          |Codex|
|T-21   |Boot animation     |CRT flicker → boot text → desktop fade-in; total < 3 seconds            |Codex|

### Phase 3: Core Apps (Stage 4)

|Task ID|Task                 |Acceptance Criteria                                                    |Agent|
|-------|---------------------|-----------------------------------------------------------------------|-----|
|T-22   |Terminal.EXE scaffold|App manifest registered; window opens; basic prompt renders            |Codex|
|T-23   |Terminal.EXE commands|`help`, `ls`, `cd`, `cat`, `clear`, `echo` work; unknown command errors|Codex|
|T-24   |FileMan.EXE + VFS    |VFS loads from JSON manifest; directory tree and file list render      |Codex|
|T-25   |FileMan viewers      |Text/image/video/project files open in viewer windows via OsApi        |Codex|
|T-26   |Settings.EXE         |Theme/CRT/chrome toggles work; settings persist via StorageService     |Codex|
|T-27   |ME.EXE               |About content renders; VFS integrated; panel + fullscreen modes work   |Codex|

### Phase 4: Social & Creative (Stage 5)

|Task ID|Task              |Acceptance Criteria                                                        |Agent|
|-------|------------------|---------------------------------------------------------------------------|-----|
|T-28   |YOU.EXE + Supabase|GET loads board; POST submits message; rate limiting via `x-you-client-key`|Codex|
|T-29   |YOU.EXE UI polish |Dock indicator shows unread badge; draft persists in session               |Codex|
|T-30   |HomeDashboard     |Portfolio overview renders; links to other apps via `OsApi.launchApp`      |Codex|

### Phase 5: Experimental (Stage 6)

|Task ID|Task               |Acceptance Criteria                                              |Agent|
|-------|-------------------|-----------------------------------------------------------------|-----|
|T-31   |THIRD.EXE scaffold |Three.js scene renders inside window; edit/play mode toggle works|Codex|
|T-32   |THIRD.EXE physics  |Object grab + physics work; autosave to StorageService           |Codex|
|T-33   |Arcade.EXE scaffold|App opens; game selection screen renders                         |Codex|
|T-34   |Pong               |Two-player or AI Pong playable inside Arcade window              |Codex|
|T-35   |Snake              |Classic Snake; score display; game over restart                  |Codex|
|T-36   |Tron               |Tron light-cycle; AI opponent with pathfinding                   |Codex|

### Phase 6: Polish & Launch (Stage 7)

|Task ID|Task              |Acceptance Criteria                                                                               |Agent |
|-------|------------------|--------------------------------------------------------------------------------------------------|------|
|T-37   |CRT effect system |Scanlines + phosphor glow on by default; Settings toggle works; `prefers-reduced-motion` respected|Codex |
|T-38   |Keyboard audit    |All shortcuts work; no focus traps; Tab navigation logical in all apps                            |Codex |
|T-39   |Performance audit |Lighthouse perf > 85; window drag sustains 60fps on mid-tier device                               |Gemini|
|T-40   |Mobile QA         |All core apps functional at 375px; touch targets ≥ 44px                                           |Gemini|
|T-41   |Accessibility     |Contrast ratios WCAG AA; `prefers-reduced-motion` kills all animations                            |Gemini|
|T-42   |Code splitting    |Each app lazy-loaded; initial bundle < 200KB gzipped                                              |Codex |
|T-43   |Prod deploy config|`npm run build` produces clean `dist/`; deploys to Vercel/Netlify via CI                          |Codex |

-----

### Claude’s Role as Architecture Guardian

In the Claude–Codex–Gemini pipeline, Claude reviews every PR against this specification document. If a Codex implementation violates a layer boundary, uses `any` instead of a proper type, or deviates from the App Manifest contract, Claude flags it before Gemini validates.

**The spec is the source of truth. Code is evidence of compliance.**

-----

*END OF SPECIFICATION — Terminal-OS v2.0 Architecture Blueprint*

*Document version 1.0 | March 2026 | Architecture: Claude Sonnet 4.6*
