import { useEffect } from 'react';
import type { ReactElement } from 'react';
import { connectRuntimeStore, ROOM_PHASES, useConnectRuntimeState } from './runtime/store';
import { ConnectScene } from './scene/ConnectScene';

function formatSeconds(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, '0');
  const seconds = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, '0');
  return `${minutes}:${seconds}`;
}

export function ConnectChannel(): ReactElement {
  const runtime = useConnectRuntimeState();
  const { room, timer, players, world, network } = runtime;
  const remainingSeconds = Math.max(0, timer.countdownSeconds - timer.elapsedSeconds);

  useEffect(() => {
    connectRuntimeStore.setConnectionStatus('local_mock');
  }, []);

  useEffect(() => {
    if (!timer.isRunning) {
      return undefined;
    }

    const timerId = window.setInterval(() => {
      connectRuntimeStore.tickTimer(1);
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [timer.isRunning]);

  return (
    <section aria-label="CONNECT.EXE" className="connectChannel">
      <article className="connectRuntimeWindow">
        <header className="connectRuntimeTitlebar">
          <p className="connectRuntimeTitle">CONNECT.EXE</p>
          <p className="connectRuntimeMeta">M0 runtime foundation</p>
        </header>

        <div className="connectRuntimeBody">
          <div className="connectScenePane">
            <div className="connectSceneFrame">
              <ConnectScene />
            </div>
          </div>

          <aside className="connectInspectorPane">
            <section className="connectInspectorSection">
              <p className="connectInspectorTitle">Room Phase</p>
              <div className="connectPhaseGrid">
                {ROOM_PHASES.map((phase) => (
                  <button
                    key={phase}
                    className={`connectPhaseButton${phase === room.phase ? ' connectPhaseButtonActive' : ''}`}
                    type="button"
                    onClick={() => connectRuntimeStore.setRoomPhase(phase)}
                  >
                    {phase}
                  </button>
                ))}
              </div>
            </section>

            <section className="connectInspectorSection">
              <p className="connectInspectorTitle">Timer Scaffold</p>
              <div className="connectControlRow">
                <button type="button" onClick={() => connectRuntimeStore.startRun()}>
                  Start Run
                </button>
                {timer.isRunning ? (
                  <button type="button" onClick={() => connectRuntimeStore.pauseTimer()}>
                    Pause
                  </button>
                ) : (
                  <button type="button" onClick={() => connectRuntimeStore.resumeTimer()}>
                    Resume
                  </button>
                )}
              </div>
              <div className="connectControlRow">
                <button
                  type="button"
                  onClick={() =>
                    connectRuntimeStore.setCountdownSeconds(timer.countdownSeconds + 30)
                  }
                >
                  +30s
                </button>
                <button
                  type="button"
                  onClick={() =>
                    connectRuntimeStore.setCountdownSeconds(timer.countdownSeconds - 30)
                  }
                >
                  -30s
                </button>
                <button type="button" onClick={() => connectRuntimeStore.reset()}>
                  Reset Runtime
                </button>
              </div>
            </section>

            <section className="connectInspectorSection">
              <p className="connectInspectorTitle">Local Map Freeze Scaffold</p>
              <div className="connectControlRow">
                <button
                  type="button"
                  onClick={() =>
                    connectRuntimeStore.setMapOpen('local', !players.local.isMapOpen)
                  }
                >
                  {players.local.isMapOpen ? 'Close Map' : 'Open Map'}
                </button>
              </div>
            </section>

            <section className="connectInspectorSection">
              <p className="connectInspectorTitle">Runtime Snapshot</p>
              <dl className="connectStatGrid">
                <dt>Room</dt>
                <dd>{room.roomId}</dd>
                <dt>Phase</dt>
                <dd>{room.phase}</dd>
                <dt>Connection</dt>
                <dd>{room.connectionStatus}</dd>
                <dt>Host</dt>
                <dd>{room.hostPlayerId}</dd>
                <dt>Time Left</dt>
                <dd>{formatSeconds(remainingSeconds)}</dd>
                <dt>Elapsed</dt>
                <dd>{formatSeconds(timer.elapsedSeconds)}</dd>
                <dt>Local Placeholder</dt>
                <dd>{players.local.playerId}</dd>
                <dt>Remote Placeholder</dt>
                <dd>{players.remote.playerId}</dd>
                <dt>Local Movement</dt>
                <dd>{players.local.isMovementFrozen ? 'frozen (map open)' : 'enabled'}</dd>
                <dt>Scene</dt>
                <dd>{world.sceneId}</dd>
              </dl>
            </section>

            <section className="connectInspectorSection">
              <p className="connectInspectorTitle">Authority Scaffold</p>
              <p className="connectAssumption">
                Shared-state authority is explicit and host-owned:{' '}
                <strong>{network.authorityModel}</strong>. Transport remains{' '}
                <strong>{network.transport}</strong> pending OPEN_QUESTIONS lock.
              </p>
            </section>
          </aside>
        </div>
      </article>
    </section>
  );
}
