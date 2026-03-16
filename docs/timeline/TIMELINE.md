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

**SITE-SHELL-03 (navigation bar) completed 2026-03-16.**

After the hard reset, the first rebuild step was the persistent navigation bar, coordinated through agentchattr with all agents aligned before implementation. The site now renders a warm neutral page (#f5e6d3) with the nav bar on the same background plane (transparent). Active channel selection uses a subtle lift animation with a warm accent (#c4956a). CONNECT.EXE is visible but disabled until wired. Palette follows D-22/D-26: warm neutral, no blue, near-transparent surfaces.

Future channels (NEWS.EXE, RADIO.EXE/SIGNAL.EXE, EARTH.EXE) are noted in docs for discussion only — no implementation until the original channels are operational.

All infrastructure remains intact: the glass module, store, windowing, apps, and config are preserved. The SHELL-01A/01B OS desktop code remains preserved and will be integrated into ME.EXE in Phase 2.

## How to read this

- Start with the latest completed milestone if you want the current state
- Read from the beginning if you want the full story
- Open the milestone files in `milestones/` for detailed progress entries

## Milestones

Milestones are recorded as readable process entries for technical and
non-technical reviewers.

### Planned next milestones

- SITE-SHELL-04 — channel routing and content surfaces
- SITE-SHELL-05 — glass re-integration (when layout is stable)
- ME-DESKTOP-01 — OS desktop wired into ME.EXE channel (Phase 2)

### What reviewers should expect next

- Incremental rebuilding from a blank page, one component at a time
- Agent coordination through agentchattr before implementation
- Glass effects will return once the layout foundation is stable

### Completed milestone highlights

- Stage 1A (original) — first shell UI pass: hero HOME composition, channel navigation, ME.EXE taskbar boundary (`docs/timeline/milestones/01-stage-1a-shell-scaffold.md`)
- SHELL-01A (v2) — desktop shell frame + boot gate + static taskbar, contract-first v2 rewrite with Playwright screenshots (`docs/timeline/milestones/02-shell-01a-desktop-frame.md`)
- SITE-SHELL-01 — liquid glass channel surface mounted as new site root (`docs/timeline/milestones/03-site-shell-01-liquid-glass-root.md`)
- SITE-SHELL-01B — WebGL2 liquid glass renderer added; visual refinement to warm neutral palette, reference-calibrated refraction (`docs/timeline/milestones/04-site-shell-01b-webgl-glass-renderer.md`)
- SITE-SHELL-02 — Hard reset: surface layer stripped to blank canvas after liquid glass churn; infrastructure preserved, rebuild planned via agentchattr (`docs/timeline/milestones/05-site-shell-02-hard-reset.md`)
- SITE-SHELL-03 — Persistent navigation bar: warm neutral palette (D-22/D-26), unified bar with lift animation, CONNECT.EXE disabled placeholder, future channels documented (`docs/timeline/milestones/06-site-shell-03-nav-rebuild.md`)
