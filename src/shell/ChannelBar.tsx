import type { ReactElement } from 'react';

export type ChannelId = 'home' | 'me' | 'you' | 'third';

interface ChannelBarProps {
  activeChannel: ChannelId;
  onNavigate: (channel: ChannelId) => void;
  onOpenSwitcher: () => void;
}

const CHANNEL_LABELS: Record<ChannelId, string> = {
  home: 'HOME',
  me: 'ME.EXE',
  you: 'YOU.EXE',
  third: 'THIRD.EXE',
};

export function ChannelBar({
  activeChannel,
  onNavigate,
  onOpenSwitcher,
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

      <div className="channelBarMeta">
        <p className="channelBarLabel">Current Channel</p>
        <p className="channelBarValue" aria-live="polite">
          {CHANNEL_LABELS[activeChannel]}
        </p>
        <button
          className="channelSwitchButton"
          type="button"
          onClick={onOpenSwitcher}
        >
          Switch Channels
        </button>
      </div>
    </nav>
  );
}
