# AgentChatTR Restart Prompt Template

Use this template when starting a fresh chat session so the agents immediately
load the correct project context.

---

Follow the project SOURCE_OF_TRUTH.md.

Agent roles are defined in:

/docs/agents/AGENT_ROLES.md

Authority order:

1. `docs/spec/05-implementation-decisions-lock.md`
2. `docs/spec/SOURCE_OF_TRUTH.md`
3. `docs/spec/03-type-contracts.md`
4. `docs/spec/02-runtime-architecture.md`
5. `docs/spec/01-blueprint.md`
6. `docs/spec/04-issues-register.md` (reference only)

Rules:

- Claude enforces architecture
- Codex writes implementation
- Gemini validates results
- Do not redefine roles unless explicitly instructed
- Before doing any work, read `docs/agents/AGENT_HUB.md` for current project state and staged roadmap
- Use agentchattr #00-orchestration for coordination before implementing

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

Active architecture (as of 2026-03-16):

- Site root = blank canvas after hard reset — rebuilding incrementally via agentchattr
- WebGL2 glass renderer preserved in `src/site/glass/` — not currently mounted, ready for re-integration
- Colour palette: warm neutral (`#f5e6d3 → #c4956a`), warm dark text (`#2d2520`) — no blue (D-26)
- ME.EXE = OS desktop experience (windowing, taskbar, launcher, apps) — isolated channel
- Each channel is isolated; channels do not share state with each other or the site shell
- `src/main.tsx` mounts `SiteShell`, not `OsBootstrap`
- `src/desktop/` code is scoped to ME.EXE (Phase 2); do not mount it at site root

Active lane: SITE-SHELL (rebuilding from blank canvas)
Completed: SITE-SHELL-01 (structure), SITE-SHELL-01B (WebGL2 glass), SITE-SHELL-02 (hard reset)
Deferred lanes: ME-DESKTOP (Phase 2), CHANNEL-YOU, CHANNEL-THIRD
Separate active lane: CONNECT-IMPLEMENTATION (do not let it drive the site-shell / ME.EXE critical path)

Read `docs/agents/AGENT_HUB.md` first for current state and staged roadmap.
Read `docs/spec/05-implementation-decisions-lock.md` D-20 through D-26 before any implementation.

Continue from the staged roadmap in AGENT_HUB.md.
