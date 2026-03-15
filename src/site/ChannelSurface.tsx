import { useRef, useState, type CSSProperties, type JSX } from 'react';
import { ConnectChannel } from '../apps/connect-exe/ConnectChannel';
import { useGlassRegion } from './glass/useGlassRegion';
import type { SiteChannel } from './siteStore';

// Glass hierarchy:
// - Heavy WebGL glass: navbar (SiteShell), hero card — navigation + cinematic showcase
// - CSS support glass: intro, stack cards, placeholder — support material, lighter frost
// - Readability veils: frosted backing behind text inside heavy glass surfaces

interface ChannelSurfaceProps {
  activeChannel: SiteChannel;
  onSelectChannel(channel: SiteChannel): void;
}

interface ChannelCard {
  id: Exclude<SiteChannel, null | 'home'>;
  name: string;
  subtitle: string;
  summary: string;
  detail: string;
  status: string;
  note: string;
}

const CHANNELS: ChannelCard[] = [
  {
    id: 'me',
    name: 'ME.EXE',
    subtitle: 'OS channel',
    summary: 'Desktop shell, apps, and the full operating-system metaphor live here.',
    detail:
      'Phase 2 mounts the preserved desktop/windowing code inside this channel only. The site shell remains a lightweight entry surface.',
    status: 'Phase 2 target',
    note: 'Windowing, taskbar, launcher, VFS, and system apps stay isolated until explicit entry.',
  },
  {
    id: 'you',
    name: 'YOU.EXE',
    subtitle: 'Social channel',
    summary: 'Message-board and communication surface reserved for its own runtime.',
    detail:
      'The site root can preview this channel, but no social runtime mounts here. The channel will own its own boot, state, and interaction model.',
    status: 'Phase 3 frozen',
    note: 'No shared state crosses from the site shell into the future YOU.EXE runtime.',
  },
  {
    id: 'third',
    name: 'THIRD.EXE',
    subtitle: '3D channel',
    summary: 'World-building and spatial experiments remain isolated behind explicit entry.',
    detail:
      'Heavy rendering work belongs to THIRD.EXE itself, not to the site root. The home surface only advertises the direction and keeps the shell lightweight.',
    status: 'Phase 3 frozen',
    note: 'WebGL at site level stays limited to the background glass renderer and never boots a full channel runtime.',
  },
];

const viewportStyle: CSSProperties = {
  position: 'relative',
  zIndex: 1,
  flex: 1,
  minHeight: 0,
  padding: '0.25rem',
  display: 'grid',
  alignContent: 'start',
  gap: '1rem',
};

const introStyle: CSSProperties = {
  border: '1px solid rgba(255, 255, 255, 0.62)',
  borderRadius: '18px',
  background: 'rgba(255, 255, 255, 0.14)',
  backdropFilter: 'blur(16px) saturate(1.3)',
  WebkitBackdropFilter: 'blur(16px) saturate(1.3)',
  padding: '1rem 1.05rem',
};

const introKickerStyle: CSSProperties = {
  margin: 0,
  fontSize: '0.74rem',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: 'rgba(45, 37, 32, 0.7)',
};

const introTitleStyle: CSSProperties = {
  margin: '0.35rem 0 0',
  fontSize: 'clamp(1.55rem, 4vw, 2.6rem)',
  lineHeight: 1.02,
  color: '#2d2520',
  maxWidth: '12ch',
};

const introCopyStyle: CSSProperties = {
  margin: '0.72rem 0 0',
  maxWidth: '72ch',
  color: 'rgba(45, 37, 32, 0.82)',
};

const introMetaStyle: CSSProperties = {
  margin: '0.85rem 0 0',
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.45rem',
};

const introBadgeStyle: CSSProperties = {
  borderRadius: '999px',
  border: '1px solid rgba(255,255,255,0.55)',
  background: 'rgba(255,255,255,0.16)',
  padding: '0.32rem 0.56rem',
  fontSize: '0.72rem',
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  color: '#2d2520',
};

const homeLayoutStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '1rem',
  alignItems: 'stretch',
};

const heroCardStyle: CSSProperties = {
  flex: '1 1 42rem',
  borderRadius: '22px',
  border: '1px solid rgba(255,255,255,0.68)',
  background: 'rgba(255, 255, 255, 0.04)',
  padding: '1.1rem',
  display: 'grid',
  gap: '1rem',
  minHeight: '25rem',
};

