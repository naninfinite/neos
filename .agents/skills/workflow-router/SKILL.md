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
- Timeline / visual documentation

### Step 2 — Route to the correct skill

Use the following mapping:

- Reading project docs or large specifications → `spec-reader`
- Architecture design or system structure → `architecture-guard`
- Writing or modifying code → `implementation-diff-writer`
- Reviewing or verifying work → `validation-auditor`
- Small bug fix or contained change → `task-scope-lock`
- Timeline/screenshots/PDF/visual-doc updates → `playwright-timeline-guard` then `timeline-updater` then `ui-milestone-capture` (if images/PDF are involved)

### Step 3 — Check for timeline obligation

After identifying the task type, check whether the task produces a visible UI change or completes a named milestone.

If yes, the following skills are **mandatory** after implementation and validation are complete:

1. `playwright-timeline-guard` — run Playwright preflight, confirm it passes
2. `ui-milestone-capture` — take screenshots and store in correct asset folder
3. `timeline-updater` — write or update the milestone markdown and TIMELINE.md, update timeline HTML, and refresh the PDF export

These three skills are not optional. If the task changes visible UI or closes a milestone, the timeline must be updated before the task is considered done.

If Playwright is not available, stop and inform the user. Do not silently skip timeline steps.

### Step 4 — Produce a short plan

Before continuing, output:
- Task type
- Selected skill(s)
- Whether a timeline update is required
- Reason for selection

## Rules

- Do not start coding immediately.
- Always route through the correct skill first.
- If multiple skills are needed, apply them in this order:
  1. `spec-reader`
  2. `architecture-guard`
  3. `implementation-diff-writer`
  4. `validation-auditor`
- For timeline/visual documentation work, apply:
  1. `playwright-timeline-guard`
  2. `timeline-updater`
  3. `ui-milestone-capture` (when screenshots/assets/PDF are requested)
  4. `validation-auditor`
  5. `playwright-timeline-guard` (if visible UI change or milestone)
  6. `ui-milestone-capture` (if visual capture needed)
  7. `timeline-updater` (if milestone-worthy change)

## Output

- Task type
- Selected skill
- Reason for selection
