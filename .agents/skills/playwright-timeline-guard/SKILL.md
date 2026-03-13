---
name: playwright-timeline-guard
description: Use for any task that changes visible UI, requires screenshots, visual regression checks, timeline updates, or PDF export. This skill must run a Playwright preflight first and must explicitly inform the user if Playwright is not installed or not runnable on the current device before continuing.
---

# Playwright Timeline Guard

## When this skill must trigger

Use this skill whenever a task involves any of the following:

- visible UI changes
- screenshots
- visual regression checks
- timeline updates
- PDF export
- Playwright commands
- preview/capture/export scripts
- milestone screenshot refresh
- “update the visual doc”
- “export the PDF”
- “capture the UI”

This skill is mandatory before running screenshot, timeline, or PDF-related work.

## Core rule

Do not assume Playwright exists.

On a new device, fresh clone, or changed environment, always run the preflight below first.

If Playwright is missing, broken, or browsers are not installed, stop and explicitly tell the user before doing any more work.

Do not silently skip screenshots.
Do not pretend timeline/PDF steps succeeded.
Do not continue as if visual capture is optional when the task clearly requires it.

## Preflight checklist

Run these checks in order:

1. Confirm package metadata exists
   - `test -f package.json`

2. Confirm Playwright package is installed in the repo
   - `npm ls @playwright/test --depth=0`

3. Confirm Playwright CLI is runnable
   - `npx playwright --version`

4. Confirm browser binary availability
   - if needed, run:
     - `npx playwright install chromium`

5. Confirm project config exists if visual workflow is expected
   - `test -f playwright.config.ts || test -f playwright.config.js`

6. Confirm expected visual scripts exist if timeline workflow is expected
   - inspect `package.json` for:
     - `test:visual`
     - `timeline:capture:*`
     - `timeline:pdf`

## Required behaviour if preflight fails

If any preflight step fails:

- stop the visual/timeline/PDF task
- tell the user exactly what is missing
- tell the user whether the missing piece is:
  - package dependency missing
  - browser binary missing
  - config missing
  - npm script missing
- give the exact command(s) needed to fix it
- wait for the user or for a separate install/setup task

Never claim screenshots, visual checks, or PDF export were completed if preflight failed.

## Required user-facing message format

Use this shape:

### Playwright preflight failed
Missing:
- ...

Why this matters:
- ...

Fix:
```bash
...