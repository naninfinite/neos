---
name: spec-reader
description: Use when a task depends on SOURCE_OF_TRUTH.md, build specs, runtime architecture, ADRs, or other governing docs. Do not use for small isolated edits that do not depend on project documentation.
---

# Spec Reader

Use this skill whenever work depends on one or more project documents.

The goal is to stop agents from skimming, guessing, or coding from partial memory.

## When to use

Use this skill when:

- a task references SOURCE_OF_TRUTH.md
- a task depends on architecture docs, build specs, runtime docs, ADRs, or implementation locks
- a restart prompt says “follow the spec” or “continue from the governing docs”
- coding should only happen after rules and constraints are extracted
- multiple docs may conflict and authority order matters

Do not use this skill for small isolated edits that do not depend on project documentation.

## Core behaviour

Before proposing code, plans, or validation:

1. Identify the governing documents for the task
2. Read them in authority order
3. Extract only the constraints relevant to the current task
4. Turn those constraints into a short implementation brief
5. Name any ambiguity or conflict
6. Proceed only within those constraints

## Authority-first reading order

Unless the repository says otherwise, use this order:

1. SOURCE_OF_TRUTH.md
2. Implementation Decisions / locked decisions
3. Architecture / runtime / build spec docs
4. Feature-specific specs
5. ADRs / supporting notes
6. Local code patterns

If the repository defines a different authority order, follow the repository.

## Required output structure

When this skill is used, produce the following before coding:

### 1. Governing docs
List the docs that control the task.

### 2. Relevant constraints
List the rules that matter for this task only.

### 3. Non-goals
State what must not be changed.

### 4. Implementation target
State exactly what should be added, edited, or validated.

### 5. Safe file scope
List the files that should change, and note files that should not.

### 6. Validation checks
State how the result should be checked against the spec.

## Rules

- Do not summarise the whole repo when only one feature is relevant.
- Do not invent architecture that is not present in the docs.
- Do not let local code patterns override governing specs.
- If docs conflict, surface the conflict explicitly and follow authority order.
- Prefer extracting concrete constraints over writing broad commentary.
- Keep the implementation brief short, precise, and actionable.

## Output
- Governing docs
- Relevant constraints 
- Non-goals 
- File scope 
- Validation checks.

## Good result example

A good result from this skill should feel like:

- “Here are the controlling docs”
- “Here are the 5 constraints that matter”
- “Here is the exact scope”
- “Here is what must not change”
- “Now implementation can proceed safely”

## Anti-patterns

Avoid:

- vague “I reviewed the docs” statements
- coding directly from memory after a restart
- using only one spec when the task obviously spans several
- broad refactors not demanded by the governing documents