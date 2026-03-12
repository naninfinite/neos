# Connect.EXE — LEVEL_TOPOLOGY_SUN_MAZE

## Purpose
This document defines the **Sun Maze** level topology for the Connect.EXE v1 vertical slice. It converts the locked concept into a greybox-ready spatial and progression layout.

This is not a final art document. It is the authored structure for:
- district order
- landmark rhythm
- puzzle placement
- player separation/reunion flow
- threshold/finale logic

---

## 1. Topology identity

**The Sun Maze** is a bright surreal hedge labyrinth under a clean, slightly uncanny blue sky. It uses elegant garden architecture, pale stone structures, mirrored surfaces, dry channels, and strong landmark silhouettes.

The topology identity is locked as:

**separation → indirect help → central orientation → White Tower guidance → route unlock → Convergence Garden reunion → short shared traversal → final split → Twin Signal → Sun Gate → shared escape**

This map should feel:
- calm
- readable
- surreal
- quietly urgent
- not horror

---

## 2. Landmark set

The v1 landmark set is:
- **Red Arch**
- **Dry Fountain**
- **White Tower**
- **Survey Court**
- **Convergence Garden (CG)**
- **Sun Gate**

These landmarks must be strong enough to support text, ping, and voice callouts.

---

## 3. High-level district flow

Recommended district order:

1. **Entry Garden A**
2. **Entry Garden B**
3. **Red Arch Relay**
4. **North Hedge Gate / Dry Fountain Approach**
5. **Survey Court Central**
6. **White Tower Approach**
7. **White Tower Overlook**
8. **Mid-Maze Route Cluster / Unlock**
9. **Convergence Garden (CG)**
10. **Shared Traversal Spur**
11. **Threshold Path A**
12. **Threshold Path B**
13. **Twin Signal Court**
14. **Sun Gate Escape Path**

The level should feel authored rather than like one giant undifferentiated maze.

---

## 4. Node-map view

```text
PLAYER A SIDE                                      PLAYER B SIDE

[A1] Entry Garden A                               [B1] Entry Garden B
   |                                                  |
   |                                                  |
[A2] Red Arch Relay --------------------opens------> [B2] North Hedge Gate
   |                                                  |
   |                                                  |
[A3] Survey Approach A                            [B3] Dry Fountain Approach
   |                                                  |
   |____________________ central progression _________|
                          |
                          |
                    [C1] Survey Court Central
                          |
                          |
                    [C2] White Tower Approach
                          |
                    [C3] White Tower Overlook
                          |
                    [C4] Mid-Maze Route Unlock
                          |
                    [C5] Convergence Garden (CG)
                          |
                    [C6] Shared Traversal Spur
                       /                    \
                      /                      \
            [D1] Threshold Path A      [D2] Threshold Path B
                      \                      /
                       \                    /
                    [E1] Twin Signal Court
                          |
                    [E2] Sun Gate Opens
                          |
                    [E3] Shared Escape
```

---

## 5. District-by-district specification

## 5.1 Entry Garden A

### Purpose
- teach initial movement/map rhythm
- establish first landmark visibility
- funnel Player A toward Red Arch Relay

### Spatial character
- light branching
- modest loops
- one short false lead
- glimpses of the Red Arch from distance or over hedges

### Shape logic
- L-shaped or U-shaped intro area
- calm, readable, confidence-building

## 5.2 Entry Garden B

### Purpose
- teach the same onboarding principles on B side
- show early blocked progress via North Hedge Gate

### Spatial character
- similarly readable to A side
- slightly different silhouette so the two starts do not feel mirrored
- glimpses of a closed gate with light beyond

### Shape logic
- one clear progression route toward blocked gate
- one short exploratory spur

## 5.3 Red Arch Relay

### Purpose
- first authored co-op beat
- teach remote route control
- establish landmark callout value

### Spatial character
- narrower approach corridors
- one small memorable court containing the Red Arch
- relay plinth immediately legible on arrival

### Gameplay result
Player A activates relay. This opens the remote North Hedge Gate for Player B.

### Topology note
Do not overcomplicate this section. It should be a clear first proof of interdependence.

## 5.4 North Hedge Gate / Dry Fountain Approach

### Purpose
- reward Player B for partner action
- transition from blocked path to broader navigation space
- introduce Dry Fountain as strong orienting landmark

### Spatial character
- short release corridor after gate opens
- broader, semi-open approach into fountain-led area
- one optional beacon-worthy branch on harder modes

### Shape logic
Dry Fountain should feel easier to mentally map than narrow hedge corridors.

## 5.5 Survey Court Central

### Purpose
- first major reorientation point
- first Survey Node placement
- move players from early game into mid-game

### Spatial character
- formal, geometric court
- more symmetrical than surrounding maze
- Survey Node visually central or near-central
- 3–4 exit vectors

### State / system role
- activates a major map reveal moment
- anchors shared understanding before White Tower phase

## 5.6 White Tower Approach

### Purpose
- build anticipation for the asymmetry set-piece
- make tower feel like an earned vantage point

### Spatial character
- intermittent tower visibility
- rising route energy or stronger sightline control
- one misleading side route that is visually tempting but not ideal

## 5.7 White Tower Overlook

### Purpose
- one player gains privileged route understanding
- other player navigates a denser route cluster below
- communication becomes mechanically useful

### Spatial character
- compact tower base court
- elevated view with readable route cluster below
- visible landmark references to support simple guidance language

