---
name: implementation-diff-writer
description: Use when writing or modifying code from an approved specification or implementation brief. Focus on minimal, safe changes aligned with project specifications.
---

# Implementation Diff Writer

Use this skill when implementing code changes that follow an existing specification or implementation brief.

The goal is to produce **small, targeted modifications** that respect the repository structure and architecture.

## Trigger Guide

Use this skill when:

- implementing a feature from a specification
- modifying code according to an implementation brief
- applying changes after a spec-reader workflow
- performing controlled edits within a defined file scope

Do not use this skill when:

- designing architecture
- validating completed implementations
- reviewing system design decisions

## Workflow

1. Read the relevant specification or implementation brief
2. Identify the exact files requiring modification
3. Implement the smallest change required
4. Avoid unnecessary refactoring
5. Preserve existing architecture and structure

## Rules

- Do not change unrelated code.
- Prefer small commits and minimal diffs.
- Maintain existing code style and project conventions.
- Follow repository naming and structural patterns.

## Output

1. Files changed  
2. Code changes  
3. Short explanation  
4. Verification steps