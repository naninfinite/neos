---
name: task-scope-lock
description: Use for small bug fixes or tightly scoped edits in a large repo where unrelated refactors must be avoided. Do not use for feature design, architecture changes, or broad milestone work.
---

# Task Scope Lock

Use this skill to enforce strict task boundaries during small changes in a large repository.

The goal is to prevent unrelated refactoring and keep modifications tightly scoped.

## Trigger Guide

Use this skill when:

- fixing a bug
- making a small change inside an existing system
- modifying a specific file or function
- applying a narrowly defined implementation brief

Do not use this skill when:

- implementing a new feature or system
- modifying architecture
- performing broad milestone work

## Workflow

1. Identify the exact task.
2. Identify the files relevant to the task.
3. Mark all other files as out-of-scope.
4. Implement only the required change.

## Rules

- Do not refactor unrelated code.
- Do not modify architecture unless explicitly instructed.
- Do not rename modules without clear justification.
- Prefer minimal change sets.
- If additional changes appear necessary, stop and report the scope expansion instead of modifying more files.

## Output

- Files modified  
- Exact change summary  
- Confirmation that scope was respected