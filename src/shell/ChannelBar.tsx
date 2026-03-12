import type { ReactElement } from 'react';

export type ChannelId = 'home' | 'me' | 'you' | 'third';

interface ChannelBarProps {
  activeChannel: ChannelId;
  onNavigate: (channel: ChannelId) => void;
}

const CHANNELS: { id: ChannelId; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'me', label: 'ME' },
  { id: 'you', label: 'YOU' },
  { id: 'third', label: 'THIRD' },
];

export function ChannelBar({
  activeChannel,
  onNavigate,
}: ChannelBarProps): ReactElement {
  return (
    <nav className="channelBar" aria-label="Site navigation">
      <button
        className="channelBarBrand"
        type="button"
        onClick={() => onNavigate('home')}
      >
        NEOS
      </button>

      <div className="channelBarTabs">
        {CHANNELS.map((ch) => (
          <button
            key={ch.id}
            className={`channelTab${activeChannel === ch.id ? ' channelTabActive' : ''}`}
            type="button"
            aria-current={activeChannel === ch.id ? 'page' : undefined}
            onClick={() => onNavigate(ch.id)}
          >
            {ch.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
