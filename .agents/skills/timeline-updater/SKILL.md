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
- `02-shell-01a-desktop-frame.md`
- `03-stage-1b-runtime-bootstrap.md`

**Never edit a completed milestone file to remove or replace its content.** Past milestones are a permanent record. If a stage has been superseded by a rewrite, write a new milestone file for the new work and note the transition — do not overwrite the old one.

## Asset history rules — CRITICAL

- Existing files under `docs/timeline/assets/` are historical records.
- Never overwrite an existing screenshot file with a newer UI state.
- For new captures, use a new filename or a new milestone folder.
- If a previous screenshot needs correction, keep the old file and add a corrected sibling file (for example `shell-home-corrected.png`) with an explanation in milestone notes.

## HTML progression rules — CRITICAL

When updating `docs/timeline/site/timeline.html`:

- **Always append new milestone articles** — never replace existing ones
- The HTML document is a chronological timeline; older milestones must remain visible above newer ones
- Each milestone gets its own `<article class="milestone">` block
- Do not remove or replace existing `<article>`, `<figure>`, or `<img>` elements from previous milestones
- Update only the hero `<p class="muted">` line to reflect the latest milestone name
- Update the Timeline Map `<ol>` to include the new milestone in the correct position

The full progression from start to present must always be visible in the rendered document.

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

For every milestone update, all of the following are required — not optional:

1. Milestone markdown written or updated in `docs/timeline/milestones/`
2. `docs/timeline/TIMELINE.md` updated with a summary line linking to the milestone file
3. `docs/timeline/site/timeline.html` updated to include the new milestone entry and images
4. Screenshots confirmed present in `docs/timeline/assets/<milestone>/`
5. `docs/timeline/exports/neos-timeline.pdf` regenerated from the updated HTML

Do not consider a timeline update complete until all five items above are done.

If the PDF regeneration step is blocked (e.g. Playwright not available), stop and tell the user explicitly. Do not silently skip it.

## Scope discipline

This skill updates timeline narrative.
It does not redesign the UI.
It does not choose architecture.
It records what was actually built.
