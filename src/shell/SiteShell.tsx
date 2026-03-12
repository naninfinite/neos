import { useEffect, useState } from 'react';
import type { ReactElement } from 'react';
import { ConnectChannel } from '../apps/connect-exe/ConnectChannel';
import { BootOverlay } from './BootOverlay';
import { ChannelBar } from './ChannelBar';
import type { ChannelId } from './ChannelBar';
import { ChannelSwitcher } from './ChannelSwitcher';
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
    case 'connect':
      return <ConnectChannel />;
    case 'home':
    default:
      return <HomeChannel onNavigate={onNavigate} />;
  }
}

export function SiteShell(): ReactElement {
  const [bootVisible, setBootVisible] = useState(true);
  const [activeChannel, setActiveChannel] = useState<ChannelId>('home');
  const [switcherOpen, setSwitcherOpen] = useState(false);

  useEffect(() => {
    const bootTimer = window.setTimeout(() => setBootVisible(false), BOOT_TIMEOUT_MS);
    return () => window.clearTimeout(bootTimer);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setSwitcherOpen(true);
        return;
      }

      if (event.key === 'Escape') {
        setSwitcherOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navigateTo = (channel: ChannelId) => {
    setActiveChannel(channel);
    setSwitcherOpen(false);
  };

  return (
    <main className="neosShell">
      <div className="wallpaper" aria-hidden="true" />

      <ChannelBar
        activeChannel={activeChannel}
        onNavigate={navigateTo}
        onOpenSwitcher={() => setSwitcherOpen(true)}
      />

      <div className="channelViewport">
        <ChannelView channel={activeChannel} onNavigate={navigateTo} />
      </div>

      {switcherOpen ? (
        <ChannelSwitcher
          activeChannel={activeChannel}
          onClose={() => setSwitcherOpen(false)}
          onNavigate={navigateTo}
        />
      ) : null}

      {bootVisible ? <BootOverlay /> : null}
    </main>
  );
}
