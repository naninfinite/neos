# Connect.EXE — SOURCE_OF_TRUTH

## 1. Purpose

This file defines document precedence for the Connect.EXE subproject inside Terminal-OS.

Its purpose is to:
- identify the authoritative docs
- stop agent drift
- define which document wins when two documents appear to conflict
- keep implementation aligned with the currently locked product/design/technical direction

---

## 2. Scope

This Source of Truth applies to:
- Connect.EXE only
- the browser-based Terminal-OS implementation path
- the current v1 focus on **The Sun Maze**

It does not govern:
- unrelated Terminal-OS apps
- Connect.EXE future maps unless explicitly added
- native/non-browser ports unless documented separately

---

## 3. Document precedence

When documents conflict, use this order:

1. **SOURCE_OF_TRUTH.md**
2. **BUILD_SPEC_V1.md**
3. **TECH_ARCHITECTURE.md**
4. **RUNTIME_STATE_MODEL.md**
5. **LEVEL_TOPOLOGY_SUN_MAZE.md**
6. **IMPLEMENTATION_PLAN_V1.md**
7. **OPEN_QUESTIONS.md**

### Interpretation rule
- higher document wins over lower document
- `OPEN_QUESTIONS.md` does not override a locked decision in a higher document
- if a decision is not locked above, `OPEN_QUESTIONS.md` may define whether it is still unresolved

---

## 4. Current v1 objective

The current goal is to ship a **browser-based 2-player greybox vertical slice** of **The Sun Maze** that proves:

- first-person co-op movement
- full-screen map as a meaningful navigation mechanic
- landmark-based communication
- remote route control
- asymmetric information
- mid-run reunion at **Convergence Garden (CG)**
- final split before **Twin Signal**
- shared escape through the **Sun Gate**

---

## 5. Current locked direction

### Product
- Connect.EXE replaces Tron as the main game in this slot
- v1 is scoped to **The Sun Maze**
- Red Brick Castle Town / Drawbridge Escape remains a future map direction

### Multiplayer
- v1 is **2-player only**
- room model is **host-authoritative**
- host migration is out of scope for v1
- host disconnect ends the current run and returns players to room/lobby state

### State architecture
- Terminal-OS owns app/window lifecycle
- Connect.EXE owns a dedicated runtime/gameplay store
- scene components do not own canonical game truth

### Navigation
- there is **no true minimap**
- the full-screen map is the primary strategic navigation tool
- opening the map freezes traversal for that player
- the freeze is local, not room-wide
- Connect.EXE includes a minimal always-on **Bearing Disc**
- the Bearing Disc is a heading aid only, not a map

### Movement
- movement includes walk / sprint / jump
- jump remains available at zero stamina
- exhausted jumping is heavily penalised
- bunny hopping may exist, but it must not become free traversal optimisation

### Map topology
- Sun Maze uses:
  **separation → mid-run reunion → final split → shared escape**
- Convergence Garden (CG) is the locked name for the reunion section

---

## 6. Authoritative document roles

### BUILD_SPEC_V1.md
Owns:
- product definition
- player-facing rules
- core systems
- scope boundaries
- acceptance criteria

### TECH_ARCHITECTURE.md
Owns:
- stack direction
- app/runtime boundaries
- scene composition
- host authority boundaries
- map/input architecture

### RUNTIME_STATE_MODEL.md
Owns:
- canonical gameplay/runtime state model
- room phase/state fields
- player/world/map/progression state categories

### LEVEL_TOPOLOGY_SUN_MAZE.md
Owns:
- Sun Maze district sequence
- landmarks
- puzzle placement logic
- reunion/finale topology

### IMPLEMENTATION_PLAN_V1.md
Owns:
- milestone sequence
- greybox build order
- cut lines
- task sequencing

### OPEN_QUESTIONS.md
Owns:
- unresolved implementation questions only
- must not be used to override locked decisions above

---

## 7. Agent behaviour rules

If you are implementing Connect.EXE:

- do not invent policy that conflicts with locked docs
- treat `OPEN_QUESTIONS.md` as unresolved, not permission to improvise silently
- prefer reversible implementation where decisions are still open
- keep Sun Maze authored-first; do not overbuild procedural systems early
- do not expand scope to extra maps, modes, or player counts unless explicitly directed

---

## 8. Current immediate build phase

The project is currently at the transition from spec lock to implementation.

The current implementation focus should be:

1. runtime shell
2. dedicated runtime store
3. first-person controller
4. map input context
5. host-authoritative shared-state path
6. early greybox route and first puzzle flow

---

## 9. Revision note

If future conversations lock more implementation-facing details, update:
- the relevant governing document first
- then this index if precedence or major locked direction changes
