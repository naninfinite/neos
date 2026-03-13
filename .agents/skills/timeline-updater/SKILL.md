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

## Editorial judgement rule

For each milestone, decide whether the change would be easier to understand with:

- screenshots only
- screenshots plus one short code snippet
- screenshots plus two short code snippets if one does not explain the change clearly enough

Use code snippets when:

- the implementation introduced an important new structure
- the visible change depends on a small but meaningful piece of code
- the code helps explain how the product evolved

Avoid including code if the milestone can be explained clearly without it.

When code is included:

- prefer short excerpts rather than large blocks
- copy real code from the repository
- include only the lines necessary to explain the change

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
- refresh the exported PDF after timeline content or screenshots change

## Screenshot judgement rule

Screenshots should not be captured mechanically.

For each milestone, select the minimum number of screenshots that clearly explain the visible change.

Typical capture set:

- one hero screenshot showing the primary UI state
- one supporting screenshot if interaction or layout change needs clarification
- optionally one overlay/mobile/alternate state if it adds meaningful context

Avoid redundant captures or near-identical images.

Screenshot assets should live under:

docs/timeline/assets/<milestone>/

## Scope discipline

This skill updates timeline narrative.
It does not redesign the UI.
It does not choose architecture.
It records what was actually built.