/* Readability veil: frosted backing behind text blocks inside glass surfaces.
   Ensures text stays legible while surrounding glass refracts freely. */
const readabilityVeilStyle: CSSProperties = {
  borderRadius: '14px',
  background: 'rgba(255, 255, 255, 0.18)',
  backdropFilter: 'blur(18px) saturate(1.4)',
  WebkitBackdropFilter: 'blur(18px) saturate(1.4)',
  padding: '0.9rem 1rem',
};

const heroHeaderStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: '0.9rem',
  alignItems: 'flex-start',
  flexWrap: 'wrap',
};

const heroEyebrowStyle: CSSProperties = {
  margin: 0,
  fontSize: '0.76rem',
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
  color: 'rgba(45, 37, 32, 0.68)',
};

const heroNameStyle: CSSProperties = {
  margin: '0.4rem 0 0',
  fontSize: 'clamp(1.7rem, 4.5vw, 3.4rem)',
  lineHeight: 0.95,
  color: '#2d2520',
};

const heroSubStyle: CSSProperties = {
  margin: '0.4rem 0 0',
  fontSize: '0.82rem',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: 'rgba(45, 37, 32, 0.72)',
};

const heroSummaryStyle: CSSProperties = {
  margin: 0,
  fontSize: 'clamp(1.1rem, 2.4vw, 1.45rem)',
  lineHeight: 1.2,
  color: '#2d2520',
  maxWidth: '30rem',
};

const heroDetailStyle: CSSProperties = {
  margin: 0,
  color: 'rgba(45, 37, 32, 0.82)',
  maxWidth: '38rem',
};

const heroFooterStyle: CSSProperties = {
  display: 'grid',
  gap: '0.9rem',
  marginTop: 'auto',
};

const heroStatusRowStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.55rem',
};

const heroStatusChipStyle: CSSProperties = {
  borderRadius: '999px',
  border: '1px solid rgba(255,255,255,0.58)',
  background: 'rgba(255,255,255,0.18)',
  padding: '0.38rem 0.7rem',
  fontSize: '0.74rem',
  color: '#2d2520',
};

const heroActionRowStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.65rem',
};

const primaryButtonStyle: CSSProperties = {
  borderRadius: '999px',
  border: '1px solid rgba(255,255,255,0.62)',
  background: 'rgba(255,255,255,0.18)',
  backdropFilter: 'blur(12px)',
  padding: '0.58rem 0.92rem',
  fontSize: '0.76rem',
  fontWeight: 700,
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  color: '#2d2520',
  cursor: 'pointer',
};

const secondaryButtonStyle: CSSProperties = {
  ...primaryButtonStyle,
  background: 'rgba(255,255,255,0.1)',
  fontWeight: 600,
};

const stackStyle: CSSProperties = {
  flex: '1 1 18rem',
  display: 'grid',
  gap: '0.82rem',
};

const stackIntroStyle: CSSProperties = {
  borderRadius: '18px',
  border: '1px solid rgba(255,255,255,0.62)',
  background: 'rgba(255,255,255,0.12)',
  backdropFilter: 'blur(16px) saturate(1.3)',
  WebkitBackdropFilter: 'blur(16px) saturate(1.3)',
  padding: '0.95rem',
  color: 'rgba(45, 37, 32, 0.82)',
};

const stackCardStyle: CSSProperties = {
  borderRadius: '18px',
  border: '1px solid rgba(255,255,255,0.62)',
  background: 'rgba(255,255,255,0.12)',
  backdropFilter: 'blur(16px) saturate(1.3)',
  WebkitBackdropFilter: 'blur(16px) saturate(1.3)',
  padding: '0.95rem',
  display: 'grid',
  gap: '0.72rem',
  textAlign: 'left',
};

const stackCardActiveStyle: CSSProperties = {
  borderColor: 'rgba(255,255,255,0.84)',
  background: 'rgba(255,255,255,0.16)',
};

const stackCardTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: '1rem',
  fontWeight: 700,
  color: '#2d2520',
};

const stackCardSubStyle: CSSProperties = {
  margin: '0.18rem 0 0',
  fontSize: '0.72rem',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  color: 'rgba(45, 37, 32, 0.66)',
};

