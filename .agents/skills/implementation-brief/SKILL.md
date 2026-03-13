---
name: implementation-brief
description: Use after spec-reader and before implementation when a task depends on governing docs and code changes should only begin after the exact target, file scope, non-goals, and validation checks are locked.
---

# Implementation Brief

Use this skill to convert spec-reader output into a short execution contract before any code changes begin.

The goal is to stop implementation from drifting beyond the extracted constraints.

## Trigger Guide

Use this skill when:

- spec-reader has identified governing docs and relevant constraints
- a task is about to move from planning into implementation
- file scope, non-goals, or validation checks need to be made explicit
- multiple valid implementation paths exist and one must be chosen clearly

Do not use this skill when:

- the task is purely architectural and no code should be written yet
- the task is a tiny isolated edit that does not depend on project documentation
- validation is already underway after implementation

## Workflow

1. Read the spec-reader output
2. Restate the implementation target in one clear sentence
3. Lock the safe file scope
4. Restate non-goals and forbidden changes
5. Define the implementation approach
6. Define the validation checks that must pass before the task is considered complete

## Required output structure

### 1. Implementation target
State exactly what is being added, changed, or fixed.

### 2. File scope
List the files that may be changed and note files that must not be changed.

### 3. Non-goals
State what is explicitly out of scope.

### 4. Approach
State the intended implementation path briefly and concretely.

### 5. Validation checks
State how the result will be verified.

## Rules

- Do not begin code changes until this brief is produced.
- Do not expand beyond the locked file scope without reporting scope expansion.
- Do not restate the whole spec; only carry forward task-relevant constraints.
- Keep the brief short, concrete, and implementation-ready.

## Output

- Implementation target
- File scope
- Non-goals
- Approach
- Validation checks