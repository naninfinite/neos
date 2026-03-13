---
name: architecture-guard
description: Use when reviewing architecture, checking system boundaries, or verifying that a proposed change complies with SOURCE_OF_TRUTH.md and structural decisions.
---

# Architecture Guard

Use this skill when evaluating architectural integrity or verifying that implementations respect system design.

The goal is to prevent structural drift and protect the long-term architecture of the project.

## Trigger Guide

Use this skill when:

- reviewing architectural decisions
- evaluating structural code changes
- verifying compliance with SOURCE_OF_TRUTH.md
- checking module responsibilities and boundaries

Do not use this skill when:

- performing routine implementation work
- making small bug fixes within existing architecture

## Workflow

1. Load SOURCE_OF_TRUTH.md
2. Identify relevant architecture sections
3. Compare proposed implementation against architectural constraints
4. Detect violations or architectural drift
5. Recommend corrections if necessary

## Rules

- Do not rewrite working architecture without justification.
- Reject implementations that violate system constraints.
- Prefer minimal structural change.
- Protect long-term system design.

## Output

- Pass / Fail assessment  
- Explanation of architectural compliance  
- Suggested corrections