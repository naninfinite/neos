# Connect.EXE — OPEN_QUESTIONS

## Purpose

This document tracks implementation-facing decisions that are intentionally **not yet locked**.

Its job is to stop agents and contributors from silently inventing policy during build-out.
If a question is listed here, it should be treated as unresolved until the user explicitly
locks it or a governing document supersedes this file.

---

## Status rules

### Locked
A decision is final and should be followed.

### Proposed
A direction is recommended, but not final.

### Open
A decision is unresolved and must not be assumed.

---

## 1. Networking authority model

**Status:** Locked

### Locked decision
Connect.EXE v1 uses a **host-authoritative** room model for the 2-player prototype.

The host is authoritative for:
- room phase
- timer
- puzzle state
- gate state
- Survey Node state
- Signal Beacon placement
- progression checks
- Sun Gate state
- win/fail outcome

Clients keep local movement/camera responsiveness but submit shared-state actions to the host for validation and broadcast.

Host migration is out of scope for v1. If the host disconnects, the run ends and players return to room/lobby state.

---

## 2. Networking transport / backend choice

**Status:** Open

### Question
What concrete networking stack should the browser-based prototype use?

### Options
- WebSocket-based custom room layer
- managed realtime backend
- peer-assisted approach
- existing project multiplayer infra if one already exists

### Current recommendation
**Proposed:** Choose the simplest path that supports:
- 2 players
- transform sync
- puzzle state sync
- timer sync
- clean room reset

Do not overbuild general-purpose networking before Sun Maze v1 works.

---

## 3. Scene state/store choice

**Status:** Locked

### Locked decision
Connect.EXE uses a **split state model**.

Terminal-OS retains responsibility for:
- app/window lifecycle
- launch/close
- window focus/minimise/maximise
- outer app-shell concerns

Connect.EXE owns its live gameplay/session state in a dedicated runtime store.

That runtime store is the authoritative local representation of:
- room/session state
- player runtime state
- puzzle/world state
- map/reveal state
- run progression state

Scene components should read from and dispatch to this store rather than embedding core game truth in scattered component-local state.

---

## 4. Map rendering technique

**Status:** Open

### Question
How should the full-screen map actually be rendered?

### Options
- **Orthographic derived map**
  - render level geometry into top-down map space
- **Authored 2D overlay**
  - hand-authored map panels per district
- **Data-projected map**
  - build map from district graph / maze metadata
- **Hybrid**
  - authored base + runtime reveal overlays

### Current recommendation
**Proposed:** Prefer a hybrid leaning toward data-projected or derived geometry,
so reveal systems can remain systemic.

### Why it matters
The map is one of the defining mechanics of the game. This choice affects:
- reveal logic
- landmark registration
- difficulty modes
- beacon rendering
- performance
- implementation complexity

---

## 5. Map-open movement rule

**Status:** Locked

### Locked decision
Opening the full-screen map freezes active traversal for that player in v1.

While the map is open:
- movement is disabled
- sprint is disabled
- jump is disabled
- interaction is disabled

This freeze is local to that player only. It does not pause the room timer or other players.

---

## 5A. Bearing Disc

**Status:** Locked

### Decision
Connect.EXE includes a minimal always-on heading aid called the **Bearing Disc**.

The Bearing Disc:
- shows cardinal directions
- shows player facing direction
- is a heading aid only

The Bearing Disc does **not** show:
- maze layout
- walls or path geometry
- puzzle state
- reveal state
- exit route
- full partner position by default

### Rationale
This supports basic heading awareness without undermining the full-screen map as the primary strategic navigation tool.

---

## 6. Timer presentation

**Status:** Open

### Question
How visible should the run timer be during play?

### Options
- always visible numeric timer
- visible only on map screen
- minimal environmental timer cues with occasional explicit reminders
- mode-dependent presentation

### Current recommendation
**Proposed:**
- Easy: more explicit timer
- Medium: visible but subdued
- Hard: possibly de-emphasised in the future

For v1, a clear timer across all modes is acceptable if needed for usability.

---

## 7. Medium mode beacon usage

**Status:** Open

### Question
Should Medium mode eventually gain limited Signal Beacon usage, or should beacons
remain a Hard-only navigation identity?

### Options
- Hard only
- Medium gets reduced count later
- Medium gets a different lighter reveal aid instead

### Current recommendation
**Proposed:** Keep beacons Hard-only in first implementation pass.

### Rationale
This preserves strong mode identity:
- Easy = guided
- Medium = explored fog-of-war
- Hard = active cartography

---

## 8. Jump at zero stamina

**Status:** Locked

### Locked decision
Players may still jump at zero stamina.

However, exhausted jumping is intentionally inefficient:
- repeated jumps incur heavy exertion cost
- exhausted jump chains should not provide meaningful traversal advantage
- sprint remains stamina-limited even when jump remains available

This preserves expected first-person movement language without enabling free zero-stamina movement tech.

---

## 9. Bunny-hop tuning envelope

**Status:** Open

### Question
How permissive should bunny-hopping be in practice?

### Options
- mostly cosmetic / small expressive movement
- moderate skill expression with clear stamina cost
- highly permissive movement tech

