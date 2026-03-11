# First Tasks

## T-01 — Runtime skeleton

### Goal

Create the initial runtime-shaped scaffold in `src/` so the repo matches the type contracts and runtime architecture at a high level.

### Scope

- create placeholder files/folders for shell structure
- preserve the existing placeholder UI
- do not implement real apps yet
- no visual polish
- no legacy imports

### Authority docs

- `docs/spec/05-implementation-decisions-lock.md`
- `docs/spec/SOURCE_OF_TRUTH.md`
- `docs/spec/03-type-contracts.md`
- `docs/spec/02-runtime-architecture.md`

### Deliverables

- folder/file scaffold aligned to contracts
- minimal placeholder modules where appropriate
- clean imports
- no speculative app behaviour

### Validation

- app still runs
- typecheck/build still passes
- Gemini confirms no contradiction with spec

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