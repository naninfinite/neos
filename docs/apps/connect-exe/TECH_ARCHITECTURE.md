# Connect.EXE — TECH_ARCHITECTURE

## 1. Purpose

This document defines the technical architecture for the first playable browser-based
prototype of Connect.EXE inside Terminal-OS.

It is scoped to:
- React 18
- TypeScript
- Vite
- three.js
- react-three-fiber (R3F)
- a 2-player host-authoritative prototype
- one authored vertical slice: **The Sun Maze**

This document focuses on architecture boundaries, runtime ownership, scene composition,
map systems, multiplayer truth, and implementation constraints.

---

## 2. Stack direction

### Locked stack direction
- **React 18**
- **TypeScript**
- **Vite**
- **three.js**
- **react-three-fiber**
- **@react-three/drei** where useful
- dedicated Connect runtime store
- Terminal-OS app/window shell outside the game runtime

### Principles
- keep scene/render logic separate from gameplay state truth
- avoid heavy physics unless proven necessary
- prefer authored geometry and simple collision over complex simulation
- keep multiplayer/state authority explicit from the start

---

## 3. Top-level architecture boundary

Connect.EXE exists as a mounted app surface inside Terminal-OS.

### Terminal-OS owns
- app registration
- launch/close lifecycle
- window state
- outer shell UI
- app metadata
- outer routing into Connect.EXE

### Connect.EXE owns
- 3D scene lifecycle
- room/session state
- player runtime state
- puzzle/world state
- map/reveal state
- timer/progression state
- run reset/restart state

The key boundary is:

**Terminal-OS launches Connect.EXE, but Connect.EXE runs itself once mounted.**

---

## 4. Runtime state architecture

### Split state model
Connect.EXE uses a **split state model**.

#### Terminal-OS shell state
The broader Terminal-OS app shell remains responsible for:
- app launch/close
- window lifecycle
- focus/minimise/maximise
- app metadata
- outer routing into Connect.EXE

#### Connect.EXE runtime state
Connect.EXE owns its live gameplay/session state in a dedicated runtime store.

This runtime store is the authoritative local representation of:
- room/session state
- player runtime state
- puzzle/world state
- map/reveal state
- run progression state

Scene components should read from and dispatch to this store rather than embedding core game truth in scattered component-local state.

### Suggested runtime slices
- `room`
- `players`
- `world`
- `map`
- `progression`
- `ui`

This may be implemented in one store with clear slice boundaries rather than many disconnected stores.

---

## 5. Scene composition

### Core scene layers
The scene should be composed into separable layers:

1. **World geometry layer**
   - district geometry
   - pathing spaces
   - visual landmarks
   - gates / route blockers

2. **Interaction layer**
   - relay plinths
   - Survey Nodes
   - Twin Signal activators
   - trigger zones

3. **Player layer**
   - local player controller
   - remote player representation

4. **Navigation layer**
   - landmark registry hooks
   - map metadata anchors
   - beacon markers
   - district identifiers

5. **Presentation layer**
   - lighting
   - atmosphere
   - audio emitters
   - low-HUD UI hooks

### Greybox-first rule
World geometry should begin as authored greybox blocks with landmark readability solved before atmospheric polish.

---

## 6. Scene graph responsibilities

### Scene components should own
- visual representation
- local animation cues
- collision volumes if attached to geometry
- trigger hooks
- render-time interpolation/presentation

### Scene components should not own
- room truth
- canonical timer state
- canonical puzzle state
- authoritative gate state
- authoritative win/fail state

Scene components consume runtime state and dispatch actions; they do not invent game truth.

---

## 7. Networking authority model (v1)

Connect.EXE uses a **host-authoritative** room model for the first playable 2-player prototype.

### Host-authoritative domain
The host is the source of truth for:
- room phase
- countdown timer
- difficulty
- puzzle state transitions
- gate/relay state
- Survey Node activation state
- Signal Beacon placement acceptance
- progression unlock checks
- Twin Signal success/failure
- Sun Gate open state
- win/fail state
- restart/rerun state

### Client-local domain
Each client remains locally responsive for:
- camera look
- local movement feel
- local jump feel
- local map-open UI
- local interaction prompt visibility
- local Bearing Disc rendering

### Client-to-host messages
Clients submit:
- transform updates
- interaction attempts
- ping events
- ready/restart requests

### Host-to-client broadcasts
The host broadcasts:
- accepted shared-state changes
- timer updates
- gate/puzzle transitions
- Survey Node state changes
- beacon acceptance
- win/fail transitions

### Host disconnect rule
Host migration is out of scope for v1. If the host disconnects, the run ends and clients return to room/lobby state.

---

## 8. Multiplayer sync boundaries

### Must sync for v1
- player transforms
- room phase
- timer
- gate state
- relay state
- Survey Node state
- beacon placement/state
- Twin Signal activation state
- Sun Gate state
- win/fail
- restart/rerun

### May remain largely local
- look smoothing
- camera bob / visual movement polish
- prompt fade timing
- local UI transitions
- local audio polish

### Principle
Anything that can affect route truth, puzzle truth, or match outcome must be synchronised through the host-authoritative path.

---

## 9. Player input and navigation UI

### Bearing Disc
Connect.EXE includes a minimal always-on heading aid called the **Bearing Disc**.

