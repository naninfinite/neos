# 00 - Master Index

## Purpose

This folder is the final spec pack for the Terminal-OS v2 rewrite. It is designed for a spec-driven AgentChatTR workflow.

Use this pack to keep product direction, runtime architecture, implementation contracts, and pre-build decisions separate but coordinated.

## Recommended read order

1. `SOURCE_OF_TRUTH.md`
2. `05-implementation-decisions-lock.md`
3. `03-type-contracts.md`
4. `02-runtime-architecture.md`
5. `01-blueprint.md`
6. `04-issues-register.md`

## What each file is for

### `SOURCE_OF_TRUTH.md`
Authority map for the entire project.

Use it to answer:
- what this project is
- which documents are authoritative
- which phase the project is in
- which decisions are locked
- what is in scope and out of scope

### `01-blueprint.md`
Product, UX, information architecture, and overall design direction.

### `02-runtime-architecture.md`
Shell architecture, subsystem boundaries, and runtime responsibilities.

### `03-type-contracts.md`
Folder structure, interfaces, store shapes, manifest patterns, and API contracts.

### `04-issues-register.md`
Historical reconciliation record showing the contradictions and omissions found during pre-build review.

This is reference material, not the final authority.

### `05-implementation-decisions-lock.md`
Locked resolutions that Codex should treat as settled before implementation.

## AgentChatTR role mapping

- **Claude**: architecture/spec guard
- **Codex**: implementation
- **Gemini**: validator / QA / consistency checker

## Working title note

The documents use **Terminal-OS v2** as the working title.

The project name is **not locked**. A future rename is allowed without changing the architectural meaning of this pack.

## Build readiness

This pack is ready for implementation **provided AgentChatTR follows `SOURCE_OF_TRUTH.md` first** and does not improvise around unresolved or superseded behaviour.

## Suggested repo structure

```text
repo/
  docs/
    spec/
      00-master-index.md
      SOURCE_OF_TRUTH.md
      01-blueprint.md
      02-runtime-architecture.md
      03-type-contracts.md
      04-issues-register.md
      05-implementation-decisions-lock.md
```
