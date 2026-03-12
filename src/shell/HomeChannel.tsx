import { useState } from 'react';
import type { ReactElement } from 'react';
import { DesktopPanel } from './DesktopPanel';
import { DESKTOP_PANEL_PREVIEWS } from './desktopPanels';
import type { ChannelId } from './ChannelBar';

interface HomeChannelProps {
  onNavigate: (channel: ChannelId) => void;
}

const PANEL_CHANNEL_MAP: Record<string, ChannelId> = {
  me: 'me',
  you: 'you',
  third: 'third',
  connect: 'connect',
};

export function HomeChannel({ onNavigate }: HomeChannelProps): ReactElement {
  const [heroAppId, setHeroAppId] = useState('me');

  const heroPanel = DESKTOP_PANEL_PREVIEWS.find((p) => p.appId === heroAppId);
  const dockPanels = DESKTOP_PANEL_PREVIEWS.filter((p) => p.appId !== heroAppId);

  const handlePromote = (appId: string) => {
    setHeroAppId(appId);
  };

  const handleOpen = (appId: string) => {
    const channel = PANEL_CHANNEL_MAP[appId];
    if (channel) {
      onNavigate(channel);
    }
  };

  return (
    <section aria-label="Home" className="homeChannel">
      <header className="homeIntro">
        <p className="homeKicker">NEOS HOME</p>
        <h1 className="homeTitle">Choose A Surface</h1>
        <p className="homeCopy">
          Start from the channel that matches your intent. ME.EXE contains the
          OS environment. YOU.EXE, THIRD.EXE, and CONNECT.EXE remain independent
          surfaces.
        </p>
      </header>

      <div className="homeHeroSection">
        {heroPanel && (
          <DesktopPanel
            panel={heroPanel}
            isHero={true}
            onOpenPanel={handleOpen}
          />
        )}
      </div>

      <div className="homeDock">
        {dockPanels.map((panel) => (
          <DesktopPanel
            key={panel.id}
            panel={panel}
            isHero={false}
            onOpenPanel={handleOpen}
            onPromote={handlePromote}
          />
        ))}
      </div>
    </section>
  );
}
