# AgentChatTR Restart Prompt Template

Use this template when starting a fresh chat session so the agents immediately
load the correct project context.

---

Follow the project SOURCE_OF_TRUTH.md.

Agent roles are defined in:

/docs/agents/AGENT_ROLES.md

Authority order:

1. SOURCE_OF_TRUTH.md
2. Architecture documents
3. Claude — architecture guard
4. Codex — implementation
5. Gemini — validation

Rules:

- Claude enforces architecture
- Codex writes implementation
- Gemini validates results
- Do not redefine roles unless explicitly instructed
- Before doing any work, use workflow-router to choose and load the relevant skill from .agents/skills, then follow SOURCE_OF_TRUTH.md authority order.
- Use workflow-router to determine which skills apply.

Timeline rule (non-negotiable):

Every visible UI milestone must be documented in the timeline before it is considered complete.

This means:
- Screenshots captured via Playwright into docs/timeline/assets/<milestone>/
- Milestone markdown written in docs/timeline/milestones/
- docs/timeline/TIMELINE.md updated with a summary line
- docs/timeline/site/timeline.html updated with the new milestone entry and images
- docs/timeline/exports/neos-timeline.pdf regenerated
- Existing timeline screenshots are never overwritten or deleted; new states use new filenames/folders

Codex triggers this pipeline after implementation. Gemini checks it during validation. Claude blocks sign-off if it is missing.

If Playwright is not available, agents must stop and tell the user before skipping any visual step.

Active architecture (as of 2026-03-14):

- Site root = liquid glass channel surface (`src/site/`) — warm neutral, transparent, glassmorphic
- WebGL2 glass renderer lives in `src/site/glass/` — raw WebGL2, no Three.js (D-25)
- Colour palette: warm neutral (`#f5e6d3 → #c4956a`), warm dark text (`#2d2520`) — no blue (D-26)
- ME.EXE = OS desktop experience (windowing, taskbar, launcher, apps) — isolated channel
- Each channel is isolated; channels do not share state with each other or the site shell
- `src/main.tsx` mounts `SiteShell`, not `OsBootstrap`
- `src/desktop/` code is scoped to ME.EXE (Phase 2); do not mount it at site root

Active lane: SITE-SHELL
Completed: SITE-SHELL-01 (structure), SITE-SHELL-01B (WebGL2 glass + visual refinement)
Frozen lanes: ME-DESKTOP (Phase 2), CHANNEL-YOU, CHANNEL-THIRD, CONNECT-IMPLEMENTATION

Read `docs/spec/05-implementation-decisions-lock.md` D-20 through D-26 before any implementation.

Continue from the latest milestone or open task.
