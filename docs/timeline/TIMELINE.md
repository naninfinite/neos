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

Stage 1A is implemented as a channel-based shell with scoped OS boundaries.

The project has moved from a global OS shell toward a clearer model:
site-level channel navigation on top, with ME.EXE as the contained OS
environment and taskbar owner.

## How to read this

- Start with the latest completed milestone if you want the current state
- Read from the beginning if you want the full story
- Open the milestone files in `milestones/` for detailed progress entries

## Milestones

Milestones will be added here as the project develops.

### Planned next milestones

- Stage 1B — runtime folder structure, initial services/core shell
- Stage 2 — first functional window manager

### Completed milestone highlights

- Stage 1A — first shell UI pass (channel bar + home panels + ME-local taskbar, heavy liquid-glass styling, boot placeholder)
