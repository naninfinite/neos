import { useEffect, type CSSProperties, type JSX } from 'react';

interface SiteBootOverlayProps {
  onComplete(): void;
}

const AUTO_DISMISS_MS = 850;

const overlayStyle: CSSProperties = {
  position: 'absolute',
  inset: 0,
  zIndex: 30,
  display: 'grid',
  placeItems: 'center',
  background: 'rgba(245, 230, 211, 0.55)',
  backdropFilter: 'blur(12px) saturate(1.08)',
};

const panelStyle: CSSProperties = {
  border: '1px solid rgba(255, 255, 255, 0.8)',
  borderRadius: '16px',
  background: 'rgba(255, 255, 255, 0.46)',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.75), 0 12px 32px rgba(120, 90, 60, 0.16)',
  backdropFilter: 'blur(20px) saturate(1.25)',
  padding: '1rem 1.2rem',
  width: 'min(92vw, 420px)',
  color: '#2d2520',
};

const titleStyle: CSSProperties = {
  margin: 0,
  fontSize: '1rem',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
};

const copyStyle: CSSProperties = {
  margin: '0.45rem 0 0',
  color: 'rgba(45, 37, 32, 0.78)',
};

const hintStyle: CSSProperties = {
  margin: '0.7rem 0 0',
  fontSize: '0.72rem',
  opacity: 0.65,
};

export function SiteBootOverlay({ onComplete }: SiteBootOverlayProps): JSX.Element {
  useEffect(() => {
    const timeout = window.setTimeout(onComplete, AUTO_DISMISS_MS);
    const onKeyDown = (): void => onComplete();

    window.addEventListener('keydown', onKeyDown);
    return (): void => {
      window.clearTimeout(timeout);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onComplete]);

  return (
    <section role="presentation" style={overlayStyle} onPointerDown={onComplete}>
      <div style={panelStyle}>
        <h2 style={titleStyle}>NEOS Channel Surface</h2>
        <p style={copyStyle}>Preparing light glass shell and channel navigation.</p>
        <p style={hintStyle}>Click or press any key to continue.</p>
      </div>
    </section>
  );
}
