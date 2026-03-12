import type { ReactElement } from 'react';

interface TaskbarProps {
  clockLabel: string;
  launcherOpen: boolean;
  onToggleLauncher: () => void;
}

export function Taskbar({
  clockLabel,
  launcherOpen,
  onToggleLauncher,
}: TaskbarProps): ReactElement {
  return (
    <footer className="taskbar" aria-label="Taskbar">
      <button
        aria-expanded={launcherOpen}
        aria-label="Open launcher"
        className="launcherButton"
        type="button"
        onClick={onToggleLauncher}
      >
        <span className="launcherGlyph" aria-hidden="true">
          N
        </span>
        <span className="launcherText">NEOS</span>
      </button>

      <section className="taskbarTasks" aria-label="Open windows">
        <p className="taskbarEmpty">No windows open</p>
      </section>

      <section className="systemTray" aria-label="System tray">
        <span className="notificationDot" aria-label="Notifications indicator" />
        <time aria-label="System clock" className="clockValue" dateTime={clockLabel}>
          {clockLabel}
        </time>
      </section>
    </footer>
  );
}
