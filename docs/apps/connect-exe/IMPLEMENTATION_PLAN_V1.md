# Connect.EXE — IMPLEMENTATION_PLAN_V1

## 1. Purpose

This document translates the current Connect.EXE design/spec set into a practical
implementation sequence for the first playable browser-based vertical slice.

It is intentionally scoped to **v1 / Sun Maze only**.

This is not a long-term roadmap for every future map, mode, or system. It is the
build order for proving the core game.

---

## 2. Build objective

Ship a **greybox-playable 2-player vertical slice** of **The Sun Maze** that proves:

- first-person co-op movement feels correct
- full-screen map is a meaningful navigation mechanic
- landmark-based communication works
- remote-route puzzle logic works
- asymmetric-information puzzle logic works
- players can reunite at **Convergence Garden (CG)**
- players can split again for the finale
- **Twin Signal** and **Sun Gate** create a satisfying shared escape

---

## 3. Implementation principles

### 3.1 Greybox first
Build for readability and flow before atmosphere and polish.

### 3.2 One map, one route spine
Do not overgeneralise for future maps until Sun Maze proves the model.

### 3.3 Author first, modular second
Treat Sun Maze v1 as an authored vertical slice, while keeping data structures
clean enough for later modularisation.

### 3.4 Solve runtime clarity early
Room state, puzzle state, and map reveal state must be explicit before polish work.

### 3.5 Cut aggressively
If a system does not materially improve the Sun Maze vertical slice, cut or defer it.

---

## 4. Recommended repo placement

```text
docs/
  apps/
    connect-exe/
      SOURCE_OF_TRUTH.md
      BUILD_SPEC_V1.md
      TECH_ARCHITECTURE.md
      RUNTIME_STATE_MODEL.md
      LEVEL_TOPOLOGY_SUN_MAZE.md
      IMPLEMENTATION_PLAN_V1.md
      OPEN_QUESTIONS.md
```

---

## 5. Milestone structure

This plan uses six main milestones.

1. **M0 — Runtime foundation**
2. **M1 — Navigation and movement shell**
3. **M2 — Core puzzle path**
4. **M3 — Reunion and finale**
5. **M4 — Difficulty systems**
6. **M5 — Playtest and stabilisation**

Each milestone should end in a testable state.

---

## 6. Milestone details

## M0 — Runtime foundation

### Goal
Create the minimal app/runtime structure that allows Connect.EXE to exist as a
scene-backed multiplayer game surface inside Terminal-OS.

### Must deliver
- Connect.EXE app shell mounted in the existing app/window system
- scene bootstrap (React + R3F + three.js)
- runtime store skeleton
- room phase model wired
- placeholder local player + remote player entities
- timer scaffolding
- interaction scaffolding
- greybox test scene

### Notes
No maze complexity yet. No real puzzles yet. This milestone is about proving that
the app can host the game cleanly.

### Done when
- Connect.EXE opens and runs in-browser
- local player can spawn into a 3D scene
- remote player placeholder is represented
- room phase changes can be simulated
- timer updates without breaking scene state

---

## M1 — Navigation and movement shell

### Goal
Prove that movement, map use, and landmark readability already feel like the game.

### Must deliver
- first-person controller
- walk / sprint / jump
- exertion / stamina model
- repeated-jump stamina penalty
- map open / close behaviour
- easy-mode map visibility
- compass / heading support
- landmark markers and simple landmark registry
- first greybox district chain:
  - Entry Garden
  - Red Arch district
  - Dry Fountain / Survey approach

### Important tuning questions
- jump feel
- sprint speed vs ordinary walk speed
- stamina recovery rate
- map readability at full-screen
- whether opening map freezes movement fully or nearly fully

### Done when
- testers can move comfortably
- jumping feels natural
- bunny hopping exists but is not free optimisation
- full-screen map creates a real orientation decision
- players can call out at least two landmarks successfully

---

## M2 — Core puzzle path

### Goal
Make the first real Connect.EXE loop playable.

### Must deliver
- **Red Arch Relay**
- remote gate open event
- gate state sync
- Survey Node v1 behaviour
- first route dependency between players
- **White Tower Overlook**
- one guided route cluster below tower
- simple ping system
- partner trace / last-known marker minimum viable version

