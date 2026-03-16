import type { JSX } from 'react';
import { ChannelSurface } from './ChannelSurface';
import { SiteNav } from './SiteNav';

const shellStyle: React.CSSProperties = {
  position: 'relative',
  minHeight: '100vh',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  background: 'var(--color-bg-base)',
};

export function SiteShell(): JSX.Element {
  return (
    <main id="site-shell-bg" aria-label="Site shell" style={shellStyle}>
      <SiteNav />
      <ChannelSurface />
    </main>
  );
}
