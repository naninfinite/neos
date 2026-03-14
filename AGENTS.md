# AGENTS

## Project mode

Fresh rebuild. Do not refactor legacy code in place.

## Edit boundary

Only edit this repository.

The legacy Terminal-OS repository is reference-only and must not be treated as the architectural base of the new system.

## Authority order

1. `docs/spec/05-implementation-decisions-lock.md`
2. `docs/spec/SOURCE_OF_TRUTH.md`
3. `docs/spec/03-type-contracts.md`
4. `docs/spec/02-runtime-architecture.md`
5. `docs/spec/01-blueprint.md`
6. `docs/spec/04-issues-register.md` (reference only)

## Agent roles

- Claude — architecture/spec guard
- Codex — implementation
- Gemini — validation

## Active lanes

### SITE-SHELL (current priority)
Implement the liquid glass channel surface as the site root.

**Completed:**
- SITE-SHELL-01: `src/site/` structure mounted; `SiteShell`, `ChannelSurface`, `SiteBootOverlay`, `siteStore`
- SITE-SHELL-01B: `src/site/glass/` WebGL2 refraction renderer; warm neutral palette; reference-calibrated glass parameters (D-25, D-26)

**Active:**
- `src/main.tsx` mounts `SiteShell`, not `OsBootstrap`
- Aesthetic: warm neutral, transparent, glassmorphic — no blue, no opaque fills
- WebGL2 canvas at `z-index: 0`; glass regions self-register via `useGlassRegion`
- No OS desktop, no windowing, no app runtime at this layer

### ME-DESKTOP (Phase 2 — not yet active)
Wire the existing `src/desktop/` OS shell code into ME.EXE.
- Uses SHELL-01A/01B code from `src/desktop/` and `src/windowing/`
- Operates exclusively inside the ME.EXE channel
- Do not start this lane until SITE-SHELL is stable

### CHANNEL-YOU / CHANNEL-THIRD (Phase 3 — frozen)
Isolated channel runtimes for YOU.EXE and THIRD.EXE.
Not started.

### CONNECT-IMPLEMENTATION (frozen)
Do not implement. Frozen per D-16.

### SHELL-DESKTOP (retired as a site-wide lane)
This lane was building the OS desktop as a site-wide shell. That direction is superseded by D-20.
The code built in this lane (`src/desktop/`, `src/windowing/`) is preserved and will be used in ME-DESKTOP.
Do not continue building site-wide desktop/shell components.

## Workflow rules

- Make small, reviewable changes
- Update docs if contracts change
- Do not invent unresolved behaviour
- Flag contradictions instead of guessing
- The site root is a channel surface — never mount OS desktop components at site level
- Each channel is isolated — do not share state across channels
- Treat the legacy repo as visual/behaviour reference only
- Never copy legacy architecture blindly

## Implementation posture

This repository is the active implementation target.

The legacy repo may be inspected for:
- app behaviour
- prior UX flows
- command lists
- content structure
- feature intent

The legacy repo must not be used as the default source of structure, state design, or runtime architecture.

## Handoff rule

Before starting substantial work, read the authority documents in the order above and align the task with the locked decisions.

## Skill usage

Before doing any non-trivial work, use `workflow-router` to select the relevant skill from `.agents/skills`.

Default sequence for implementation tasks:

1. `workflow-router`
2. `spec-reader`
3. `implementation-brief`
4. `architecture-guard` if structural impact exists
5. `implementation-diff-writer`
6. `validation-auditor`

For small contained fixes:

1. `workflow-router`
2. `task-scope-lock`
3. `implementation-diff-writer`
4. `validation-auditor`

## Playwright / timeline guard

For any task involving visible UI changes, screenshots, visual regression, timeline updates, or PDF export, agents must use `playwright-timeline-guard` before continuing.

If Playwright is not installed or not runnable on the current device, agents must explicitly inform the user and stop the visual/timeline portion of the task. They must not silently skip screenshots or PDF export.

## Timeline documentation

For any meaningful visible milestone, agents must use `timeline-updater` to keep the timeline readable for non-technical readers.

For screenshot and visual asset refresh work, agents must use `ui-milestone-capture` after Playwright preflight passes.

Any task that requests screenshots, preview capture, or timeline/PDF refresh is considered incomplete unless Playwright preflight passes or the user is explicitly informed that Playwright is unavailable.

Timeline completion gate for visible/milestone work:
- update/create the correct file in `docs/timeline/milestones/`
- update `docs/timeline/TIMELINE.md`
- update `docs/timeline/site/timeline.html` when the narrative shown in the PDF changes
- refresh screenshots in `docs/timeline/assets/<milestone>/` when visual state changed or capture was requested
- preserve historical assets: never overwrite or delete existing timeline screenshots; add new files/folders for new states
- regenerate `docs/timeline/exports/neos-timeline.pdf` when timeline text/images changed or PDF was requested
- report what was updated (or why it was intentionally skipped) before marking the task complete
