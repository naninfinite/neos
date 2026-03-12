export type RoomPhase = 'idle' | 'lobby' | 'inRun' | 'win' | 'fail' | 'restarting';

export type ConnectionStatus = 'offline' | 'local_mock' | 'connected';

export type DifficultyMode = 'easy' | 'medium' | 'hard';

export type PlayerRole = 'local' | 'remote';

export interface PlayerTransform {
  position: [number, number, number];
  headingRadians: number;
}

export interface ConnectPlayerState {
  role: PlayerRole;
  playerId: string;
  isConnected: boolean;
  transform: PlayerTransform;
  stamina: number;
  isMapOpen: boolean;
  isMovementFrozen: boolean;
  isSprintEnabled: boolean;
  isJumpEnabled: boolean;
  isInteractEnabled: boolean;
}

export interface ConnectRuntimeState {
  room: {
    roomId: string;
    localPlayerId: string;
    hostPlayerId: string;
    phase: RoomPhase;
    difficulty: DifficultyMode;
    connectionStatus: ConnectionStatus;
    restartRequestedBy: string[];
  };
  timer: {
    countdownSeconds: number;
    elapsedSeconds: number;
    isRunning: boolean;
    lastTickAt: number | null;
  };
  players: Record<PlayerRole, ConnectPlayerState>;
  world: {
    sceneId: string;
    loaded: boolean;
    mapId: string;
  };
  network: {
    authorityModel: 'host_authoritative';
    transport: 'unresolved';
    hostDisconnectPolicy: 'end_run_return_lobby';
  };
}
