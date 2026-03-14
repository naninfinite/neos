import { useSyncExternalStore } from 'react';
import type {
  ConnectRuntimeState,
  ConnectionStatus,
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

function createInitialState(): ConnectRuntimeState {
  return {
    room: {
      roomId: 'room-sun-maze-m0',
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
      local: {
        role: 'local',
        playerId: 'player-local',
        isConnected: true,
        transform: {
          position: [-2, 0, 1],
          headingRadians: 0,
        },
        stamina: 100,
        isMapOpen: false,
        isMovementFrozen: false,
        isSprintEnabled: true,
        isJumpEnabled: true,
        isInteractEnabled: true,
      },
      remote: {
        role: 'remote',
        playerId: 'player-remote',
        isConnected: true,
        transform: {
          position: [2, 0, -1],
          headingRadians: Math.PI,
        },
        stamina: 100,
        isMapOpen: false,
        isMovementFrozen: false,
        isSprintEnabled: true,
        isJumpEnabled: true,
        isInteractEnabled: true,
      },
    },
    world: {
      sceneId: 'connect-greybox-test-scene',
      loaded: true,
      mapId: 'sun-maze-greybox-m0',
    },
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
          },
        },
      },
    }));
  },

  setPlayerStamina(role: PlayerRole, stamina: number): void {
    update((current) => ({
      ...current,
      players: {
        ...current.players,
        [role]: {
          ...current.players[role],
          stamina: Math.max(0, Math.min(100, stamina)),
        },
      },
    }));
  },

  setMapOpen(role: PlayerRole, isMapOpen: boolean): void {
    update((current) => withMapFreeze(current, role, isMapOpen));
  },
};

export function useConnectRuntimeState(): ConnectRuntimeState {
  return useSyncExternalStore(
    connectRuntimeStore.subscribe,
    connectRuntimeStore.getState,
    connectRuntimeStore.getState,
  );
}
