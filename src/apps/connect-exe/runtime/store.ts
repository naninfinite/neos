import { useSyncExternalStore } from 'react';
import type {
  ConnectRuntimeState,
  ConnectionStatus,
  LandmarkEntry,
  PlayerRole,
  RoomPhase,
} from './types';

type Listener = () => void;

export const ROOM_PHASES: RoomPhase[] = [
  'idle',
  'lobby',
  'inRun',
  'win',
  'fail',
  'restarting',
];

const DEFAULT_COUNTDOWN_SECONDS = 300;
const MIN_COUNTDOWN_SECONDS = 30;
const MAX_COUNTDOWN_SECONDS = 1800;

/* ── Movement constants ── */
export const WALK_SPEED = 4.0;
export const SPRINT_SPEED = 7.0;
export const JUMP_IMPULSE = 5.5;
export const GRAVITY = -15.0;
export const STAMINA_MAX = 100;
export const STAMINA_SPRINT_DRAIN = 18; // per second
export const STAMINA_RECOVERY_RATE = 12; // per second
export const STAMINA_JUMP_COST = 12;
export const STAMINA_JUMP_CHAIN_MULTIPLIER = 1.6;
export const STAMINA_EXHAUSTED_THRESHOLD = 5;
export const JUMP_CHAIN_RESET_TIME = 1.2; // seconds

function createDefaultPlayer(role: PlayerRole): ConnectRuntimeState['players']['local'] {
  return {
    role,
    playerId: role === 'local' ? 'player-local' : 'player-remote',
    isConnected: true,
    transform: {
      position: role === 'local' ? [-2, 0, 1] : [2, 0, -1],
      headingRadians: role === 'local' ? 0 : Math.PI,
      pitchRadians: 0,
    },
    movement: {
      isGrounded: true,
      isSprinting: false,
      isJumping: false,
      velocityY: 0,
    },
    stamina: {
      current: STAMINA_MAX,
      max: STAMINA_MAX,
      recoveryRate: STAMINA_RECOVERY_RATE,
      jumpChainCount: 0,
      lastJumpTime: 0,
      isExhausted: false,
    },
    isMapOpen: false,
    isMovementFrozen: false,
    isSprintEnabled: true,
    isJumpEnabled: true,
    isInteractEnabled: true,
    currentDistrictId: 'entry-garden',
  };
}

function createInitialState(): ConnectRuntimeState {
  return {
    room: {
      roomId: 'room-sun-maze-m1',
      localPlayerId: 'player-local',
      hostPlayerId: 'player-local',
      phase: 'lobby',
      difficulty: 'easy',
      connectionStatus: 'offline',
      restartRequestedBy: [],
    },
    timer: {
      countdownSeconds: DEFAULT_COUNTDOWN_SECONDS,
      elapsedSeconds: 0,
      isRunning: false,
      lastTickAt: null,
    },
    players: {
      local: createDefaultPlayer('local'),
      remote: createDefaultPlayer('remote'),
    },
    world: {
      sceneId: 'connect-greybox-m1',
      loaded: true,
      mapId: 'sun-maze-greybox-m1',
    },
    landmarks: [],
    network: {
      authorityModel: 'host_authoritative',
      transport: 'unresolved',
      hostDisconnectPolicy: 'end_run_return_lobby',
    },
  };
}

let state: ConnectRuntimeState = createInitialState();
const listeners = new Set<Listener>();

function emit(): void {
  listeners.forEach((listener) => listener());
}

function update(updater: (current: ConnectRuntimeState) => ConnectRuntimeState): void {
  const next = updater(state);
  if (next === state) {
    return;
  }
  state = next;
  emit();
}

function withMapFreeze(
  current: ConnectRuntimeState,
  role: PlayerRole,
  isMapOpen: boolean,
): ConnectRuntimeState {
  const player = current.players[role];
  const updatedPlayer = {
    ...player,
    isMapOpen,
    isMovementFrozen: isMapOpen,
    isSprintEnabled: !isMapOpen,
    isJumpEnabled: !isMapOpen,
    isInteractEnabled: !isMapOpen,
  };

  return {
    ...current,
    players: {
      ...current.players,
      [role]: updatedPlayer,
    },
  };
}

