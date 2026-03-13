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

## Workflow rules

- Make small, reviewable changes
- Update docs if contracts change
- Do not invent unresolved behaviour
- Flag contradictions instead of guessing
- Preserve strict separation between shell, services, and apps
- Treat the legacy repo as behaviour reference only
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