### Current recommendation
**Proposed:** Moderate skill expression with escalating stamina cost.

### Rationale
Jumping should feel natural, but Connect.EXE should not become movement-tech dominant.

---

## 10. Interaction prompt style

**Status:** Open

### Question
How visible should object interaction prompts be?

### Options
- diegetic / minimal prompt only when close
- subtle reticle + interact hint
- stronger standard game prompt for clarity

### Current recommendation
**Proposed:** Subtle reticle + minimal interact hint in v1.

### Rationale
The game wants low HUD clutter, but puzzle readability matters.

---

## 11. Survey Node feedback intensity

**Status:** Open

### Question
How dramatic should Survey Node activation feel?

### Options
- minimal functional UI/map change
- moderate audiovisual event
- large ceremonial district-wide feedback

### Current recommendation
**Proposed:** Moderate audiovisual event in v1.

Enough to feel important, not so large that it slows pace or feels over-produced.

---

## 12. Partner trace / last-known marker behaviour

**Status:** Open

### Question
How persistent and trustworthy should the last-known partner marker be?

### Options
- faint and persistent until updated
- timed fade-out
- difficulty-dependent
- only visible on map

### Current recommendation
**Proposed:** Faint, map-only, persistent until updated.

### Rationale
This reduces frustration without giving full omniscience.

---

## 13. Landmark registration pipeline

**Status:** Open

### Question
How are landmarks defined and surfaced to systems?

### Options
- authored per level file
- manually registered scene objects
- metadata-driven landmark registry
- hybrid

### Current recommendation
**Proposed:** Metadata-driven registry with authored placement.

This should support:
- map labels
- callout consistency
- tower guidance references
- future analytics/debugging

---

## 14. Greybox-to-final environment strategy

**Status:** Open

### Question
Should Sun Maze remain mostly greybox during the first playable vertical slice, or
should some hero landmarks receive early art treatment?

### Options
- all greybox first
- greybox everything except hero landmarks
- parallel art + gameplay pass

### Current recommendation
**Proposed:** Greybox first, but allow limited treatment for hero landmarks:
- Red Arch
- Dry Fountain
- White Tower
- CG
- Sun Gate

### Rationale
These landmarks carry gameplay clarity as well as atmosphere.

---

## 15. Convergence Garden (CG) duration

**Status:** Open

### Question
How long should the shared mid-run reunion section last?

### Options
- very short emotional beat only
- short shared traversal segment
- longer co-op district before final split

### Current recommendation
**Proposed:** Short shared traversal segment in v1.

### Rationale
Enough to create payoff and contrast, not enough to dilute Sun Maze's separation-first identity.

---

## 16. White Tower guidance fidelity

**Status:** Open

### Question
How exact should tower-based guidance be?

### Options
- broad landmark guidance only
- near-exact route visibility from above
- mixed: exact in Easy, more interpretive in higher modes

### Current recommendation
**Proposed:** Mixed by difficulty.
- Easy: more exact
- Medium: clear but interpretive
- Hard: still fair, but more reliant on landmark language

---

## 17. Puzzle reset policy

**Status:** Open

### Question
When a puzzle attempt fails, how should reset behaviour work?

### Options
- immediate reset
- short delay with feedback
- manual reset interaction
- puzzle-specific rules

### Current recommendation
**Proposed:** Short automatic reset with visible feedback in v1.

### Rationale
Fast iteration matters more than elaborate failure theatrics.

---

## 18. Room restart / rerun flow

**Status:** Open

### Question
What should happen after a win or timer fail?

### Options
- instant restart
- post-run summary then restart
- return to lobby/app layer
- vote/ready-up flow

### Current recommendation
**Proposed:** Simple restart / rerun flow with minimal friction in v1.

The post-run UX should be clean, not overdesigned.

---

## 19. Accessibility and communication fallback

**Status:** Open

### Question
What minimum non-voice communication features are required for the first playable build?

### Options
- ping only
- ping + quick-callouts
- ping + quick-callouts + simple text
- richer communication wheel later

### Current recommendation
**Proposed:** Minimum target is ping + a very small set of quick-callouts.

### Rationale
The game must not depend on voice chat.

---

## 20. Success threshold for expanding the project

**Status:** Open

### Question
What has to be true before Connect.EXE expands beyond Sun Maze into more maps or systems?

### Suggested gate
Expansion should wait until playtests confirm:
- the full-screen map is genuinely interesting
- co-op communication feels meaningful
- CG reunion lands emotionally
- final split + Sun Gate work reliably
- hard mode feels thoughtful, not punishing
- the prototype feels like a distinct game, not a gimmick

---

## 21. Immediate next decisions to lock

These are the highest-value unresolved items:

1. networking/backend choice
2. map rendering technique
3. timer presentation
4. medium-mode beacon usage
5. interaction prompt style
6. Survey Node feedback intensity
7. minimum non-voice communication feature set

---

## 22. Usage rule for agents

If you are an agent or contributor working on Connect.EXE:

- do not silently decide items listed as **Open**
- you may implement around them only if your solution is reversible
- if a decision must be made to proceed, surface it explicitly
- prefer the current **Proposed** direction only as a temporary working assumption
- update this document or the governing docs when a decision becomes **Locked**
