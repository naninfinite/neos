import { useEffect, useState } from 'react';
import type { ReactElement } from 'react';
import { BootOverlay } from './BootOverlay';
import { ChannelBar } from './ChannelBar';
import type { ChannelId } from './ChannelBar';
import { HomeChannel } from './HomeChannel';
import { MeChannel } from './MeChannel';

const BOOT_TIMEOUT_MS = 2_000;

function ChannelView({
  channel,
  onNavigate,
}: {
  channel: ChannelId;
  onNavigate: (ch: ChannelId) => void;
}): ReactElement {
  switch (channel) {
    case 'me':
      return <MeChannel />;
    case 'you':
      return (
        <section aria-label="YOU.EXE" className="channelPlaceholder">
          <p className="channelPlaceholderTitle">YOU.EXE</p>
          <p className="channelPlaceholderDetail">Message board — coming soon.</p>
        </section>
      );
    case 'third':
      return (
        <section aria-label="THIRD.EXE" className="channelPlaceholder">
          <p className="channelPlaceholderTitle">THIRD.EXE</p>
          <p className="channelPlaceholderDetail">3D workspace — coming soon.</p>
        </section>
      );
    case 'home':
    default:
      return <HomeChannel onNavigate={onNavigate} />;
  }
}

export function SiteShell(): ReactElement {
  const [bootVisible, setBootVisible] = useState(true);
  const [activeChannel, setActiveChannel] = useState<ChannelId>('home');

  useEffect(() => {
    const bootTimer = window.setTimeout(() => setBootVisible(false), BOOT_TIMEOUT_MS);
    return () => window.clearTimeout(bootTimer);
  }, []);

  return (
    <main className="neosShell">
      <div className="wallpaper" aria-hidden="true" />

      <ChannelBar activeChannel={activeChannel} onNavigate={setActiveChannel} />

      <div className="channelViewport">
        <ChannelView channel={activeChannel} onNavigate={setActiveChannel} />
      </div>

      {bootVisible ? <BootOverlay /> : null}
    </main>
  );
}
