# NEOS Development Timeline

This document is the top-level chronological overview of the NEOS rebuild.

It is written to make the project understandable to both technical and non-technical readers.

## Timeline stages

- Stage 0 — Foundations
- Stage 1A — Shell Scaffold
- Stage 1B — Runtime Bootstrap
- Stage 2 — Window Manager
- Stage 3 — App Runtime
- Stage 4 — Core Apps
- Stage 5 — UX Polish
- Stage 6 — Identity / Visual Evolution

## Current status

Stage 1A (SHELL-01A) is implemented as a desktop shell frame milestone.

The project now lands into a structured desktop root with a boot gate,
preview surface, static taskbar, and a placeholder window runtime layer.
Heavy runtimes are still deferred.

## Why Stage 1A matters

Stage 1A is the first milestone where NEOS presents a real shell frame rather
than a starter placeholder.

It locked five core ideas:

- shell layer order is explicit
- boot overlay is present and non-blocking
- desktop remains a lightweight preview surface
- runtime mounting is isolated to `WindowLayer`
- taskbar zones exist before task logic is introduced

## How to read this

- Start with the latest completed milestone if you want the current state
- Read from the beginning if you want the full story
- Open the milestone files in `milestones/` for detailed progress entries

## Milestones

Milestones are recorded as readable process entries for technical and
non-technical reviewers.

### Planned next milestones

- Stage 1B — runtime folder structure, initial services/core shell
- Stage 2 — first functional window manager

### What reviewers should expect next

- clearer service/bootstrap wiring details in timeline docs
- first window lifecycle examples after `WindowLayer` integration
- updated screenshots showing transition from static shell to managed windows

### Completed milestone highlights

- Stage 1A (original) — first shell UI pass: hero HOME composition, channel navigation, ME.EXE taskbar boundary (`docs/timeline/milestones/01-stage-1a-shell-scaffold.md`)
- SHELL-01A (v2) — desktop shell frame + boot gate + static taskbar, contract-first v2 rewrite with Playwright screenshots (`docs/timeline/milestones/02-shell-01a-desktop-frame.md`)
