# Agent Hub

This is the single reference document for all agents starting a new session.
Read this first before doing any work.

Last updated: 2026-03-16

---

## Project at a glance

**NEOS** is a browser-based portfolio experience built around isolated channel surfaces.

- **Site root** = liquid glass channel surface (light, glassmorphic) — `src/main.tsx` mounts `SiteShell`
- **ME.EXE** = OS desktop experience (windows, taskbar, apps) — later phase, inside channel only
- **YOU.EXE** = social/message-board — later phase
- **THIRD.EXE** = 3D/world-building — later phase
- **CONNECT.EXE** = continues separately, deliberately late in sequence

---

## Current state (2026-03-16)

### Hard reset completed

The home page surface was stripped to a **blank warm-neutral page**. Multiple agents iterating in parallel on the liquid glass UI created churn without convergence. The decision was made to rebuild incrementally with coordinated planning.

### What exists now

| Layer | Status |
|-------|--------|
| `src/main.tsx` → `SiteShell` | Working entry point (blank page) |
| `src/site/SiteShell.tsx` | Empty `<main>` with warm background |
| `src/site/ChannelSurface.tsx` | Empty shell (interface preserved) |
| `src/site/siteStore.ts` | Intact — channel state + boot state |
| `src/site/SiteBootOverlay.tsx` | Intact — not currently mounted |
| `src/site/glass/` (6 files) | Intact — WebGL2 renderer, not mounted |
| `src/styles.css` | Base resets only |
| `src/desktop/`, `src/windowing/` | Intact — scoped to ME.EXE |
| `src/apps/connect-exe/` | Intact — continues separately |
| `src/core/`, `src/services/`, `src/ui/` | Intact |
| All docs, specs, config | Intact |

### What was removed

- All inline style objects from SiteShell and ChannelSurface (~1,700 lines)
- All component CSS classes from styles.css (~800 lines)
- Unused `App.tsx` (duplicate entry point)

---

## Restart rule

When you reopen the workflow, the first question should be:

**"Which milestone in the ordered execution plan are we on, and what is the next smallest reviewable implementation step?"**

The answer should generally stay in the **site-shell / platform / home foundation zone** — not CONNECT gameplay or heavy channel runtimes.

---

## Full execution order

This is the master build sequence. It follows repo authority: site shell first (D-20), OS desktop scoped to ME.EXE (D-21/D-24), CONNECT deliberately late.

### Lane 0 — Orchestration

Runs continuously. Not an implementation lane.

- Check authority order before every milestone
- Confirm scope boundary
- Decide which lane moves next
- Block premature work on CONNECT / heavy channel runtimes
- Record milestone status

### Lane 1 — Site shell rebuild (current priority)

The site root is a channel surface, not an OS desktop (D-20).

#### S-01 Navigation bar
- [ ] Nav bar component (channels, branding, status)
- [ ] Wire to siteStore channel switching
- [ ] Warm neutral styling (D-26)

#### S-02 Channel routing + content viewport
- [ ] Route active channel to content area
- [ ] Home view with placeholder content
- [ ] Channel placeholder views for ME/YOU/THIRD
- [ ] Keep CONNECT out of the critical path for this lane unless a non-driving placeholder is explicitly needed

#### S-03 Home channel content
- [ ] Hero section / featured channel card
- [ ] Channel dock / entry points
- [ ] Content layout and typography
- [ ] Desktop preview-surface compliance (previews only, no heavy runtimes)

#### S-04 Glass re-integration
- [ ] Mount GlassCanvas in SiteShell
- [ ] Register glass regions on nav bar and hero
- [ ] Calibrate glass parameters to new layout
- [ ] GlassTuningPanel for dev iteration

#### S-05 Boot sequence + polish
- [ ] Boot overlay or entry experience
- [ ] Transitions and micro-interactions
- [ ] Responsive / mobile adaptation
- [ ] Timeline milestone capture

**Lane completion:** Site shell looks and works as a channel surface with navigation, content, and glass effects.

### Lane 2 — ME.EXE integration (OS desktop inside channel)

Wire preserved `src/desktop/` and `src/windowing/` code into the ME.EXE channel. OS desktop is NOT at site root (D-21, D-24).

#### M-01 Core contracts
- [ ] `os.d.ts`, `vfs.d.ts`, `events.d.ts`, `core/types.ts`
- [ ] Locked constants: `Z_LAYER`, `SETTINGS_KEYS`

#### M-02 Core services
- [ ] `AppRegistry`, `EventBus`, `StorageService`
- [ ] `NotificationService`, `VirtualFileSystem` shell
- [ ] `OsBootstrap`

#### M-03 Desktop boot shell (inside ME.EXE)
- [ ] `Desktop.tsx`, `Wallpaper.tsx`, `BootSequence.tsx`
- [ ] `desktopStore`, boot complete flow
- [ ] Notification/context menu layer mounts

#### M-04 Taskbar + overlays
- [ ] `Taskbar`, `NotificationLayer`, `ContextMenuLayer`
- [ ] Clock/tray placeholders
- [ ] Desktop overlay dismiss behaviour

**Lane completion:** ME.EXE boots to desktop with taskbar. No apps required yet.

### Lane 3 — Windowing / OsApi (inside ME.EXE)

#### W-01 Window store
- [ ] `windowStore`, `WindowState`
- [ ] open/close/focus/minimise/maximise/restore
- [ ] z-index ownership, active window tracking

