---
name: ui-milestone-capture
description: Use when a UI milestone needs screenshots, asset refresh, timeline image updates, or PDF export after a visible change. Works together with playwright-timeline-guard and timeline-updater.
---

# UI Milestone Capture

## Purpose

Capture meaningful UI states for the timeline and visual documentation system.

This skill is for:

- milestone screenshots
- refreshed timeline images
- before/after visual evidence
- contact-sheet style capture if needed
- PDF refresh after capture

## Dependency rule

Before using this skill, run:

- `playwright-timeline-guard`

If Playwright preflight has not passed, do not continue.

## When this skill must trigger

Use this skill when:

- a visible UI milestone is complete
- the user asks for screenshots
- the timeline needs image updates
- a PDF refresh depends on current UI state
- a new layout/navigation/home/runtime state should be visually documented

## Capture rules

For each meaningful milestone, capture:

- one hero screenshot of the main UI state
- one supporting screenshot if the change needs extra context
- one alternate/mobile/secondary state only if it adds clear value

Do not capture excessive redundant screenshots.

## Asset location rules

Place screenshots under:

- `docs/timeline/assets/<milestone>/`

Examples:
- `docs/timeline/assets/01-stage-1a/`
- `docs/timeline/assets/02-stage-1b/`

Use descriptive filenames:
- `shell-home.png`
- `me-runtime-empty.png`
- `channel-switch-overlay.png`

## Required workflow

1. Confirm Playwright preflight passed
2. Run or verify the app state to capture
3. Capture screenshot(s)
4. Confirm files were written to the expected asset folder
5. Update milestone markdown references if needed
6. Refresh timeline HTML if needed
7. Export PDF if required

## Selection rules

Prefer screenshots that show:

- hierarchy
- arrival feeling
- navigation changes
- layout changes
- meaningful runtime states

Avoid screenshots that:
- look nearly identical to existing ones
- show unfinished broken states unless the milestone is specifically about debugging
- contain clutter that does not help the story

## User-facing reporting

After capture, report:

- what was captured
- where the files were written
- whether the timeline markdown was updated
- whether the PDF was refreshed

If any step failed, say so explicitly.

## Scope discipline

This skill documents visible progress.
It does not decide product direction.
It does not replace the timeline narrative skill.