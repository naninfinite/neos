import type { CSSProperties, JSX } from 'react';
import { SHELL_Z_INDEX, TASKBAR_HEIGHT_PX } from '../core/types';

interface LauncherProps {
  onClose(): void;
  onPlaceholderLaunch(id: string): void;
}

const launcherStyle: CSSProperties = {
  position: 'absolute',
  left: '0.9rem',
  bottom: `calc(${TASKBAR_HEIGHT_PX}px + 0.9rem)`,
  zIndex: SHELL_Z_INDEX.LAUNCHER,
  width: 'min(92vw, 380px)',
  border: '1px solid rgba(255, 255, 255, 0.24)',
  borderRadius: '12px',
  background: 'rgba(7, 13, 28, 0.94)',
  backdropFilter: 'blur(10px)',
  padding: '0.9rem',
  color: '#edf4ff',
};

const titleStyle: CSSProperties = {
  margin: '0 0 0.75rem',
  fontSize: '0.8rem',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  opacity: 0.86,
};

const listStyle: CSSProperties = {
  display: 'grid',
  gap: '0.5rem',
};

const entryStyle: CSSProperties = {
  textAlign: 'left',
  width: '100%',
  border: '1px solid rgba(255, 255, 255, 0.18)',
  borderRadius: '8px',
  background: 'rgba(255, 255, 255, 0.06)',
  color: 'inherit',
  padding: '0.55rem 0.65rem',
};

const closeStyle: CSSProperties = {
  marginTop: '0.8rem',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  borderRadius: '8px',
  background: 'transparent',
  color: 'inherit',
  padding: '0.4rem 0.6rem',
};

const PLACEHOLDER_ENTRIES = [
  { id: 'terminal', label: 'Terminal.EXE (placeholder)' },
  { id: 'fileman', label: 'FileMan.EXE (placeholder)' },
  { id: 'settings', label: 'Settings.EXE (placeholder)' },
] as const;

export function Launcher({ onClose, onPlaceholderLaunch }: LauncherProps): JSX.Element {
  return (
    <section aria-label="Launcher panel" style={launcherStyle}>
      <h2 style={titleStyle}>Launcher (Shell Placeholder)</h2>
      <div style={listStyle}>
        {PLACEHOLDER_ENTRIES.map((entry) => (
          <button
            key={entry.id}
            style={entryStyle}
            type="button"
            onClick={() => onPlaceholderLaunch(entry.id)}
          >
            {entry.label}
          </button>
        ))}
      </div>
      <button style={closeStyle} type="button" onClick={onClose}>
        Close
      </button>
    </section>
  );
}