### Notes
This is the milestone where the game stops being “FPS movement in a maze shell”
and becomes Connect.EXE.

### Done when
- Player A can trigger Red Arch Relay and Player B receives progress
- White Tower guidance is understandable in live co-op
- pings help orientation
- Survey Node reveal has visible gameplay value

---

## M3 — Reunion and finale

### Goal
Complete the full run arc.

### Must deliver
- mid-maze route unlock after White Tower section
- **Convergence Garden (CG)** reunion area
- one short shared traversal section
- final split into threshold paths
- **Twin Signal** paired activation
- **Sun Gate** open event
- win state for both players escaping
- fail state on timer expiry

### Notes
This milestone proves the map topology:
separation → reunion → final split → shared escape.

### Done when
- both players can complete a full run end-to-end
- CG feels like a meaningful reunion beat
- Twin Signal is readable
- Sun Gate payoff feels earned

---

## M4 — Difficulty systems

### Goal
Layer in mode identity without breaking the proven route.

### Must deliver
- Easy mode complete
- Medium fog-of-war reveal behaviour
- Hard live-radius reveal behaviour
- Signal Beacon placement and persistence
- Survey Node beacon replenishment on hard
- partner visibility rules per difficulty
- difficulty-specific timer values

### Notes
Do not start here. Only begin once Easy/full-run flow already works.

### Done when
- each mode has a distinct navigation feel
- hard mode feels like active cartography rather than arbitrary restriction
- beacons are strategically useful, not spammy

---

## M5 — Playtest and stabilisation

### Goal
Move from “technically complete” to “cohesive and defensible”.

### Must deliver
- collision cleanup
- stuck-state reduction
- puzzle reset reliability
- reconnect / restart / rerun flow
- map readability tuning
- stamina tuning
- audio feedback pass
- clearer landmark readability
- basic telemetry or debug counters if feasible

### Done when
- 2-player runs can be repeated without major desync or softlock
- players understand the route without external explanation
- navigation frustration feels intentional, not broken

---

## 7. Greybox build order

The level should be greyboxed in this order:

1. **Entry Garden A / B**
2. **Red Arch district**
3. **North Hedge Gate / B progress route**
4. **Dry Fountain approach**
5. **Survey Court**
6. **White Tower**
7. **Route cluster below White Tower**
8. **Mid-maze route unlock**
9. **Convergence Garden (CG)**
10. **Shared traversal segment**
11. **Threshold Path A / B**
12. **Twin Signal Court**
13. **Sun Gate**

This order mirrors risk: prove early identity first, then route arc, then finale.

---

## 8. System dependency order

Build systems in this order:

1. Scene/app bootstrap
2. Runtime store
3. First-person movement
4. Interaction system
5. Map open/close
6. Landmark registry
7. Basic multiplayer transform sync
8. Gate/relay puzzle state
9. Survey Node state
10. Ping / partner trace
11. Reunion routing
12. Twin Signal timing logic
13. Difficulty-specific map reveal
14. Signal Beacons
15. Polish / feedback / tuning

Avoid building late-stage difficulty systems before early puzzle flow works.

---

## 9. Agent task breakdown

Recommended multi-agent split for your workflow.

### Claude / architecture guard
Owns:
- architecture review
- authority boundaries
- runtime model validation
- cut-line enforcement
- doc consistency against SOURCE_OF_TRUTH

### Codex / implementation
Owns:
- scene setup
- store wiring
- controller implementation
- puzzle scripting
- map logic
- milestone-by-milestone code delivery

### Gemini / validator / coordinator
Owns:
- milestone QA
- spec-to-implementation validation
- identifying ambiguity or drift
- checking that the user-facing play loop still matches docs

---

## 10. Suggested milestone branch strategy

This is optional, but recommended.

### Example branch sequence
- `feat/connect-runtime-shell`
- `feat/connect-movement-map-shell`
- `feat/connect-red-arch-white-tower`
- `feat/connect-cg-finale`
- `feat/connect-difficulty-systems`
- `fix/connect-playtest-stabilisation`