### Gameplay requirement
The route cluster below must be understandable from above. This puzzle should feel like guidance, not guessing.

## 5.8 Mid-Maze Route Cluster / Unlock

### Purpose
- cash out the White Tower information puzzle
- unlock forward progress toward CG

### Spatial character
- most maze-like navigational knot in the map
- still authored and bounded, not sprawling
- 1 main correct route chain
- 2 wrong branches
- 1 loopback

### Outcome
A route, gate, or bridge event unlocks the CG approach.

## 5.9 Convergence Garden (CG)

### Purpose
- reunion point
- emotional payoff to prior separation
- short period of shared traversal becomes possible

### Spatial character
- more open than the route cluster before it
- visually memorable and slightly softer in tension
- should feel like a distinct place, not just another maze pocket

### Design rule
CG is not optional window dressing. It is part of the locked topology.

### Suggested composition
- central garden or court
- elegant stonework
- one strong shared landmark object
- clear sightlines so players can physically see each other on arrival

## 5.10 Shared Traversal Spur

### Purpose
- let players actually move together for a short authored section
- change pacing before the final split

### Spatial character
- short, readable, shared route
- low confusion
- one memorable shared movement beat

### Design rule
Keep this section modest. The point is reunion and contrast, not a second giant maze.

## 5.11 Threshold Path A / Threshold Path B

### Purpose
- re-separate players before finale
- build ceremonial late-run tension
- position each player at one half of the Twin Signal sequence

### Spatial character
- cleaner, more axial, more architectural than early maze space
- fewer branches
- stronger sightlines toward final geometry

### Design rule
This section should feel close to the end. Do not trap players in extended confusion here.

## 5.12 Twin Signal Court

### Purpose
- final paired activation puzzle
- open the Sun Gate

### Spatial character
- broad, readable, near-symmetrical final court
- two separated activation points
- strong line of sight to final gate state changes

### Gameplay rule
Activation must be readable and fair for players using either voice or pings/basic callouts.

## 5.13 Sun Gate Escape Path

### Purpose
- deliver the release of success
- allow both players to cross the boundary together

### Spatial character
- opened route should be obvious
- no extra puzzle or major confusion after gate opens
- short final run to exit

---

## 6. Landmark rhythm through the run

Recommended exposure rhythm:
1. local start landmark / silhouette
2. Red Arch
3. Dry Fountain
4. Survey Court
5. White Tower
6. CG shared landmark
7. glimpsed Sun Gate / final threshold architecture

The map should teach memory through this sequence.

---

## 7. Branching complexity curve

The whole run should not be equally dense.

Recommended complexity curve:
- **Entry:** simple
- **Early relay/fountain:** moderate
- **Survey Court:** stabilising
- **White Tower + route cluster:** highest complexity
- **CG shared section:** reduced complexity
- **Threshold/finale:** low to moderate, strongly directed

This curve is important. It keeps the maze huge-feeling without becoming exhausting.

---

## 8. Survey Node placement

Recommended v1 placement:

### Survey Node 1
At or near **Survey Court Central**.

Purpose:
- first major reorientation beat
- reveal support before White Tower phase
- beacon replenish on Hard

### Survey Node 2
Optional for later v1 pass: near late mid-game or just before threshold split.

Purpose:
- reduce late-run frustration
- reinforce overall map orientation before the final split

For the earliest greybox vertical slice, one Survey Node is enough to validate the core loop.

---

## 9. Signal Beacon pressure points

Hard mode only needs a few meaningful decision points. Recommended likely beacon-worthy areas:
- near Dry Fountain approach
- near Survey Court exits
- around the Mid-Maze Route Cluster
- optionally just before threshold split if certainty is low

Beacons should support decision-making, not become something players spam in every corridor.

---

## 10. Easy / Medium / Hard topology behaviour

The topology stays the same across all difficulties.

### Easy
- stronger map certainty
- easier partner tracking
- more readable route confidence

### Medium
- persistent exploration reveal
- Survey Court value increases
- players rely more on landmarks and callouts

### Hard
- route certainty depends on live reveal, Survey Nodes, and beacons
- White Tower guidance becomes more important
- CG feels even more valuable as a reorientation moment because shared knowledge is harder-earned

---

## 11. Greybox build order

Recommended level greybox order:
1. Entry Garden A
2. Entry Garden B
3. Red Arch Relay court
4. North Hedge Gate / Dry Fountain approach
5. Survey Court Central
6. White Tower Approach + Overlook
7. Mid-Maze Route Cluster
8. Convergence Garden (CG)
9. Shared Traversal Spur
10. Threshold Paths
11. Twin Signal Court
12. Sun Gate escape path

This order matches the gameplay learning curve.

---

## 12. Validation criteria

The topology is successful if playtesters can say:
- “The Red Arch and White Tower were easy to remember.”
- “Meeting in CG felt like a real payoff.”
- “The route to the finale became clear at the right time.”
- “The maze felt large without feeling like endless samey corridors.”
- “The final split and Twin Signal made sense.”
- “The Sun Gate opening felt earned.”

---

## 13. Guardrails

### Do
- keep landmarks strong and sparse
- keep CG as a genuine reunion section
- let White Tower be the main asymmetric-information set-piece
- ensure the final threshold phase is more ceremonial than confusing

### Do not
- turn the whole map into uniformly dense corridors
- remove the reunion phase to simplify implementation
- add multiple extra puzzle families into the Sun Maze v1 slice
- hide the Sun Gate payoff behind another late surprise system
