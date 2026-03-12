# Connect.EXE — BUILD_SPEC_V1

## 1. Product definition

**Connect.EXE** replaces Tron as the primary game in this slot.

**v1 map:** **The Sun Maze**  
A bright, surreal first-person co-op maze escape game for **2 players**, built around navigation, incomplete information, landmark-based communication, and indirect collaboration.

The goal is simple: **both players escape through the Sun Gate**.

The route to the exit is not immediately available. Players must explore, operate maze systems, share information, and coordinate path unlocks.

---

## 2. Experience goals

The game should feel:

- calm
- exploratory
- puzzle-heavy
- surreal / dreamlike
- slightly jarring
- not horror
- not combat-focused

Tension should come from:
- limited information
- route commitment
- time pressure
- navigation uncertainty
- cooperation across distance

Not from:
- monsters
- jump scares
- combat
- resource survival punishment

---

## 3. Core design pillars

### 3.1 Orientation is gameplay
Understanding the maze is part of the challenge. The UI should support orientation, not solve it.

### 3.2 Connection is constructed
Players build connection through route changes, shared information, and coordinated actions.

### 3.3 The world is surreal, not hostile
The world should feel elegant and strange, not frightening.

### 3.4 Communication matters
Voice is optional. The game must work with pings, map use, landmarks, and simple callouts.

### 3.5 Separation is variable
Players may be separated, reunited, and re-separated depending on map structure. Permanent separation is not a fixed rule.

---

## 4. v1 scope

### In scope
- 2-player co-op
- one full playable map: **The Sun Maze**
- first-person movement
- walk / sprint / jump
- stamina / exertion
- full-screen map
- Bearing Disc
- difficulty modes: easy / medium / hard
- Survey Nodes
- hard-mode Signal Beacons
- ping system
- landmark-based navigation
- 3 puzzle families
- mid-run reunion section: **Convergence Garden (CG)**
- final split and shared exit

### Out of scope
- 3–4 player support
- combat
- monsters / roaming threat
- procedural generation beyond prototype needs
- narrative campaign structure
- multiple biomes in v1
- castle town map in v1
- advanced inventory systems
- complex UI overlays
- advanced emotes / social systems
- map drawing / annotation tools
- matchmaking/platform voice implementation if not already available

---

## 5. Movement spec

### 5.1 Player actions
- walk
- sprint
- jump
- interact
- open / close map
- ping

### 5.2 Movement feel
Movement should feel:
- responsive
- modern
- slightly weighty
- not floaty
- not hyper-arcade

### 5.3 Stamina / exertion
Walking does not consume stamina.

Stamina is consumed by:
- sprinting
- jumping
- repeated jump-spam / bunny hopping

### 5.4 Jump rule
Jump is included by default.

Reason:
- no-jump would feel wrong in a modern first-person game
- players expect some traversal expression
- bunny hopping can exist, but must trade against stamina

### 5.5 Bunny hopping rule
Bunny hopping is allowed, but repeated jumping increases stamina drain enough that it is not free optimal movement.

Recommended behaviour:
- first jump: low stamina cost
- repeated jumps in quick succession: escalating cost
- sprint + repeated jump chain: strongest exertion drain
- low stamina reduces sustained speed advantage from bunny hopping

### 5.6 Low stamina behaviour
At low stamina:
- sprint is limited or disabled
- jump remains possible if feasible, but should feel more costly
- movement remains functional
- no hard immobilisation

### 5.7 Exhausted jump rule
Players may still jump at zero stamina.

However, exhausted jumping is intentionally inefficient:
- repeated jumps incur heavy exertion cost
- exhausted jump chains should not provide meaningful traversal advantage
- sprint remains limited by stamina even when jump is still available

This preserves expected first-person movement language while preventing bunny hopping from becoming free optimisation.

---

## 6. HUD and camera spec

### 6.1 Default HUD
Minimal to near-none.

Preferred on-move information:
- subtle compass / heading support
- stamina only when relevant or low

### 6.1.1 Bearing Disc
Connect.EXE includes a minimal always-on heading aid called the **Bearing Disc**.

The Bearing Disc is:
- a small circular compass-style disc
- limited to cardinal directions and player facing direction
- a heading aid only, not a minimap

The Bearing Disc does **not** show:
- maze layout
- walls or path geometry
- puzzle state
- reveal state
- exit route
- full partner position by default

Its purpose is to support basic heading awareness while preserving the full-screen map as the primary strategic navigation tool.

### 6.2 No minimap
There is no standard minimap during normal play.

### 6.3 Full-screen map
Opening the map takes over the screen.

