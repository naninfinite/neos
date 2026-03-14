import { useRef, type CSSProperties, type JSX } from 'react';
import { useGlassRegion } from './glass/useGlassRegion';
import type { SiteChannel } from './siteStore';

interface ChannelSurfaceProps {
  activeChannel: SiteChannel;
  onSelectChannel(channel: SiteChannel): void;
}

interface ChannelCard {
  id: Exclude<SiteChannel, null | 'home'>;
  name: string;
  subtitle: string;
  detail: string;
}

const CHANNELS: ChannelCard[] = [
  {
    id: 'me',
    name: 'ME.EXE',
    subtitle: 'OS channel',
    detail: 'Desktop/windowing runtime lives here in Phase 2.',
  },
  {
    id: 'you',
    name: 'YOU.EXE',
    subtitle: 'Social channel',
    detail: 'Isolated communication surface placeholder.',
  },
  {
    id: 'third',
    name: 'THIRD.EXE',
    subtitle: '3D channel',
    detail: 'Isolated world-building surface placeholder.',
  },
];

const viewportStyle: CSSProperties = {
  position: 'relative',
  zIndex: 1,
  flex: 1,
  minHeight: 0,
  border: '1px solid rgba(255, 255, 255, 0.72)',
  borderRadius: '18px',
  background: 'rgba(255, 255, 255, 0.06)',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.7), 0 12px 36px rgba(120, 90, 60, 0.18)',
  padding: '1rem',
  display: 'grid',
  alignContent: 'start',
  gap: '0.9rem',
};

const heroStyle: CSSProperties = {
  border: '1px solid rgba(255, 255, 255, 0.68)',
  borderRadius: '14px',
  background: 'rgba(255, 255, 255, 0.06)',
  padding: '0.95rem',
};

const heroKickerStyle: CSSProperties = {
  margin: 0,
  fontSize: '0.74rem',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: 'rgba(45, 37, 32, 0.7)',
};

const heroTitleStyle: CSSProperties = {
  margin: '0.35rem 0 0',
  fontSize: '1.45rem',
  lineHeight: 1.08,
  color: '#2d2520',
};

const heroCopyStyle: CSSProperties = {
  margin: '0.62rem 0 0',
  maxWidth: '72ch',
  color: 'rgba(45, 37, 32, 0.82)',
};

const channelGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: '0.75rem',
};

const cardStyle: CSSProperties = {
  borderRadius: '12px',
  border: '1px solid rgba(255, 255, 255, 0.65)',
  background: 'rgba(255, 255, 255, 0.06)',
  padding: '0.8rem',
  textAlign: 'left',
};

const cardNameStyle: CSSProperties = {
  margin: 0,
  fontSize: '0.94rem',
  fontWeight: 700,
  letterSpacing: '0.05em',
  color: '#2d2520',
};

const cardSubStyle: CSSProperties = {
  margin: '0.2rem 0 0',
  fontSize: '0.72rem',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  color: 'rgba(45, 37, 32, 0.66)',
};

const cardDetailStyle: CSSProperties = {
  margin: '0.56rem 0 0',
  fontSize: '0.82rem',
  color: 'rgba(45, 37, 32, 0.8)',
};

const cardButtonStyle: CSSProperties = {
  marginTop: '0.65rem',
  borderRadius: '8px',
  border: '1px solid rgba(255,255,255,0.5)',
  background: 'rgba(255,255,255,0.12)',
  backdropFilter: 'blur(12px)',
  padding: '0.36rem 0.56rem',
  fontSize: '0.73rem',
  fontWeight: 600,
  color: '#2d2520',
  cursor: 'pointer',
};

const placeholderStyle: CSSProperties = {
  borderRadius: '12px',
  border: '1px dashed rgba(120, 90, 60, 0.35)',
  background: 'rgba(255,255,255,0.08)',
  padding: '0.95rem',
};

const placeholderTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: '1.1rem',
  letterSpacing: '0.04em',
  color: '#2d2520',
};

const placeholderCopyStyle: CSSProperties = {
  margin: '0.45rem 0 0',
  color: 'rgba(45, 37, 32, 0.8)',
};

const backButtonStyle: CSSProperties = {
  marginTop: '0.7rem',
  borderRadius: '8px',
  border: '1px solid rgba(255,255,255,0.5)',
  background: 'rgba(255,255,255,0.12)',
  backdropFilter: 'blur(12px)',
  padding: '0.36rem 0.58rem',
  fontSize: '0.73rem',
  fontWeight: 600,
  color: '#2d2520',
  cursor: 'pointer',
};

const LABEL_BY_CHANNEL: Record<Exclude<SiteChannel, null>, string> = {
  home: 'HOME',
  me: 'ME.EXE',
  you: 'YOU.EXE',
  third: 'THIRD.EXE',
};

/** Wrapper that registers its own glass region. */
function GlassCard({
  channel,
  onSelect,
}: {
  channel: ChannelCard;
  onSelect: (id: ChannelCard['id']) => void;
}): JSX.Element {
  const ref = useRef<HTMLElement>(null);
  useGlassRegion(ref, { radius: 12 });

  return (
    <article ref={ref} style={cardStyle}>
      <p style={cardNameStyle}>{channel.name}</p>
      <p style={cardSubStyle}>{channel.subtitle}</p>
      <p style={cardDetailStyle}>{channel.detail}</p>
      <button type="button" style={cardButtonStyle} onClick={() => onSelect(channel.id)}>
        Enter {channel.name}
      </button>
    </article>
  );
}

export function ChannelSurface({ activeChannel, onSelectChannel }: ChannelSurfaceProps): JSX.Element {
  const activeLabel = activeChannel === null ? 'HOME' : LABEL_BY_CHANNEL[activeChannel];

  const viewportRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  useGlassRegion(viewportRef, { radius: 18 });
  useGlassRegion(heroRef, { radius: 14 });

  return (
    <section ref={viewportRef} style={viewportStyle}>
      <div ref={heroRef} style={heroStyle}>
        <p style={heroKickerStyle}>Site Shell</p>
        <h1 style={heroTitleStyle}>Liquid Glass Channel Surface</h1>
        <p style={heroCopyStyle}>
          Visitors land on this light glass channel surface first. Channel internals are isolated
          and mount only after explicit entry. Active channel: {activeLabel}.
        </p>
      </div>

      {activeChannel === 'home' || activeChannel === null ? (
        <div style={channelGridStyle}>
          {CHANNELS.map((channel) => (
            <GlassCard key={channel.id} channel={channel} onSelect={onSelectChannel} />
          ))}
        </div>
      ) : (
        <section style={placeholderStyle}>
          <h2 style={placeholderTitleStyle}>{activeLabel} placeholder</h2>
          <p style={placeholderCopyStyle}>
            Channel runtime remains isolated and is not mounted in SITE-SHELL-01.
          </p>
          <button type="button" style={backButtonStyle} onClick={() => onSelectChannel('home')}>
            Back to HOME
          </button>
        </section>
      )}
    </section>
  );
}
