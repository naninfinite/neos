---
name: validation-auditor
description: Use after implementation to verify that code, behaviour, and changed files match the governing specification. Do not use as the primary coding skill.
---

# Validation Auditor

Use this skill to perform independent verification of implementation work.

The goal is to ensure that code changes comply with the governing specifications and architectural constraints.

## Trigger Guide

Use this skill when:

- a feature has just been implemented
- multiple agents produced outputs
- architecture compliance must be verified
- a milestone is being reviewed

Do not use this skill when:

- writing implementation code
- designing architecture
- performing small scoped edits

## Workflow

1. Identify the governing specification documents
2. Identify the files that were changed
3. Compare implementation behaviour against specification requirements
4. Detect mismatches or missing behaviour
5. Report validation results

## Rules

- Do not assume the implementation is correct.
- Validate behaviour as well as structure.
- Flag architectural violations immediately.
- Report discrepancies clearly.

## Timeline gate

After completing validation, check whether the milestone involved a visible UI change or stage completion.

If yes:
- Confirm that `playwright-timeline-guard` has been run and passed
- Confirm that screenshots were captured and placed in `docs/timeline/assets/<milestone>/`
- Confirm that the milestone markdown was written or updated in `docs/timeline/milestones/`
- Confirm that `docs/timeline/TIMELINE.md` was updated
- Confirm that `docs/timeline/site/timeline.html` was updated
- Confirm that `docs/timeline/exports/neos-timeline.pdf` was regenerated

If any of these are missing, flag it explicitly. Do not sign off on milestone completion until the timeline is current.

## Output

1. Implementation summary
2. Spec requirements
3. Compliance check
4. Issues found
5. Suggested corrections
6. Timeline gate status (complete / missing — list what is outstanding)