export const connectRuntimeStore = {
  getState(): ConnectRuntimeState {
    return state;
  },

  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  reset(): void {
    state = createInitialState();
    emit();
  },

  setConnectionStatus(status: ConnectionStatus): void {
    update((current) => ({
      ...current,
      room: {
        ...current.room,
        connectionStatus: status,
      },
    }));
  },

  setRoomPhase(phase: RoomPhase): void {
    update((current) => ({
      ...current,
      room: {
        ...current.room,
        phase,
      },
      timer: {
        ...current.timer,
        isRunning: phase === 'inRun' ? current.timer.isRunning : false,
      },
    }));
  },

  startRun(): void {
    update((current) => ({
      ...current,
      room: {
        ...current.room,
        phase: 'inRun',
        restartRequestedBy: [],
      },
      timer: {
        ...current.timer,
        elapsedSeconds: 0,
        isRunning: true,
        lastTickAt: Date.now(),
      },
    }));
  },

  pauseTimer(): void {
    update((current) => ({
      ...current,
      timer: {
        ...current.timer,
        isRunning: false,
      },
    }));
  },

  resumeTimer(): void {
    update((current) => {
      if (current.room.phase !== 'inRun') {
        return current;
      }
      return {
        ...current,
        timer: {
          ...current.timer,
          isRunning: true,
          lastTickAt: Date.now(),
        },
      };
    });
  },

  setCountdownSeconds(seconds: number): void {
    const clamped = Math.min(MAX_COUNTDOWN_SECONDS, Math.max(MIN_COUNTDOWN_SECONDS, seconds));
    update((current) => ({
      ...current,
      timer: {
        ...current.timer,
        countdownSeconds: clamped,
      },
    }));
  },

  tickTimer(deltaSeconds = 1): void {
    update((current) => {
      if (!current.timer.isRunning || current.room.phase !== 'inRun') {
        return current;
      }

      const nextElapsed = current.timer.elapsedSeconds + deltaSeconds;
      const remaining = current.timer.countdownSeconds - nextElapsed;

      if (remaining <= 0) {
        return {
          ...current,
          room: {
            ...current.room,
            phase: 'fail',
          },
          timer: {
            ...current.timer,
            elapsedSeconds: current.timer.countdownSeconds,
            isRunning: false,
            lastTickAt: Date.now(),
          },
        };
      }

      return {
        ...current,
        timer: {
          ...current.timer,
          elapsedSeconds: nextElapsed,
          lastTickAt: Date.now(),
        },
      };
    });
  },

  setPlayerTransform(
    role: PlayerRole,
    position: [number, number, number],
    headingRadians: number,
    pitchRadians?: number,
  ): void {
    update((current) => ({
      ...current,
      players: {
        ...current.players,
        [role]: {
          ...current.players[role],
          transform: {
            position,
            headingRadians,
            pitchRadians: pitchRadians ?? current.players[role].transform.pitchRadians,
          },
        },
      },
    }));
  },

  setMapOpen(role: PlayerRole, isMapOpen: boolean): void {
    update((current) => withMapFreeze(current, role, isMapOpen));
  },

  /* ── M1 movement mutations ── */

  updateMovement(
    role: PlayerRole,
    movement: Partial<ConnectRuntimeState['players']['local']['movement']>,
  ): void {
    update((current) => ({
      ...current,
      players: {
        ...current.players,
        [role]: {
          ...current.players[role],
          movement: {
            ...current.players[role].movement,
            ...movement,
          },
        },
      },
    }));
  },

  /** Drain stamina by amount. Returns actual drain applied. */
  drainStamina(role: PlayerRole, amount: number): void {
    update((current) => {
      const player = current.players[role];
      const newCurrent = Math.max(0, player.stamina.current - amount);
      const isExhausted = newCurrent <= STAMINA_EXHAUSTED_THRESHOLD;
      return {
        ...current,
        players: {
          ...current.players,
          [role]: {
            ...player,
            stamina: {
              ...player.stamina,
              current: newCurrent,
              isExhausted,
            },
          },
        },
      };
    });
  },

  /** Recover stamina by amount per delta. */
  recoverStamina(role: PlayerRole, deltaSeconds: number): void {
    update((current) => {
      const player = current.players[role];
      if (player.movement.isSprinting) return current;
      const recovery = player.stamina.recoveryRate * deltaSeconds;
      const newCurrent = Math.min(player.stamina.max, player.stamina.current + recovery);
      const isExhausted = newCurrent <= STAMINA_EXHAUSTED_THRESHOLD;
      return {
        ...current,
        players: {
          ...current.players,
          [role]: {
            ...player,
            stamina: {
              ...player.stamina,
              current: newCurrent,
              isExhausted,
            },
          },
        },
      };
    });
  },

  /** Record a jump, incrementing chain count with escalating cost. */
  recordJump(role: PlayerRole): void {
    update((current) => {
      const player = current.players[role];
      const now = performance.now() / 1000;
      const timeSinceLast = now - player.stamina.lastJumpTime;
      const chainCount = timeSinceLast < JUMP_CHAIN_RESET_TIME
        ? player.stamina.jumpChainCount + 1
        : 1;
      const cost = STAMINA_JUMP_COST * Math.pow(STAMINA_JUMP_CHAIN_MULTIPLIER, chainCount - 1);
      const newCurrent = Math.max(0, player.stamina.current - cost);
      return {
        ...current,
        players: {
          ...current.players,
          [role]: {
            ...player,
            stamina: {
              ...player.stamina,
              current: newCurrent,
              jumpChainCount: chainCount,
              lastJumpTime: now,
              isExhausted: newCurrent <= STAMINA_EXHAUSTED_THRESHOLD,
            },
            movement: {
              ...player.movement,
              isJumping: true,
              isGrounded: false,
              velocityY: JUMP_IMPULSE,
            },
          },
        },
      };
    });
  },

  setLandmarks(landmarks: LandmarkEntry[]): void {
    update((current) => ({
      ...current,
      landmarks,
    }));
  },

  setPlayerDistrict(role: PlayerRole, districtId: string | null): void {
    update((current) => ({
      ...current,
      players: {
        ...current.players,
        [role]: {
          ...current.players[role],
          currentDistrictId: districtId,
        },
      },
    }));
  },
};

export function useConnectRuntimeState(): ConnectRuntimeState {
  return useSyncExternalStore(
    connectRuntimeStore.subscribe,
    connectRuntimeStore.getState,
    connectRuntimeStore.getState,
  );
}
