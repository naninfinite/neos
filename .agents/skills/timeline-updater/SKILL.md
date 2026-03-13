---
name: timeline-updater
description: Use when a task results in a meaningful visible UI change, stage completion, or milestone-worthy update. Updates the human-readable project timeline, chooses the correct milestone file, and writes plain-English explanations for non-technical readers.
---

# Timeline Updater

## Purpose

Maintain the NEOS timeline as a readable development chronicle for both technical and non-technical readers.

The timeline is not just a changelog.
It explains:

- what changed
- why it changed
- why it matters
- what the UI looked like
- what a non-coder should understand from the step

## Trigger conditions

Use this skill when any of the following happens:

- a stage begins
- a stage completes
- a visible UI change materially affects the product
- a subsystem becomes meaningfully functional
- a major navigation/layout/interaction change is approved
- screenshots or PDF need refreshing after a milestone-worthy change

Do not use for tiny invisible refactors unless they materially affect the story of the build.

## Inputs to gather

Before updating the timeline, gather:

- task name / milestone ID
- what changed
- why it changed
- which files or surfaces were affected
- which screenshot(s) best show the change
- one short code snippet only if it helps explain the step

## Required writing style

Write for a non-technical reader.

Use:
- plain English
- short sections
- concrete explanations
- minimal jargon
- one or two code snippets maximum

Avoid:
- large code dumps
- implementation trivia
- unexplained abbreviations
- pretending small changes are major milestones

## Milestone file rules

Update or create the correct file under:

- `docs/timeline/milestones/`

Use the existing stage naming pattern where possible.

Examples:
- `01-stage-1a-shell-scaffold.md`
- `02-stage-1b-runtime-bootstrap.md`

## Required sections for a milestone file

Each milestone file should include:

1. Title
2. What we were trying to do
3. What changed
4. Why this matters
5. In plain English
6. What the UI looked like
7. Important code
8. Code explained simply
9. Notes

## Timeline overview rules

If a new milestone is added, update:

- `docs/timeline/TIMELINE.md`

Add a short summary line with a link to the milestone file.

## Publishing rules

If the visual change is meaningful:

- ensure the milestone references the correct screenshot assets
- ensure timeline HTML is updated if needed
- ensure PDF export is refreshed if requested or part of the workflow

## Scope discipline

This skill updates timeline narrative.
It does not redesign the UI.
It does not choose architecture.
It records what was actually built.