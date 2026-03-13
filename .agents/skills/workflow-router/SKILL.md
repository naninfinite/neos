---
name: workflow-router
description: Use at the start of any non-trivial task to decide which repo skill to load first. Use when the request may involve specs, architecture, implementation, validation, or scoped bug fixing. Do not use for simple factual questions or casual discussion.
---

# Workflow Router

## Purpose

This skill determines the correct workflow for a task before any work begins.

## Trigger Guide

Use when:
- the task is non-trivial
- the request may involve specs, architecture, implementation, validation, or scoped bug fixing

Do not use when:
- the request is a simple factual question
- the request is casual discussion

## Workflow

### Step 1 — Identify the task type

Classify the request into one of these categories:

- Architecture review
- Specification reading
- Implementation
- Validation
- Small scoped change

### Step 2 — Route to the correct skill

Use the following mapping:

- Reading project docs or large specifications → `spec-reader`
- Architecture design or system structure → `architecture-guard`
- Writing or modifying code → `implementation-diff-writer`
- Reviewing or verifying work → `validation-auditor`
- Small bug fix or contained change → `task-scope-lock`

### Step 3 — Produce a short plan

Before continuing, output:
- Task type
- Selected skill
- Reason for selection

## Rules

- Do not start coding immediately.
- Always route through the correct skill first.
- If multiple skills are needed, apply them in this order:
  1. `spec-reader`
  2. `architecture-guard`
  3. `implementation-diff-writer`
  4. `validation-auditor`

## Output

- Task type
- Selected skill
- Reason for selection