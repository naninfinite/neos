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
  home: 'home',
};

export function HomeChannel({ onNavigate }: HomeChannelProps): ReactElement {
  return (
    <section aria-label="Home" className="homeChannel">
      <div className="homeGrid">
        {DESKTOP_PANEL_PREVIEWS.filter((p) => p.appId !== 'home').map((panel) => (
          <DesktopPanel
            key={panel.id}
            panel={panel}
            onOpenPanel={(appId) => {
              const channel = PANEL_CHANNEL_MAP[appId];
              if (channel) onNavigate(channel);
            }}
          />
        ))}
      </div>
    </section>
  );
}