v1 rule:
- opening the map freezes active traversal for that player
- movement, sprint, jump, and interaction are disabled while the map is open
- the freeze is local to that player only
- opening the map does not pause the room timer or other players

This preserves Connect.EXE's core navigation tradeoff:
players must choose between moving and orienting.

---

## 7. Map system spec

### 7.1 Easy
- map mostly filled from start
- both players always visible
- route clarity high
- designed as onboarding difficulty

### 7.2 Medium
- fog of war
- map fills as players explore
- explored areas remain revealed
- Survey Nodes reveal larger areas
- players visible when in revealed space

### 7.3 Hard
- map black except for live radius around player
- explored space fades back out
- Signal Beacons permanently reveal local zones
- Survey Nodes permanently reveal larger sectors
- partner visible only in actively revealed space
- pings provide temporary position trace
- faint last-known marker persists until updated

---

## 8. Navigation systems

### 8.1 Landmarks
v1 landmark set:
- Red Arch
- Dry Fountain
- White Tower
- Survey Court
- Convergence Garden (CG)
- Sun Gate

Every key district must be easy to name in one or two words.

### 8.2 Survey Nodes
Survey Nodes are authored reorientation points.

Activating a Survey Node:
- permanently reveals a larger region of map
- helps re-establish route clarity
- refreshes partner trace / last-known data
- grants **+1 Signal Beacon on hard**
- may surface nearby landmark labels

### 8.3 Signal Beacons
Hard-mode navigation resource.

Rules:
- each player starts with **3**
- max carry **5**
- place at current location
- remain for whole run
- cannot be picked back up in v1
- permanently reveal medium local map zone
- glow in-world as visible landmarks
- benefit both players

---

## 9. Communication systems

### 9.1 Core principle
The game must be playable without voice.

### 9.2 v1 communication tools
- ping
- compass / direction understanding
- landmark callouts
- optional short quick-callouts

### 9.3 Ping behaviour
Ping should:
- place a temporary marker
- provide brief directional cue
- show on map
- last roughly 8–12 seconds
- have a cooldown around 10 seconds

### 9.4 Quick-callouts
Optional v1 set:
- Meet here
- Gate open
- Need help
- Wrong route
- Exit path

---

## 10. Puzzle grammar

v1 should use only three puzzle families.

### 10.1 Remote route control
**I change your path from my side.**

Example:
- Red Arch Relay opens remote gate

### 10.2 Timed / paired activation
**We must coordinate actions across distance.**

Example:
- Twin Signal activation at finale

### 10.3 Uneven information
**I can see or understand something you need.**

Example:
- White Tower Overlook guidance section

No other major puzzle families should be added in v1.

---

## 11. Multiplayer structure

### 11.1 Room model
Connect.EXE v1 is a **2-player co-op** experience.

The room supports:
- one host
- one second player
- shared run state
- shared timer
- shared puzzle progression
- shared win/fail outcome

### 11.2 Networking authority
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

Clients keep local movement and camera responsiveness, but shared-state actions are submitted to the host for validation and broadcast.

Host migration is out of scope for v1. If the host disconnects, the current run ends and players return to room/lobby state.

### 11.3 Local responsiveness vs shared truth
For feel and responsiveness, each client keeps immediate local control of:
- camera look
- local movement feel
- local jump feel
- local map-open UI
- local interaction prompt visibility
- local Bearing Disc rendering

Shared-state truth remains host-authoritative.

---

## 12. Sun Maze v1 topology

This map should use:

**separation → mid-run reunion → final split → shared escape**

That structure is now locked for this map.

### Topology arc
1. Players spawn apart
2. Early remote route influence begins
3. Mid-maze orientation stabilises
4. One player guides the other from White Tower
5. Routes reconnect
6. Players physically reunite at **Convergence Garden (CG)**
7. Short shared traversal section
8. Final split into paired threshold routes
9. Twin Signal activation
10. Sun Gate opens
11. Shared escape

---

## 13. Sun Maze district flow

### A. Entry Gardens
- quiet onboarding
- light branching
- first local landmark visibility

### B. Red Arch Relay
- first authored co-op beat
- remote gate opening

### C. Dry Fountain / early transition
- broader landmark-led navigation
- movement toward Survey Court

### D. Survey Court
- first major reorientation point
- Survey Node placement

### E. White Tower Overlook
- asymmetric information set-piece
- guidance puzzle

### F. Mid-maze route unlock
- payoff to White Tower guidance
- routes reconnect

### G. Convergence Garden (CG)
- players physically meet
- brief shared relief and shared navigation

