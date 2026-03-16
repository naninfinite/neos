# SOURCE_OF_TRUTH

## Project

**Working title:** Terminal-OS v2
**Status:** surface hard reset 2026-03-16 — rebuilding from blank canvas with coordinated planning
**Phase:** fresh rewrite in this repo; legacy project is read-only reference

## Project definition

Terminal-OS v2 is a browser-based portfolio experience built around isolated channel surfaces.

Visitors land on a **liquid glass channel surface** — a light, transparent, glassmorphic site shell that provides navigation to the product's channels. Each channel is an isolated runtime with its own experience and aesthetic.

**ME.EXE** is the channel that hosts the full OS desktop experience: windows, taskbar, launcher, apps, and the virtual filesystem. The OS metaphor lives inside ME.EXE, not at the site root.

**YOU.EXE**, **THIRD.EXE**, and other channels each mount their own isolated runtimes when entered.

## Working-title / naming rule

The current documents use **Terminal-OS v2** as the working title.

This title is not permanent. The project may later be renamed to better fit a broader futuristic / cyberpunk direction. A rename does not change the technical meaning of these documents.

## Current implementation strategy

- Build in a **fresh repo or fresh project folder**.
- Keep the legacy Terminal-OS codebase as **read-only reference**.
- Reuse behaviour and feature intent from legacy code.
- Do **not** port legacy architecture blindly.

## AgentChatTR roles

- **Claude** = Architecture and spec guard responsible for enforcing system architecture and protecting the integrity of the specification.
- **Codex** = Implementation engineer responsible for writing code and  implementing features defined by project specifications.
- **Gemini** = Validation and coordination agent responsible for reviewing outputs and confirming consistency between implementation and specification.

## Authority order

If documents conflict, use this order:

1. `05-implementation-decisions-lock.md`
2. `03-type-contracts.md`
3. `02-runtime-architecture.md`
4. `01-blueprint.md`
5. `04-issues-register.md` (reference only)

`00-master-index.md` is a guide, not a technical authority.

## Scope for initial v2 build

### Layer 1 — Site shell (immediate priority)

- Liquid glass channel surface: light, transparent, glassmorphic aesthetic
- Channel navigation and routing
- Boot / entry sequence for the site
- Isolated channel mounting and unmounting

### Layer 2 — ME.EXE channel (OS desktop experience)

The following belong inside ME.EXE, not at the site root:

- Desktop shell / taskbar / launcher
- Window manager
- Mobile adaptation layer for ME.EXE
- Typed event bus
- Virtual filesystem service
- Storage service
- Notifications
- Settings
- Core OS apps: Terminal, FileMan, Arcade, Settings
- Hidden viewer apps: `viewer_text`, `viewer_image`, `viewer_pdf`
- ME.EXE personal surface (About / identity)

### Layer 3 — Other channels

- YOU.EXE: social / message-board surface (isolated runtime)
- THIRD.EXE: three.js / 3D world-building surface (isolated runtime)
- CONNECT.EXE: active as a separate implementation lane, but not part of the current site-shell / ME.EXE critical path

### Out of scope unless separately re-locked later

- legacy in-place refactor
- server-first architecture
- route-based app navigation
- desktop icon position persistence
- CONNECT.EXE as a required launch-day app or platform-driving dependency

## Non-negotiable architectural rules

1. **The site root is a liquid glass channel surface, not an OS desktop.**
2. **The OS desktop experience (windows, taskbar, launcher, apps) lives inside ME.EXE only.**
3. **Each channel is isolated — channels do not share runtime state with each other or with the site shell.**
4. **Heavy runtimes (WebGL, audio, physics, multiplayer) mount only after explicit channel entry and must unmount on exit.**
5. **Inside ME.EXE: OS shell and apps are separate layers. Apps only talk to the shell through `OsApi`.**
6. **Services live outside React where appropriate.**
7. **Window state is owned by the window manager only (within ME.EXE).**
8. **Specs override memory or ad-hoc agent assumptions.**
9. **When a behaviour is superseded by the Decisions Lock, the older wording is obsolete even if still present in older docs.**

## Canonical implementation posture

- contract-first
- strict TypeScript
- lazy app loading
- hidden apps allowed for internal viewer flows
- no architecture drift from convenience refactors
- prefer small, reviewable milestones

## Read-before-build checklist

Before Codex starts any task, it should confirm:

- it has read this file
- it has checked the Decisions Lock
- it has used Type Contracts as the coding contract
- it is treating the Issues Register as history, not authority
- it is writing into the new repo, not mutating the legacy repo

## Kickoff milestone order

**Phase 1 — Site shell (current priority — rebuilding after hard reset)**
1. ~~Implement liquid glass channel surface as site root (`src/site/`)~~ Done then reset
2. Navigation bar rebuild (Stage R1)
3. Channel routing and content surfaces (Stage R2)
4. Home channel content (Stage R3)
5. Glass re-integration (Stage R4)
6. Boot sequence and polish (Stage R5)

See `docs/agents/AGENT_HUB.md` for the detailed staged roadmap.

**Phase 2 — ME.EXE OS desktop**
4. Wire existing `src/desktop/` shell code into ME.EXE channel
5. Implement windowing layer and `OsApi` inside ME.EXE
6. Implement launcher and app registration flow inside ME.EXE
7. Implement core OS apps (Terminal, FileMan, Arcade, Settings)

**Phase 3 — Other channels**
8. YOU.EXE runtime
9. THIRD.EXE runtime
10. Validation / regression passes

## Long-term product surfaces

The following are important long-term parts of the NEOS product vision, even if they are not all implemented in the current phase:

- Shell / desktop / launcher
- Core system apps
- YOU.EXE style social/message-board surface
- THIRD.EXE style three.js / 3D / world-building surface
- Experimental/creative apps
- Portfolio/media surfaces

The current shell pass does not need to expose all of these immediately.

However, implementation decisions should avoid blocking them structurally, visually, or navigationally.

The first visible shell may use a desktop, menu-based entry point, launcher-first model, or hybrid approach, as long as it preserves the OS illusion and leaves room for these future surfaces.

Long-term note:
NEOS is expected to grow beyond the initial shell into future surfaces including a message-board/social layer and a three.js / 3D world-building layer. These do not need to be implemented now, but the shell direction should leave room for them and should not assume the product ends at simple desktop windows only.
