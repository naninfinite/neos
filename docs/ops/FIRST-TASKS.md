# First Tasks

> **Note (2026-03-16):** These were the original kickoff tasks. T-01 is partially complete (scaffold exists). For the current staged roadmap, see `docs/agents/AGENT_HUB.md`.

## T-01 — Runtime skeleton (partially complete)

### Goal

Create the initial runtime-shaped scaffold in `src/` so the repo matches the type contracts and runtime architecture at a high level.

### Status

Partially complete. Folder structure exists (`src/site/`, `src/desktop/`, `src/windowing/`, `src/core/`, `src/services/`, `src/ui/`, `src/apps/`). Site shell surface was reset to blank canvas on 2026-03-16. Further scaffold work is now tracked in AGENT_HUB.md Lane 1 (site shell) and Lane 2 (ME.EXE integration).

### Authority docs

- `docs/spec/05-implementation-decisions-lock.md`
- `docs/spec/SOURCE_OF_TRUTH.md`
- `docs/spec/03-type-contracts.md`
- `docs/spec/02-runtime-architecture.md`

### Timeline impact

No timeline update required unless visible UI changes.

---

## T-02 — Playwright workflow fix

### Goal

Make the Playwright visual workflow deterministic so visual checks and timeline capture are reliable.

### Scope

- fix port consistency
- fix webServer config
- ensure `npm run test:visual` works without manual preview boot
- ensure capture script uses the same fixed URL or documented flow

### Deliverables

- corrected `playwright.config.ts`
- corrected `package.json` scripts if needed
- working visual test
- plain-English root cause summary

### Validation

- `npm run build`
- `npm run test:visual`

### Timeline impact

No timeline update required.

---

## T-03 — Timeline publishing harden

### Goal

Ensure timeline HTML and PDF export are stable and easy to update.

### Scope

- verify `timeline.html`
- verify PDF export
- confirm assets render correctly in export
- keep it simple and manual for now

### Validation

- `npm run timeline:pdf`
- PDF output appears in `docs/timeline/exports/`