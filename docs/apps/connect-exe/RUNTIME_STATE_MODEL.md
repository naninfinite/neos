# Connect.EXE — RUNTIME_STATE_MODEL

## 1. Purpose

This document defines the runtime state model for Connect.EXE v1.

It describes:
- room/session state
- host authority boundaries
- player runtime state
- puzzle/world state
- map/reveal state
- run progression state

This is the gameplay/runtime model for the first playable 2-player prototype of
**The Sun Maze**.

---

## 2. Runtime model principles

### 2.1 Explicit phases
Room state should move through explicit phases rather than implied conditions.

### 2.2 Host-authoritative shared truth
Anything that affects route truth, puzzle truth, timer truth, or win/fail truth
must resolve through the authoritative host path.

### 2.3 Local responsiveness remains local
Camera feel, immediate movement feel, and local UI transitions can stay client-local.

### 2.4 Runtime state is not scene state
Scene components render from runtime state and dispatch actions. They do not own
canonical game truth.

---

## 3. Room authority model

### Room authority (v1)
Connect.EXE v1 uses a **host-authoritative** room model.

#### Authoritative host-owned state
The host owns the canonical version of:
- `roomPhase`
- `countdownSeconds`
- `difficulty`
- `puzzleStates`
- `gateStates`
- `surveyNodeStates`
- `signalBeaconPlacements`
- `sunGateState`
- `winFailState`

#### Client-local responsive state
Each client owns immediate local presentation state such as:
- camera orientation
- local movement feel
- local jump feel
- local interaction prompt visibility
- local map UI open/closed state
- local Bearing Disc rendering

Shared-state actions are submitted to the host and only become canonical once accepted and broadcast.

---

## 4. Room/session state

Suggested high-level room/session state fields:

- `roomId`
- `localPlayerId`
- `hostPlayerId`
- `connectionStatus`
- `roomPhase`
- `difficulty`
- `countdownSeconds`
- `elapsedSeconds`
- `restartRequestedBy`
- `rerunPending`

### Suggested room phases
- `idle`
- `lobby`
- `inRun`
- `win`
- `fail`
- `restarting`

The implementation can choose exact enum naming, but the phase model should remain explicit.

---

## 5. Player runtime state

Each player should have a runtime record representing their current state in the room.

Suggested categories:
- identity
- transform/movement
- exertion
- local UI/navigation
- progression-relevant location data

### Example fields
- `playerId`
- `displayName` (optional if needed)
- `transform`
- `velocity`
- `isGrounded`
- `isSprinting`
- `stamina`
- `currentDistrictId`
- `lastConfirmedDistrictId`
- `isConnected`

---

## 6. Player navigation/UI state

Each player runtime record should include navigation/UI-adjacent state for the local session.

Suggested fields:
- `isMapOpen: boolean`
- `bearingHeading: number`
- `mapMode: "easy" | "medium" | "hard"`
- `lastKnownPartnerTrace` (if available by difficulty/rules)
- `isSprintAllowed: boolean`
- `isJumpAllowed: boolean`

The Bearing Disc is derived from heading/orientation state and does not constitute a minimap.

---

## 7. Movement and exertion state

### Core movement state
Movement-adjacent state should support:
- walking
- sprinting
- jumping
- grounded/airborne checks
- stamina depletion/recovery

### Suggested movement/exertion fields
- `stamina`
- `staminaMax`
- `staminaRecoveryRate`
- `jumpChainCount`
- `lastJumpTimestamp`
- `isExhausted`
- `isSprintAllowed`
- `isJumpAllowed`

### Exhausted jump behaviour
Jump remains available at zero stamina.

v1 rule:
- jumping always remains possible
- repeated jumps incur escalating exertion cost
- exhausted jumping should not provide meaningful traversal or speed advantage
- sprint remains stamina-limited even when jump is still allowed

This preserves expected first-person control language while preventing zero-stamina bunny hopping from becoming free movement tech.

---

## 8. Map interaction state

### Map-open traversal freeze
When a player opens the full-screen map, traversal freezes for that player.

While `isMapOpen === true`:
- movement simulation for that player is suspended
- sprint input is ignored
- jump input is ignored
- interaction input is ignored

This freeze is player-local only. It does not pause room time or other players.

### Map-open principle
Map state is a deliberate navigation mode, not just an overlay.  
The player chooses between traversal and orientation.

---

## 9. Map/reveal state

Map and reveal state must support:
- difficulty-specific visibility
- landmark labels
- partner visibility rules
- Survey Node reveals
- Signal Beacon reveals
- last-known partner traces