### H. Threshold Paths A/B
- final split
- more ceremonial, less maze-dense

### I. Twin Signal Court
- paired activation climax

### J. Sun Gate
- opened final exit
- both players cross to win

---

## 14. Authored v1 puzzle scenarios

### 14.1 Red Arch Relay
Player A activates a relay at Red Arch.  
Player B’s blocked gate opens remotely.

Purpose:
- teach interconnectedness
- teach landmark callouts
- teach remote route control

### 14.2 White Tower Overlook
One player reaches White Tower and sees the correct route or route logic for the other player below.

Purpose:
- teach asymmetric information
- make communication meaningful
- reinforce landmark-based guidance

### 14.3 Twin Signal
Each player reaches a separate final activation point and both must activate within a short window.

Purpose:
- final cooperative climax
- open the Sun Gate
- create satisfying shared success

---

## 15. Time pressure

### 15.1 v1 principle
Pressure should come from time, not fear.

### 15.2 v1 implementation
Use a clear run timer.

Suggested targets:
- Easy: **10 minutes**
- Medium: **20 minutes**
- Hard: **45 minutes**

Later polish can add stronger environmental pressure language, but v1 can use straightforward timer-based failure.

### 15.3 Failure condition
If time expires before both players escape, the run fails.

No death-based fail state is required for v1.

---

## 16. Mode definitions

### Easy
- mostly filled map
- partner always visible
- most readable layout behaviour
- forgiving timer
- best learning mode

### Medium
- fog of war
- explored space persists
- Survey Nodes matter more
- partner visible in revealed space
- default intended play mode

### Hard
- live-radius map only
- explored space fades
- Signal Beacons required for persistent knowledge
- stronger reliance on Survey Nodes, pings, landmarks
- highest navigation commitment

---

## 17. Prototype build priorities

### Must-have
- 2-player support
- host-authoritative room prototype
- first-person controller
- walk / sprint / jump
- stamina with extra jump/bunny-hop cost
- interaction system
- full-screen map
- Bearing Disc
- easy map mode
- landmark placement
- Red Arch Relay
- White Tower Overlook
- Convergence Garden (CG)
- Twin Signal finale
- Sun Gate win state
- timer fail state
- basic ping

### Should-have
- medium fog-of-war map
- hard map behaviour
- Signal Beacons
- Survey Nodes with reveal logic
- last-known partner marker
- quick-callouts
- stronger audio feedback
- stronger district visual differentiation

### Cut-for-now
- 3+ player support
- voice dependency
- monsters
- combat
- advanced procedural system
- second biome
- castle town map
- complex loot / inventory
- skill trees / upgrades
- narrative dialogue systems
- advanced social features

---

## 18. Acceptance criteria

The prototype is successful if all of the following are true:

### 18.1 Core structure
- two players can complete a full run from separate spawn to shared escape
- the Sun Maze follows the locked topology:
  separation → CG reunion → final split → shared escape

### 18.2 Navigation
- opening the map meaningfully interrupts movement/orientation flow
- the Bearing Disc helps heading awareness without acting like a minimap
- landmarks are memorable enough to support callouts
- players do not rely on a true minimap

### 18.3 Co-op identity
- Red Arch Relay makes players feel interconnected
- White Tower Overlook makes communication useful
- Twin Signal creates a clear endgame coordination moment
- CG reunion feels like meaningful payoff

### 18.4 Movement
- movement feels responsive and intentional
- jump feels natural to players
- bunny hopping exists but meaningfully drains stamina and is not free optimisation
- zero-stamina jumping remains possible but not advantageous as movement tech

### 18.5 Multiplayer authority
- shared-state transitions are stable under the host-authoritative prototype
- timer, gate state, and puzzle state do not drift between clients
- host disconnect ends the run cleanly and predictably

### 18.6 Difficulty identity
- easy is readable and welcoming
- medium feels like exploration with growing certainty
- hard feels like active cartography rather than arbitrary restriction

### 18.7 Overall feeling
Playtesters should be able to say:
- “I understood enough to keep moving”
- “Helping the other player mattered”
- “The map mechanic made me think”
- “Meeting at CG felt good”
- “The final gate opening felt earned”
- “This feels like its own game, not just a maze”

---

## 19. Forward path after v1
After the Sun Maze vertical slice is proven, next design expansion options are:

- refine medium/hard navigation systems
- add more authored maze modules
- deepen beacon / Survey Node balance
- improve communication systems
- prototype the **Red Brick Castle Town / Drawbridge Escape** map as the more cooperative counterpart to Sun Maze