#### W-02 Window rendering
- [ ] `WindowManager`, `WindowLayer`, `WindowFrame`
- [ ] `AppRuntime`, `AppErrorBoundary`

#### W-03 Interaction model
- [ ] Drag, resize, clamping, snap
- [ ] Focus on click, Alt+Tab (D-17)
- [ ] Mobile history cleanup on close (D-18)

#### W-04 `useOsApi`
- [ ] Window-scoped `OsApi` (D-07)
- [ ] `launchApp()` returns `windowId` (D-08)
- [ ] `notify()` routes through service (D-10)
- [ ] VFS methods on `osApi.vfs` (D-09)

**Lane completion:** Multiple windows, focus/z-order, taskbar switching, OsApi contract satisfied.

### Lane 4 — Launcher / app registration (inside ME.EXE)

#### A-01 Manifest registration
- [ ] All core manifests registered
- [ ] Lazy loading via `appRegistry.register(manifest, () => import(...))` (D-03, D-04)

#### A-02 Launcher
- [ ] `AppLauncher` with category grouping, search, keyboard nav
- [ ] Hidden viewer apps excluded from UI (D-13)

#### A-03 Desktop icons
- [ ] Curated shortcuts, double-click open, right-click context menu
- [ ] No persisted positions (D-14)

**Lane completion:** Launcher works, app discovery works, registration matches contract.

### Lane 5 — Core apps (inside ME.EXE)

#### C-01 Terminal.EXE
#### C-02 FileMan.EXE (VFS browser + hidden viewers)
#### C-03 Settings.EXE (CRT toggle, window style — D-15)
#### C-04 Arcade.EXE (only after platform stable)

**Lane completion:** Core system feels like an OS, not just a shell mockup.

### Lane 6 — Channel runtimes

#### CH-01 ME.EXE full runtime polish
#### CH-02 YOU.EXE runtime
#### CH-03 THIRD.EXE runtime
#### CH-04 CONNECT.EXE spec-to-runtime kickoff

CONNECT is deliberately late — gameplay work should not outrun shell/platform architecture.

### Lane 7 — CONNECT spec (parallel discussion, not early implementation)

Use this lane for topology, puzzle logic, convergence garden, bearing disc, stamina/jump rules, runtime state model, host authority. Do NOT let this lane drive early platform code.

### Lane 8 — Polish + production

- Animations, transitions, GSAP
- Performance, code splitting, bundle optimisation
- Identity and atmosphere pass
- Mobile optimisation
- Launch preparation

---

## Validation (runs after every milestone)

### Gemini checks
- Authority-order compliance
- Contract compliance
- Boundary violations
- Regression risk
- Missing tests
- Doc updates needed

### Claude checks
- No legacy architecture leakage
- Shell/services/apps separation preserved
- Preview/runtime boundary preserved (Home/Desktop vs Channel Runtime Boundary + D-23 isolation)
- CONNECT scope not creeping forward
- Timeline documentation complete

---

## What to pause

Keep these out of active implementation until the execution sequence reaches them:

- CONNECT gameplay runtime, player controllers, traversal/puzzle systems
- Heavy THREE/WebGL desktop mounting
- Deep YOU.EXE backend polish
- THIRD.EXE persistence complexity

---

## Agentchattr channels

| Channel | Purpose |
|---------|---------|
| `#00-orchestration` | Top-level coordination, milestone briefs, scope decisions |
| `#shell-desktop` | Shell/desktop implementation discussion |
| `#windowing-osapi` | Windowing and OsApi work |
| `#home-integration` | Home channel, hero, dock |
| `#app-registration-launcher` | Launcher and app registration |
| `#core-apps` | Core app implementation |
| `#connect-spec` | CONNECT design discussion (not implementation) |

---

## How to work

1. **Read this document** at session start
2. **Check agentchattr** — read #00-orchestration for latest instructions
3. **Coordinate before implementing** — propose work in chat, get agreement
4. **One piece at a time** — do not jump ahead in the roadmap
5. **Follow authority order**: `05-implementation-decisions-lock.md` → `SOURCE_OF_TRUTH.md` → `03-type-contracts.md` → `02-runtime-architecture.md` → `01-blueprint.md`

---

## Key documents

| Document | Purpose |
|----------|---------|
| `docs/agents/AGENT_HUB.md` | This file — current state + roadmap |
| `docs/agents/AGENT_ROLES.md` | Permanent role definitions |
| `docs/agents/RESTART_PROMPT_TEMPLATE.md` | Paste into new AgentChatTR sessions |
| `docs/spec/SOURCE_OF_TRUTH.md` | Project definition + authority map |
| `docs/spec/05-implementation-decisions-lock.md` | Locked decisions (D-01 to D-26) |
| `docs/timeline/TIMELINE.md` | Chronological milestone overview |
| `docs/timeline/milestones/05-site-shell-02-hard-reset.md` | Latest milestone |

---

## Lessons learned

1. **Coordinate before coding** — parallel implementation without agreement creates churn
2. **One component at a time** — don't build nav + hero + cards + glass in one pass
3. **Agree on visual direction first** — palette, spacing, typography decided before coding
4. **Small commits, clear scope** — each agent has a defined piece to build
5. **Use agentchattr for planning** — not just status updates, but actual design decisions
6. **Site shell first, OS desktop inside ME.EXE** — respect D-20/D-21/D-24 boundary