### Suggested high-level fields
- `mapMode`
- `revealedRegions`
- `liveRevealRadius`
- `surveyNodeRevealRegions`
- `signalBeaconRevealRegions`
- `landmarkMarkers`
- `partnerVisibilityState`
- `lastKnownPartnerTrace`

### Difficulty expectations
#### Easy
- mostly filled map
- partner always visible

#### Medium
- explored space persists
- partner visible in revealed space

#### Hard
- explored space fades
- partner visible only in actively revealed space
- beacons create persistent local knowledge
- traces matter more

---

## 10. Signal Beacon state

Signal Beacons are hard-mode navigation resources.

Suggested state fields:
- `beaconId`
- `ownerPlayerId`
- `position`
- `revealRadius`
- `placedAtTime`
- `isActive`

### Placement rules
- each player starts with 3 on hard
- max carry 5
- placement occurs at current player location
- beacon remains for run duration
- beacon cannot be picked back up in v1
- placement becomes canonical only when accepted by host

---

## 11. Survey Node state

Survey Nodes are authored reorientation/progression objects.

Suggested fields:
- `surveyNodeId`
- `districtId`
- `isActivated`
- `activatedByPlayerId`
- `activatedAtTime`
- `revealRegionId`
- `beaconGranted` (if applicable on hard)

### Effects on activation
- reveal larger map region
- refresh or improve orientation certainty
- possibly refresh partner trace
- grant +1 beacon on hard
- remain activated for the rest of the run unless explicitly designed otherwise

---

## 12. Landmark state

Landmarks should be registered in a stable way so runtime systems can use them.

Suggested landmark fields:
- `landmarkId`
- `label`
- `districtId`
- `position`
- `isMapVisible`
- `isCalloutRelevant`

Landmarks are gameplay data, not just visual scene decoration.

---

## 13. Puzzle/world state

World state should be organised around canonical puzzle/world objects.

Suggested major objects:
- `redArchRelayState`
- `northGateState`
- `whiteTowerGuidanceState`
- `midMazeRouteUnlockState`
- `convergenceGardenState`
- `twinSignalState`
- `sunGateState`

### Puzzle state expectations
Each puzzle should support:
- inactive
- active
- succeeded
- resettable/failed where relevant

The exact schema may vary, but the state model must permit clear host-authoritative transitions.

---

## 14. Puzzle reset state

Puzzle reset behaviour should remain explicit rather than hidden in scene code.

Suggested reset-related fields:
- `lastAttemptAt`
- `lastFailAt`
- `isResetPending`
- `resetDelaySeconds`
- `attemptCount`

For v1, a short automatic reset with visible feedback is preferred for failed paired/timing states.

---

## 15. Ping and communication state

### Ping state
Pings should support:
- marker placement
- timestamp
- owner
- type/category if quick-callouts are used later
- expiry

Suggested fields:
- `pingId`
- `ownerPlayerId`
- `position`
- `bearing`
- `createdAt`
- `expiresAt`
- `pingType`

### Communication fallback
The runtime should remain compatible with a minimum non-voice feature set:
- ping
- optional small quick-callout set

---

## 16. Progression state

Run progression should not be inferred only from geometry triggers.  
The runtime should track the progression spine explicitly.

Suggested progression fields:
- `currentRunState`
- `hasRedArchRelayResolved`
- `hasSurveyCourtReached`
- `hasWhiteTowerResolved`
- `hasMidMazeUnlocked`
- `hasConvergenceGardenReached`
- `hasThresholdSplitOccurred`
- `hasTwinSignalResolved`
- `hasSunGateOpened`
- `haveBothPlayersEscaped`

This can be implemented as booleans, a structured progression object, or a phase graph,
but the progression spine should be observable for debugging.

---

## 17. Win/fail state

Suggested fields:
- `winFailState`
- `winAtTime`
- `failAtTime`
- `failReason`
- `escapedPlayerIds`

### v1 fail expectations
The primary fail condition is timer expiry.

### v1 win expectations
Win occurs only when:
- Sun Gate is open
- both players have reached the final escape condition

---

## 18. Restart/rerun state

The runtime should support controlled reruns.

Suggested fields:
- `restartRequestedBy`
- `allPlayersReadyForRestart`
- `restartCountdown`
- `pendingSeedOrLayoutId` (if needed later)
- `resetInProgress`

For v1, a simple rerun path is acceptable so long as it is explicit and reliable.

---

## 19. Debugging/inspection value

The runtime state model should be inspectable enough to debug:
- room phase drift
- timer drift
- gate/puzzle desync
- Survey Node activation issues
- beacon placement acceptance
- Twin Signal failure/success timing
- host disconnect handling

A debuggable runtime model is more important for v1 than over-abstract generality.
