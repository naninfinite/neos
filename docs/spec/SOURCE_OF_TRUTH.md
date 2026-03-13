# SOURCE_OF_TRUTH

## Project

**Working title:** Terminal-OS v2  
**Status:** spec pack locked for implementation kickoff  
**Phase:** fresh rewrite in a new repo using the legacy project as read-only reference

## Project definition

Terminal-OS v2 is a browser-based desktop environment and portfolio shell.

It is not a real operating system. It is a curated, explorable personal computing environment that uses OS language, windows, apps, and a virtual filesystem to present work, experimentation, and identity.

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

### In scope

- shell / desktop / taskbar / launcher
- window manager
- mobile adaptation layer
- typed event bus
- virtual filesystem service
- storage service
- notifications
- settings
- core apps:
  - Home
  - Terminal
  - FileMan
  - Arcade
  - ME
  - YOU
  - THIRD
  - Settings
- hidden viewer apps for file opening:
  - `viewer_text`
  - `viewer_image`
  - `viewer_pdf`

### Out of scope unless separately re-locked later

- legacy in-place refactor
- server-first architecture
- route-based app navigation
- desktop icon position persistence in v2
- CONNECT.EXE as a required launch-day v2 app

## Non-negotiable architectural rules

1. **OS shell and apps are separate layers.**
2. **Apps only talk to the shell through `OsApi`.**
3. **Services live outside React where appropriate.**
4. **Window state is owned by the window manager only.**
5. **Specs override memory or ad-hoc agent assumptions.**
6. **When a behaviour is superseded by the Decisions Lock, the older wording is obsolete even if still present in older docs.**

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

1. scaffold repo and folder structure
2. implement core types and services
3. implement desktop + boot + taskbar shell
4. implement windowing layer and `OsApi`
5. implement launcher and app registration flow
6. implement core apps
7. implement validation / regression passes

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