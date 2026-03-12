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
};

export function HomeChannel({ onNavigate }: HomeChannelProps): ReactElement {
  return (
    <section aria-label="Home" className="homeChannel">
      <header className="homeIntro">
        <p className="homeKicker">NEOS HOME</p>
        <h1 className="homeTitle">Choose A Surface</h1>
        <p className="homeCopy">
          Start from the channel that matches your intent. ME.EXE contains the
          OS environment. YOU.EXE and THIRD.EXE remain independent surfaces.
        </p>
      </header>

      <div className="homeGrid">
        {DESKTOP_PANEL_PREVIEWS.map((panel) => (
          <DesktopPanel
            key={panel.id}
            panel={panel}
            onOpenPanel={(appId) => {
              const channel = PANEL_CHANNEL_MAP[appId];
              if (channel) {
                onNavigate(channel);
              }
            }}
          />
        ))}
      </div>
    </section>
  );
}