const stackCardCopyStyle: CSSProperties = {
  margin: 0,
  fontSize: '0.84rem',
  color: 'rgba(45, 37, 32, 0.8)',
};

const stackCardActionRowStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.55rem',
};

const placeholderStyle: CSSProperties = {
  borderRadius: '20px',
  border: '1px solid rgba(255,255,255,0.66)',
  background: 'rgba(255,255,255,0.12)',
  backdropFilter: 'blur(16px) saturate(1.3)',
  WebkitBackdropFilter: 'blur(16px) saturate(1.3)',
  padding: '1.1rem',
  display: 'grid',
  gap: '0.75rem',
};

const placeholderTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 'clamp(1.4rem, 3vw, 2.1rem)',
  lineHeight: 1.05,
  color: '#2d2520',
};

const placeholderCopyStyle: CSSProperties = {
  margin: 0,
  maxWidth: '44rem',
  color: 'rgba(45, 37, 32, 0.82)',
};

const LABEL_BY_CHANNEL: Record<Exclude<SiteChannel, null>, string> = {
  home: 'HOME',
  me: 'ME.EXE',
  you: 'YOU.EXE',
  third: 'THIRD.EXE',
  connect: 'CONNECT.EXE',
};

function GlassCard({
  channel,
  isFeatured,
  onPromote,
  onEnter,
}: {
  channel: ChannelCard;
  isFeatured: boolean;
  onPromote: (id: ChannelCard['id']) => void;
  onEnter: (id: ChannelCard['id']) => void;
}): JSX.Element {
  // Stack cards use CSS glass (support tier), not heavy WebGL glass
  return (
    <article style={{ ...stackCardStyle, ...(isFeatured ? stackCardActiveStyle : {}) }}>
      <div>
        <p style={stackCardTitleStyle}>{channel.name}</p>
        <p style={stackCardSubStyle}>{channel.subtitle}</p>
      </div>
      <p style={stackCardCopyStyle}>{channel.summary}</p>
      <div style={stackCardActionRowStyle}>
        <button type="button" style={secondaryButtonStyle} onClick={() => onPromote(channel.id)}>
          {isFeatured ? 'Featured' : 'Promote'}
        </button>
        <button type="button" style={primaryButtonStyle} onClick={() => onEnter(channel.id)}>
          Enter
        </button>
      </div>
    </article>
  );
}

function ChannelPlaceholder({
  activeLabel,
  activeChannel,
  featuredChannelId,
  onGoHome,
  onFeatureChannel,
}: {
  activeLabel: string;
  activeChannel: Exclude<SiteChannel, null | 'home'>;
  featuredChannelId: ChannelCard['id'];
  onGoHome: () => void;
  onFeatureChannel: (id: ChannelCard['id']) => void;
}): JSX.Element {
  // Placeholder uses CSS glass (support tier), not heavy WebGL
  return (
    <section style={placeholderStyle}>
      <p style={introKickerStyle}>Channel entry</p>
      <h2 style={placeholderTitleStyle}>{activeLabel} placeholder</h2>
      <p style={placeholderCopyStyle}>
        {activeLabel} is selected, but its live runtime is still isolated from the site root.
        SITE-SHELL can route into the channel and describe it, but it does not mount the channel
        internals here.
      </p>
      <div style={heroStatusRowStyle}>
        <span style={heroStatusChipStyle}>No desktop at site root</span>
        <span style={heroStatusChipStyle}>No shared runtime state</span>
        <span style={heroStatusChipStyle}>Back returns to HOME</span>
      </div>
      <div style={heroActionRowStyle}>
        <button type="button" style={primaryButtonStyle} onClick={onGoHome}>
          Back to HOME
        </button>
        <button
          type="button"
          style={secondaryButtonStyle}
          onClick={() => onFeatureChannel(activeChannel ?? featuredChannelId)}
        >
          Feature {activeLabel}
        </button>
      </div>
    </section>
  );
}

