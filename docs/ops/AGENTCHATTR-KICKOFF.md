# AgentChatTR Kickoff

This project is a fresh rebuild of the former Terminal-OS codebase.

The active implementation target is this repository only.

The legacy repo is reference-only and must not be treated as the architectural base of the rebuild.

## Read order

All agents must read these files in this order before starting substantial work:

1. `docs/spec/05-implementation-decisions-lock.md`
2. `docs/spec/SOURCE_OF_TRUTH.md`
3. `docs/spec/03-type-contracts.md`
4. `docs/spec/02-runtime-architecture.md`
5. `docs/spec/01-blueprint.md`
6. `docs/spec/04-issues-register.md` (reference only)

## Roles

- Claude — architecture/spec guard
- Codex — implementation
- Gemini — validation

## Working rules

- Only edit this repository
- Do not invent unresolved behaviour
- Flag contradictions instead of guessing
- Make small, reviewable changes
- Preserve strict separation between shell, services, and apps
- Treat the legacy repo as behaviour reference only
- Never copy legacy architecture blindly

## Timeline rule

When a task introduces a meaningful visible UI state or completes a stage-level milestone, Claude should decide whether the timeline must be updated.

If yes, Gemini validates the milestone summary and screenshot choice.

Codex then:
1. captures the screenshot,
2. updates the milestone markdown if needed,
3. updates `docs/timeline/site/timeline.html`,
4. exports a fresh PDF.

Do not update the timeline for tiny invisible refactors unless they materially affect the story of the build.

## Current status

The repo has been re-initialised with:
- spec pack
- root guidance docs
- placeholder shell
- first timeline milestone
- early Playwright/timeline export workflow

## Immediate goal

Establish the runtime skeleton before implementing real apps.