The Bearing Disc is a local UI/navigation component that:
- renders player facing direction
- renders cardinal direction reference
- does not render maze layout
- does not expose reveal-state data as a map
- does not replace the full-screen map

It should be implemented as a lightweight local view component driven by player heading and UI state, not as a second map system.

### Local player controls
- walk
- sprint
- jump
- interact
- open/close map
- ping

### Input-context principle
Traversal and map-reading are separate input contexts.

---

## 10. Map architecture

### Design role
The full-screen map is one of the defining mechanics of Connect.EXE.

It must remain:
- strategic
- readable
- difficulty-aware
- tightly connected to reveal systems

### Rendering technique
The exact map rendering technique remains open, but the architecture should support:
- reveal-state overlays
- landmark labels
- player markers
- beacon markers
- Survey Node reveal updates
- difficulty-specific visibility rules

### Preferred implementation direction
Prefer a hybrid or data-driven map representation that allows reveal logic to remain systemic rather than purely hand-painted.

### Required map data hooks
- district identity
- player location mapping
- landmark positions
- reveal regions / sectors
- Survey Node reveal targets
- beacon reveal zones

---

## 11. Map-open input context

Opening the full-screen map switches the player from traversal input into map-reading input.

v1 rule:
- map-open freezes active traversal for that player
- movement, sprint, jump, and interaction are disabled
- room time continues
- other players continue normally

This is a local input-context switch, not a room pause.

---

## 12. Movement/controller architecture

### Controller requirements
The first-person controller should support:
- walk
- sprint
- jump
- basic grounded/airborne state
- stamina/exertion feedback hooks

### Movement philosophy
- responsive
- slightly weighty
- not hyper-arcade
- not floaty
- supports standard FPS expectations

### Exhausted jump rule
Jump remains available at zero stamina.

Implementation must ensure:
- repeated jumps incur escalating exertion cost
- exhausted jumping does not provide meaningful traversal advantage
- sprint remains stamina-limited even if jump still functions

This keeps the controller feeling normal without allowing zero-stamina movement exploitation.

---

## 13. Puzzle/world architecture

### Puzzle grammar for v1
- remote route control
- timed/paired activation
- uneven information

### Required world-state objects
- Red Arch Relay
- remote gate
- Survey Node(s)
- White Tower guidance route state
- Convergence Garden unlock
- Twin Signal activators
- Sun Gate final state

### Principle
Puzzle logic should be data-driven enough to support:
- locked/unlocked
- active/inactive
- success/failure
- reset
- host-authoritative transition

without embedding all logic directly in scene components.

---

## 14. Landmark architecture

Landmarks are gameplay-relevant objects, not merely decorative set dressing.

### Landmark responsibilities
- support verbal/text callouts
- support map labelling
- support navigation memory
- support White Tower guidance references
- support district readability

### Examples for v1
- Red Arch
- Dry Fountain
- White Tower
- Survey Court
- Convergence Garden
- Sun Gate

### Recommendation
Use authored landmark placement with metadata-driven registration.

---

## 15. Difficulty architecture

The route spine remains the same across difficulties.  
What changes is navigation certainty and reveal behaviour.

### Easy
- map mostly filled
- partner always visible
- lowest navigation ambiguity

### Medium
- fog-of-war
- revealed space persists
- partner visible in revealed space

### Hard
- live-radius reveal only by default
- explored space fades
- Signal Beacons establish persistent knowledge
- partner visibility depends on revealed state and trace rules

This means difficulty should primarily modulate map/reveal systems, not require distinct scene graphs.

---

## 16. Signal Beacon architecture

Signal Beacons are hard-mode navigation objects.

### Requirements
- player places beacon at current location
- host validates placement
- beacon becomes shared world object
- beacon reveals a persistent local map region
- beacon appears in-world and on map
- beacon remains until run end

### Architectural note
Beacon placement must be driven by shared-state acceptance, not just a local visual spawn.

---

## 17. Survey Node architecture

Survey Nodes are authored progression/reorientation objects.

### Requirements
- interaction trigger
- activation state
- reveal-region update
- possible beacon refill on hard
- possible partner trace refresh
- strong but not excessive feedback

Survey Node state is shared and should be host-authoritative.

---

## 18. Room progression model

The architecture should support these broad phases:
- idle / not in room
- lobby / room readying
- in-run
- win
- fail
- restart / rerun transition

Exact field names live in the runtime model, but the technical architecture should assume explicit room phases from the start.

---

## 19. Performance / implementation discipline

### Keep v1 simple
- avoid heavy physics stacks unless collision requirements prove otherwise
- avoid overgeneralising procedural systems
- prefer authored greybox data and straightforward collision
- keep network payloads lean
- avoid duplicating gameplay truth in both scene and UI trees

### Rendering priorities
- stable traversal
- readable landmarks
- map clarity
- clear shared-state transitions

Not:
- extreme material complexity
- expensive visual effects
- broad systemic generation too early

---

## 20. Immediate architecture focus

The next build-facing architecture priorities are:

1. runtime shell mount in Terminal-OS
2. dedicated Connect runtime store
3. room phase model
4. first-person controller
5. host-authoritative shared-state path
6. map context switch
7. first greybox world
8. Red Arch Relay
9. White Tower guidance flow
10. Convergence Garden + finale

This order should be preserved unless a major technical blocker appears.
