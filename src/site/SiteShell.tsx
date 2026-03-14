import { useRef, type CSSProperties, type JSX } from 'react';
import { ChannelSurface } from './ChannelSurface';
import { SiteBootOverlay } from './SiteBootOverlay';
import { GlassCanvas } from './glass/GlassCanvas';
import { useGlassRegion } from './glass/useGlassRegion';
import { type SiteChannel, useSiteStore } from './siteStore';

const shellStyle: CSSProperties = {
  position: 'relative',
  minHeight: '100vh',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.9rem',
  padding: '0.9rem',
  background:
    'radial-gradient(circle at 14% 16%, rgba(255, 245, 235, 0.95), rgba(248, 232, 216, 0.88) 42%, transparent 70%), radial-gradient(circle at 85% 80%, rgba(228, 180, 140, 0.7), transparent 46%), linear-gradient(145deg, #f5e6d3 0%, #e8d5c4 35%, #d4a574 65%, #c4956a 100%)',
};

const topBarStyle: CSSProperties = {
  position: 'relative',
  zIndex: 1,
  border: '1px solid rgba(255, 255, 255, 0.76)',
  borderRadius: '16px',
  background: 'rgba(255, 255, 255, 0.06)',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.75), 0 10px 30px rgba(120, 90, 60, 0.16)',
  minHeight: '58px',
  padding: '0.75rem 0.95rem',
  display: 'grid',
  gridTemplateColumns: 'auto 1fr auto',
  alignItems: 'center',
  gap: '0.8rem',
};

const brandStyle: CSSProperties = {
  margin: 0,
  fontSize: '0.82rem',
  fontWeight: 700,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: '#2d2520',
};

const navStyle: CSSProperties = {
  display: 'flex',
  gap: '0.45rem',
  justifyContent: 'center',
  flexWrap: 'wrap',
};

const navButtonBase: CSSProperties = {
  borderRadius: '999px',
  border: '1px solid rgba(255,255,255,0.5)',
  background: 'rgba(255,255,255,0.12)',
  backdropFilter: 'blur(12px)',
  padding: '0.34rem 0.72rem',
  fontSize: '0.74rem',
  fontWeight: 600,
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  color: '#2d2520',
  cursor: 'pointer',
};

const navButtonActive: CSSProperties = {
  borderColor: 'rgba(255, 255, 255, 0.8)',
  background: 'rgba(255, 255, 255, 0.28)',
};

const statusStyle: CSSProperties = {
  margin: 0,
  textAlign: 'right',
  fontSize: '0.72rem',
  color: 'rgba(45, 37, 32, 0.72)',
};

const CHANNEL_LABELS: Record<Exclude<SiteChannel, null>, string> = {
  home: 'HOME',
  me: 'ME.EXE',
  you: 'YOU.EXE',
  third: 'THIRD.EXE',
};

const NAV_CHANNELS: Exclude<SiteChannel, null>[] = ['home', 'me', 'you', 'third'];

export function SiteShell(): JSX.Element {
  const bootComplete = useSiteStore((store) => store.bootComplete);
  const activeChannel = useSiteStore((store) => store.activeChannel);
  const setChannel = useSiteStore((store) => store.setChannel);
  const completeBoot = useSiteStore((store) => store.completeBoot);

  const headerRef = useRef<HTMLElement>(null);
  useGlassRegion(headerRef, { radius: 16 });

  const activeLabel = activeChannel === null ? 'HOME' : CHANNEL_LABELS[activeChannel];

  return (
    <main aria-label="Site shell" style={shellStyle}>
      <GlassCanvas />

      <header ref={headerRef} style={topBarStyle}>
        <p style={brandStyle}>NEOS</p>
        <nav aria-label="Channel navigation" style={navStyle}>
          {NAV_CHANNELS.map((channel) => (
            <button
              key={channel}
              type="button"
              style={{
                ...navButtonBase,
                ...(activeChannel === channel ? navButtonActive : {}),
              }}
              onClick={() => setChannel(channel)}
            >
              {CHANNEL_LABELS[channel]}
            </button>
          ))}
        </nav>
        <p aria-live="polite" style={statusStyle}>
          Active: {activeLabel}
        </p>
      </header>

      <ChannelSurface activeChannel={activeChannel} onSelectChannel={setChannel} />

      {!bootComplete ? <SiteBootOverlay onComplete={completeBoot} /> : null}
    </main>
  );
}
