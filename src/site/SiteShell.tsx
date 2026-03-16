import type { JSX } from 'react';

const shellStyle: React.CSSProperties = {
  position: 'relative',
  minHeight: '100vh',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  background: '#f5e6d3',
};

export function SiteShell(): JSX.Element {
  return (
    <main id="site-shell-bg" aria-label="Site shell" style={shellStyle}>
      {/* Blank canvas — rebuild one piece at a time */}
    </main>
  );
}
