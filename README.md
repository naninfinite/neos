# NEOS

A fresh rebuild of the browser-based operating system / portfolio project.

## Status

Pre-implementation shell scaffold.

This repository is the new source of truth for code. It is a clean rebuild and must not inherit legacy architecture by default.

## Project mode

- Fresh rebuild
- Spec-driven
- Contract-first
- Legacy repo is reference-only

## Specification

Authoritative project documentation lives in:

`docs/spec/`

Read in this order:

1. `05-implementation-decisions-lock.md`
2. `SOURCE_OF_TRUTH.md`
3. `03-type-contracts.md`
4. `02-runtime-architecture.md`
5. `01-blueprint.md`
6. `04-issues-register.md` (reference only)

## Purpose

NEOS is a browser-based operating system environment that functions as a creative portfolio and interactive software world.

The project aims to be:
- futuristic
- cyberpunk
- user-friendly
- extensible
- architecturally clean

## Legacy reference

The previous Terminal-OS codebase may be inspected for:
- feature behaviour
- app intent
- content structure
- prior UX flows

It must not be used as the architectural base of this rebuild.

## Agent roles

- Claude — architecture/spec guard
- Codex — implementation
- Gemini — validation

## Development rules

- small, reviewable changes
- no guessing when specs are unresolved
- preserve separation between shell, services, and apps
- update docs when contracts change

## Current goal

Establish the shell/runtime scaffold before implementing apps.