If the repo prefers task IDs, pair each with internal identifiers later.

---

## 11. Recommended commit philosophy

- small, reviewable commits
- one meaningful subsystem at a time
- docs updated with implementation changes
- avoid giant “connect.exe initial pass” commits
- keep greybox/polish commits separate where possible

### Good commit examples
- `feat(connect): scaffold runtime shell and room phase store`
- `feat(connect): add first-person movement with sprint jump and exertion`
- `feat(connect): implement Red Arch Relay and remote gate sync`
- `feat(connect): add White Tower guidance route cluster`
- `feat(connect): add Convergence Garden reunion flow`
- `feat(connect): implement Twin Signal and Sun Gate win state`
- `feat(connect): add medium and hard reveal modes`
- `fix(connect): prevent puzzle reset desync on rerun`

---

## 12. Cut lines

If scope pressure appears, cut in this order.

### First cuts
- advanced quick-callouts
- high-fidelity map styling
- second Survey Node
- extra environmental state changes
- stronger ambience system
- advanced audio pass

### Second cuts
- hard-mode beacon replenishment nuance
- last-known marker polish
- more than one route-cluster variant
- deeper ping types

### Do not cut
- full-screen map
- Red Arch Relay
- White Tower Overlook
- CG reunion
- Twin Signal
- Sun Gate shared escape
- jump + stamina relationship
- 2-player support

These define the game.

---

## 13. Risks and mitigations

### Risk 1 — overbuilding procedural systems too early
**Mitigation:** keep Sun Maze authored and greyboxed first.

### Risk 2 — map becomes harder to read than intended
**Mitigation:** solve landmark readability and map rendering early in M1.

### Risk 3 — multiplayer state drift breaks puzzles
**Mitigation:** centralise puzzle authority and state transitions before adding more puzzle types.

### Risk 4 — movement feels stiff or wrong
**Mitigation:** tune sprint/jump/exertion in M1 before content scaling.

### Risk 5 — CG reunion feels trivial or too short
**Mitigation:** ensure CG includes a distinct emotional and spatial shift, not just a corridor crossing.

### Risk 6 — hard mode feels punitive instead of thoughtful
**Mitigation:** only layer hard mode after easy/full-run flow is already satisfying.

---

## 14. Acceptance gates by milestone

### Gate A — after M1
Players should already say:
- “movement feels good”
- “the map is interesting”
- “I can remember where I’ve been”

### Gate B — after M2
Players should say:
- “my actions affect the other player in a meaningful way”
- “the tower guidance actually matters”
- “we had to communicate”

### Gate C — after M3
Players should say:
- “meeting at CG felt good”
- “the final split made sense”
- “the exit felt earned”

### Gate D — after M4
Players should say:
- “easy, medium, and hard actually feel different”
- “hard makes me think, not just suffer”

### Gate E — after M5
Players should be able to finish repeated runs without major bugs or confusion-driven abandonment.

---

## 15. Immediate next action

The next implementation-facing step after this plan should be:

1. confirm repo doc placement
2. create Connect.EXE doc folder if not already present
3. add this file to docs
4. draft or refine `OPEN_QUESTIONS.md`
5. begin **M0 — Runtime foundation**

---

## 16. Open questions that should remain explicit

These should be tracked in `OPEN_QUESTIONS.md`, not silently invented during coding.

- exact networking authority model (host-authoritative vs server-authoritative room logic)
- exact scene/store library decision if not yet locked
- map rendering technique (orthographic derived map, authored overlay, or data-projected render)
- final timer presentation style
- whether map-open freezes movement fully or nearly fully
- whether medium gets limited beacon use later
- whether jump is always available at zero stamina or merely heavily penalised

---

## 17. Definition of success

This plan succeeds if, by the end of M5, Connect.EXE has a vertical slice that is:

- structurally complete
- technically stable enough to test repeatedly
- recognisably different from a generic maze game
- strong enough to justify further investment in additional maps and systems

The correct question after M5 is:

**“Do we want more Connect.EXE?”**

If the answer is clearly yes, the vertical slice has done its job.
