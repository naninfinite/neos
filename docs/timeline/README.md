# Timeline Documentation

This folder contains the human-readable visual history of the NEOS rebuild.

## Purpose

The timeline is designed to explain the project’s progress in a way that both technical and non-technical readers can follow.

It should answer:

- what changed
- why it changed
- why it matters
- how to explain it in plain English
- what the UI looked like at the time

## Audience

This documentation is for:
- the project author
- future collaborators
- validators and reviewers
- non-technical readers who want to understand the journey

## Structure

- `TIMELINE.md` is the top-level chronological overview
- `milestones/` contains one markdown file per major stage or milestone
- `assets/` contains screenshots and contact sheets grouped by milestone

## Writing rules

Each milestone should be readable by someone with no coding background.

Use:
- short explanations
- plain English
- only small code snippets
- direct statements about what changed

Avoid:
- large unexplained code dumps
- too much jargon
- documenting tiny invisible refactors unless they matter

## Update triggers

Update the timeline when:
- a stage begins
- a stage completes
- a visible UI change is introduced
- a subsystem becomes functional
- a major design decision materially changes the product

## Historical integrity rule

Timeline assets are append-only.

- Never overwrite or delete existing screenshots in `assets/`
- Add new screenshots with new names for new UI states
- If a milestone is superseded, create a new milestone entry instead of rewriting the old one
- Keep earlier milestone images visible so progression remains readable

## Milestone format

Each milestone file should include:
- title
- what we were trying to do
- what changed
- why it matters
- plain-English explanation
- screenshots
- one or two important code snippets
- a simple explanation of those snippets

## Relationship to the spec

The timeline is a narrative record.

It is not the implementation source of truth.

The source of truth remains in `docs/spec/`.
