import type { ReactElement } from 'react';
import { useSiteStore } from './siteStore';
import './ChannelSurface.css';

function HomeSurface(): ReactElement {
  return (
    <section className="channelSurface-content">
      <p className="channelSurface-kicker">HOME</p>
      <h1 className="channelSurface-title">Welcome to NEOS</h1>
      <p className="channelSurface-copy">
        A channel surface for exploring the NEOS ecosystem. Select a channel
        from the navigation bar above to begin.
      </p>
    </section>
  );
}

function ChannelPlaceholder({ name }: { name: string }): ReactElement {
  return (
    <section className="channelSurface-content">
      <p className="channelSurface-kicker">Channel</p>
      <h1 className="channelSurface-title">{name}</h1>
      <p className="channelSurface-copy">
        This channel is not yet active. Its runtime will mount here once
        implementation begins.
      </p>
      <span className="channelSurface-badge">Coming soon</span>
    </section>
  );
}

const CHANNEL_NAMES: Record<string, string> = {
  me: 'ME.EXE',
  you: 'YOU.EXE',
  third: 'THIRD.EXE',
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
