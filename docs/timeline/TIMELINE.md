# NEOS Development Timeline

This document is the top-level chronological overview of the NEOS rebuild.

It is written to make the project understandable to both technical and non-technical readers.

## Timeline stages

**Phase 1 — Site Shell (current)**
- SITE-SHELL-01 — Liquid glass channel surface as site root
- SITE-SHELL-02 — Channel navigation and routing
- SITE-SHELL-03 — Site boot / entry sequence

**Phase 2 — ME.EXE OS Desktop**
- ME-DESKTOP-01 — Wire existing shell code into ME.EXE channel
- ME-DESKTOP-02 — Window manager inside ME.EXE
- ME-DESKTOP-03 — App runtime and launcher inside ME.EXE
- ME-DESKTOP-04 — Core OS apps

**Phase 3 — Other channels**
- YOU.EXE runtime
- THIRD.EXE runtime

**Historical stages (for reference)**
- Stage 0 — Foundations
- Stage 1A (original) — First shell UI pass (liquid glass channel navigation)
- SHELL-01A/01B (v2 build) — OS desktop shell frame — now re-scoped to ME.EXE

## Current status

**Architecture direction updated 2026-03-14.**

The project has confirmed its product direction: the site root is a liquid glass channel surface (light, transparent, glassmorphic). The OS desktop experience lives inside ME.EXE as an isolated channel.

SITE-SHELL-01 and SITE-SHELL-01B are now complete.

SITE-SHELL-01 wired the site root to a liquid glass channel surface structure.
SITE-SHELL-01B added a raw WebGL2 refraction renderer (`src/site/glass/`), calibrated to the archisvaze/liquid-glass reference parameters, and replaced the blue palette with warm neutral tones.

The SHELL-01A/01B OS desktop code remains preserved and will be integrated into ME.EXE in Phase 2.

## How to read this

- Start with the latest completed milestone if you want the current state
- Read from the beginning if you want the full story
- Open the milestone files in `milestones/` for detailed progress entries

## Milestones

Milestones are recorded as readable process entries for technical and
non-technical reviewers.

### Planned next milestones

- SITE-SHELL-02 — channel navigation and routing polish
- SITE-SHELL-03 — site boot/entry refinement
- ME-DESKTOP-01 — OS desktop wired into ME.EXE channel (Phase 2)

### What reviewers should expect next

- The site shell will gain richer navigation behavior while staying lightweight
- Screenshots will continue showing light liquid-glass direction
- ME.EXE will then reveal the OS desktop experience when entered

### Completed milestone highlights

- Stage 1A (original) — first shell UI pass: hero HOME composition, channel navigation, ME.EXE taskbar boundary (`docs/timeline/milestones/01-stage-1a-shell-scaffold.md`)
- SHELL-01A (v2) — desktop shell frame + boot gate + static taskbar, contract-first v2 rewrite with Playwright screenshots (`docs/timeline/milestones/02-shell-01a-desktop-frame.md`)
- SITE-SHELL-01 — liquid glass channel surface mounted as new site root (`docs/timeline/milestones/03-site-shell-01-liquid-glass-root.md`)
- SITE-SHELL-01B — WebGL2 liquid glass renderer added; visual refinement to warm neutral palette, reference-calibrated refraction (`docs/timeline/milestones/04-site-shell-01b-webgl-glass-renderer.md`)
