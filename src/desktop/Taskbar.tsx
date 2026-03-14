import type { CSSProperties, JSX } from 'react';
import { SHELL_Z_INDEX, TASKBAR_HEIGHT_PX } from '../core/types';
import { useDesktopStore } from './desktopStore';

const taskbarStyle: CSSProperties = {
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: SHELL_Z_INDEX.TASKBAR,
  height: `${TASKBAR_HEIGHT_PX}px`,
  display: 'grid',
  gridTemplateColumns: 'auto 1fr auto',
  gap: '0.75rem',
  alignItems: 'center',
  padding: '0 0.75rem',
  borderTop: '1px solid rgba(255, 255, 255, 0.2)',
  background: 'rgba(6, 12, 26, 0.82)',
  backdropFilter: 'blur(8px)',
  color: '#e6eeff',
};

const launcherButtonStyle: CSSProperties = {
  border: '1px solid rgba(255, 255, 255, 0.24)',
  borderRadius: '6px',
  padding: '0.35rem 0.6rem',
  background: 'rgba(255, 255, 255, 0.08)',
  color: 'inherit',
  fontWeight: 600,
};

const placeholderStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  border: '1px dashed rgba(255, 255, 255, 0.25)',
  borderRadius: '6px',
  minHeight: '30px',
  padding: '0 0.6rem',
  fontSize: '0.82rem',
  opacity: 0.82,
};

export function Taskbar(): JSX.Element {
  const launcherOpen = useDesktopStore((store) => store.launcherOpen);
  const toggleLauncher = useDesktopStore((store) => store.toggleLauncher);

  return (
    <footer style={taskbarStyle}>
      <button
        aria-label="Toggle launcher"
        aria-pressed={launcherOpen}
        style={launcherButtonStyle}
        type="button"
        onClick={toggleLauncher}
      >
        Launcher
      </button>
      <div style={placeholderStyle}>Task Area Placeholder</div>
      <div style={placeholderStyle}>Tray Placeholder</div>
    </footer>
  );
}