export function ChannelSurface({ activeChannel, onSelectChannel }: ChannelSurfaceProps): JSX.Element {
  const [featuredChannelId, setFeaturedChannelId] = useState<ChannelCard['id']>('me');

  const viewportRef = useRef<HTMLElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  // Only the hero gets heavy WebGL glass — viewport and intro use CSS glass (support tier)
  // This avoids glass-on-glass which Apple's guidelines warn against
  useGlassRegion(heroRef, { radius: 22 });

  const featuredChannel =
    CHANNELS.find((channel) => channel.id === featuredChannelId) ?? CHANNELS[0];
  const stackChannels = CHANNELS.filter((channel) => channel.id !== featuredChannel.id);
  const activeLabel = activeChannel === null ? 'HOME' : LABEL_BY_CHANNEL[activeChannel];

  return (
    <section ref={viewportRef} style={viewportStyle}>
      <div ref={introRef} style={introStyle}>
        <p style={introKickerStyle}>Site Shell</p>
        <h1 style={introTitleStyle}>Liquid Glass Channel Surface</h1>
        <p style={introCopyStyle}>
          The root experience is a lightweight warm-neutral channel surface. It previews entry
          points, but channel internals remain isolated and mount only after explicit selection.
        </p>
        <div style={introMetaStyle}>
          <span style={introBadgeStyle}>Active: {activeLabel}</span>
          <span style={introBadgeStyle}>Lane: SITE-SHELL</span>
          <span style={introBadgeStyle}>Runtime isolation locked</span>
        </div>
      </div>

      {activeChannel === 'connect' ? (
        <ConnectChannel />
      ) : activeChannel === 'home' || activeChannel === null ? (
        <div style={homeLayoutStyle}>
          <article ref={heroRef} style={heroCardStyle}>
            {/* Readability veil wraps the header text */}
            <header style={{ ...heroHeaderStyle, ...readabilityVeilStyle }}>
              <div>
                <p style={heroEyebrowStyle}>Featured channel</p>
                <h2 style={heroNameStyle}>{featuredChannel.name}</h2>
                <p style={heroSubStyle}>{featuredChannel.subtitle}</p>
              </div>
              <span style={heroStatusChipStyle}>{featuredChannel.status}</span>
            </header>

            {/* Readability veil wraps the body text */}
            <div style={{ ...readabilityVeilStyle, display: 'grid', gap: '0.72rem' }}>
              <p style={heroSummaryStyle}>{featuredChannel.summary}</p>
              <p style={heroDetailStyle}>{featuredChannel.detail}</p>
            </div>

            {/* Readability veil wraps the footer */}
            <div style={{ ...heroFooterStyle, ...readabilityVeilStyle }}>
              <div style={heroStatusRowStyle}>
                <span style={heroStatusChipStyle}>Explicit entry only</span>
                <span style={heroStatusChipStyle}>No shared channel state</span>
                <span style={heroStatusChipStyle}>Site-level glass only</span>
              </div>
              <p style={{ margin: 0, color: 'rgba(45, 37, 32, 0.76)' }}>{featuredChannel.note}</p>
              <div style={heroActionRowStyle}>
                <button
                  type="button"
                  style={primaryButtonStyle}
                  onClick={() => onSelectChannel(featuredChannel.id)}
                >
                  Enter {featuredChannel.name}
                </button>
                <button
                  type="button"
                  style={secondaryButtonStyle}
                  onClick={() => setFeaturedChannelId(stackChannels[0]?.id ?? featuredChannel.id)}
                >
                  Rotate stack
                </button>
              </div>
            </div>
          </article>

          <div style={stackStyle}>
            <section style={stackIntroStyle}>
              <p style={{ ...introKickerStyle, marginBottom: '0.34rem' }}>Channel stack</p>
              <p style={{ margin: 0 }}>
                Promote a channel to the hero card or enter it directly. The root remains a routing
                surface rather than a runtime host.
              </p>
            </section>

            {stackChannels.map((channel) => (
              <GlassCard
                key={channel.id}
                channel={channel}
                isFeatured={false}
                onPromote={setFeaturedChannelId}
                onEnter={onSelectChannel}
              />
            ))}
          </div>
        </div>
      ) : (
        <ChannelPlaceholder
          activeLabel={activeLabel}
          activeChannel={activeChannel}
          featuredChannelId={featuredChannel.id}
          onGoHome={() => onSelectChannel('home')}
          onFeatureChannel={setFeaturedChannelId}
        />
      )}
    </section>
  );
}
