import { useEffect, type CSSProperties, type JSX } from 'react';
import { SHELL_Z_INDEX } from '../core/types';
import { useDesktopStore } from './desktopStore';

const AUTO_DISMISS_MS = 1200;

const overlayStyle: CSSProperties = {
  position: 'absolute',
  inset: 0,
  zIndex: SHELL_Z_INDEX.OVERLAY,
  display: 'grid',
  placeItems: 'center',
  background: 'radial-gradient(circle at 50% 50%, #0b1020 0%, #05080f 75%)',
  color: '#8de9ff',
  fontFamily: '"Courier New", monospace',
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
};

const panelStyle: CSSProperties = {
  border: '1px solid rgba(141, 233, 255, 0.4)',
  borderRadius: '8px',
  background: 'rgba(5, 10, 22, 0.9)',
  minWidth: 'min(84vw, 560px)',
  padding: '1.2rem 1.4rem',
};

const lineStyle: CSSProperties = {
  margin: 0,
  fontSize: '0.85rem',
  opacity: 0.88,
};

const hintStyle: CSSProperties = {
  margin: '0.8rem 0 0',
  fontSize: '0.72rem',
  opacity: 0.64,
};

export function BootSequence(): JSX.Element {
  const completeBoot = useDesktopStore((store) => store.completeBoot);

  useEffect(() => {
    const complete = (): void => {
      completeBoot();
    };

    const timeoutId = window.setTimeout(complete, AUTO_DISMISS_MS);
    const onKeyDown = (): void => {
      complete();
    };

    window.addEventListener('keydown', onKeyDown);
    return (): void => {
      window.clearTimeout(timeoutId);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [completeBoot]);

  return (
    <div role="presentation" style={overlayStyle} onPointerDown={completeBoot}>
      <section style={panelStyle}>
        <p style={lineStyle}>Terminal-OS v2 shell initializing...</p>
        <p style={lineStyle}>Loading desktop frame, taskbar, and window mount point.</p>
        <p style={hintStyle}>Press any key or click to continue.</p>
      </section>
    </div>
  );
}
