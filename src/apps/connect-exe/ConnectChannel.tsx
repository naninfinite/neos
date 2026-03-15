import { useEffect } from 'react';
import type { ReactElement } from 'react';
import { connectRuntimeStore, ROOM_PHASES, useConnectRuntimeState } from './runtime/store';
import { ConnectScene } from './scene/ConnectScene';
import { BearingDisc } from './scene/BearingDisc';

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
  const { room, timer, players, network } = runtime;
  const remainingSeconds = Math.max(0, timer.countdownSeconds - timer.elapsedSeconds);
  const localPlayer = players.local;

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
          <p className="connectRuntimeMeta">M1 navigation shell</p>
        </header>

        <div className="connectRuntimeBody">
          <div className="connectScenePane">
            <div className="connectSceneFrame">
              <ConnectScene />
              {/* HUD overlay */}
              <div className="connectHud">
                <BearingDisc />
                <div className="connectHudTimer">
                  {formatSeconds(remainingSeconds)}
                </div>
                {localPlayer.isMapOpen && (
                  <div className="connectMapOverlay">
                    <p className="connectMapTitle">MAP — press M to close</p>
                    <p className="connectMapHint">Traversal frozen while map is open</p>
                  </div>
                )}
                {localPlayer.stamina.isExhausted && (
                  <div className="connectHudExhausted">EXHAUSTED</div>
                )}
                <div className="connectHudCrosshair" />
              </div>
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
              <p className="connectInspectorTitle">Timer</p>
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
                  Reset
                </button>
              </div>
            </section>

            <section className="connectInspectorSection">
              <p className="connectInspectorTitle">Movement</p>
              <dl className="connectStatGrid">
                <dt>Stamina</dt>
                <dd>{Math.round(localPlayer.stamina.current)} / {localPlayer.stamina.max}</dd>
                <dt>Sprinting</dt>
                <dd>{localPlayer.movement.isSprinting ? 'yes' : 'no'}</dd>
                <dt>Grounded</dt>
                <dd>{localPlayer.movement.isGrounded ? 'yes' : 'no'}</dd>
                <dt>Jump Chain</dt>
                <dd>{localPlayer.stamina.jumpChainCount}</dd>
                <dt>Exhausted</dt>
                <dd>{localPlayer.stamina.isExhausted ? 'YES' : 'no'}</dd>
                <dt>Map Open</dt>
                <dd>{localPlayer.isMapOpen ? 'yes (frozen)' : 'no'}</dd>
                <dt>District</dt>
                <dd>{localPlayer.currentDistrictId ?? '—'}</dd>
              </dl>
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
                <dt>Time Left</dt>
                <dd>{formatSeconds(remainingSeconds)}</dd>
                <dt>Elapsed</dt>
                <dd>{formatSeconds(timer.elapsedSeconds)}</dd>
                <dt>Position</dt>
                <dd>
                  {localPlayer.transform.position.map((v) => v.toFixed(1)).join(', ')}
                </dd>
                <dt>Heading</dt>
                <dd>{((localPlayer.transform.headingRadians * 180) / Math.PI).toFixed(0)}°</dd>
              </dl>
            </section>

            <section className="connectInspectorSection">
              <p className="connectInspectorTitle">Authority</p>
              <p className="connectAssumption">
                Model: <strong>{network.authorityModel}</strong> | Transport:{' '}
                <strong>{network.transport}</strong>
              </p>
            </section>

            <section className="connectInspectorSection">
              <p className="connectInspectorTitle">Controls</p>
              <p className="connectAssumption">
                Click scene to lock pointer. WASD = move, Shift = sprint, Space = jump, M = map
              </p>
            </section>
          </aside>
        </div>
      </article>
    </section>
  );
}
