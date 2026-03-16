import { useState, type ReactElement } from 'react';
import { useSiteStore } from './siteStore';
import type { SiteChannel } from './siteStore';
import './ChannelSurface.css';

interface ChannelInfo {
  id: Exclude<SiteChannel, 'home' | null>;
  name: string;
  subtitle: string;
  description: string;
  disabled?: boolean;
}

const CHANNELS: ChannelInfo[] = [
  {
    id: 'me',
    name: 'ME.EXE',
    subtitle: 'OS channel',
    description:
      'Desktop shell, apps, and the full operating-system metaphor. Windowing, taskbar, launcher, and system apps live here.',
  },
  {
    id: 'you',
    name: 'YOU.EXE',
    subtitle: 'Social channel',
    description:
      'Message-board and communication surface. Owns its own boot, state, and interaction model.',
  },
  {
    id: 'third',
    name: 'THIRD.EXE',
    subtitle: '3D channel',
    description:
      'World-building and spatial experiments. Heavy rendering and immersive experiences.',
  },
  {
    id: 'connect',
    name: 'CONNECT.EXE',
    subtitle: 'Multiplayer channel',
    description:
      'Real-time multiplayer experiences and shared spaces across the NEOS ecosystem.',
    disabled: true,
  },
];

function HomeSurface(): ReactElement {
  const setChannel = useSiteStore((s) => s.setChannel);
  const [featuredId, setFeaturedId] = useState<ChannelInfo['id']>('me');

  const featured = CHANNELS.find((ch) => ch.id === featuredId) ?? CHANNELS[0];
  const stack = CHANNELS.filter((ch) => ch.id !== featured.id);

  return (
    <section className="homeSurface">
      <article className="homeSurface-hero">
        <div className="homeSurface-heroHeader">
          <p className="homeSurface-kicker">Featured channel</p>
          <h2 className="homeSurface-heroName">{featured.name}</h2>
          <p className="homeSurface-heroSub">{featured.subtitle}</p>
        </div>
        <p className="homeSurface-heroDesc">{featured.description}</p>
        <div className="homeSurface-heroActions">
          {!featured.disabled ? (
            <button
              type="button"
              className="homeSurface-btn homeSurface-btn--primary"
              onClick={() => setChannel(featured.id)}
            >
              Enter {featured.name}
            </button>
          ) : (
            <span className="homeSurface-badge">Coming soon</span>
          )}
        </div>
      </article>

      <div className="homeSurface-stack">
        {stack.map((ch) => (
          <button
            key={ch.id}
            type="button"
            className={`homeSurface-card${ch.disabled ? ' homeSurface-card--disabled' : ''}`}
            onClick={() => !ch.disabled && setFeaturedId(ch.id)}
          >
            <h3 className="homeSurface-cardName">{ch.name}</h3>
            <p className="homeSurface-cardSub">{ch.subtitle}</p>
            <p className="homeSurface-cardDesc">{ch.description}</p>
            {ch.disabled && <span className="homeSurface-badge">Coming soon</span>}
          </button>
        ))}
      </div>
    </section>
  );
}

function ChannelPlaceholder({ name }: { name: string }): ReactElement {
  const setChannel = useSiteStore((s) => s.setChannel);

  return (
    <section className="channelSurface-content">
      <p className="channelSurface-kicker">Channel</p>
      <h1 className="channelSurface-title">{name}</h1>
      <p className="channelSurface-copy">
        This channel is not yet active. Its runtime will mount here once
        implementation begins.
      </p>
      <button
        type="button"
        className="homeSurface-btn homeSurface-btn--primary"
        onClick={() => setChannel('home')}
      >
        Back to HOME
      </button>
    </section>
  );
}

const CHANNEL_NAMES: Record<string, string> = {
  me: 'ME.EXE',
  you: 'YOU.EXE',
  third: 'THIRD.EXE',
  connect: 'CONNECT.EXE',
};

export function ChannelSurface(): ReactElement {
  const activeChannel = useSiteStore((s) => s.activeChannel);

  return (
    <div className="channelSurface">
      {activeChannel === 'home' || activeChannel === null ? (
        <HomeSurface />
      ) : (
        <ChannelPlaceholder name={CHANNEL_NAMES[activeChannel] ?? activeChannel} />
      )}
    </div>
  );
}
