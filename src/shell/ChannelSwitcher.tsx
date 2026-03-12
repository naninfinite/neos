import type { ReactElement } from 'react';
import type { ChannelId } from './ChannelBar';

interface ChannelSwitcherProps {
  activeChannel: ChannelId;
  onClose: () => void;
  onNavigate: (channel: ChannelId) => void;
}

const CHANNELS: Array<{ id: ChannelId; name: string; detail: string }> = [
  { id: 'home', name: 'HOME', detail: 'Landing hub and channel previews' },
  { id: 'me', name: 'ME.EXE', detail: 'Contained OS environment' },
  { id: 'you', name: 'YOU.EXE', detail: 'Message board surface' },
  { id: 'third', name: 'THIRD.EXE', detail: '3D workspace surface' },
];

export function ChannelSwitcher({
  activeChannel,
  onClose,
  onNavigate,
}: ChannelSwitcherProps): ReactElement {
  return (
    <section
      className="channelSwitcherBackdrop"
      role="presentation"
      onClick={onClose}
    >
      <div
        aria-label="Channel switcher"
        aria-modal="true"
        className="channelSwitcher"
        role="dialog"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="channelSwitcherHeader">
          <p className="channelSwitcherLabel">Quick Switch</p>
          <button className="channelSwitcherClose" type="button" onClick={onClose}>
            Close
          </button>
        </header>

        <div className="channelSwitcherGrid">
          {CHANNELS.map((channel) => (
            <button
              key={channel.id}
              className={`channelSwitcherCard${channel.id === activeChannel ? ' channelSwitcherCardActive' : ''}`}
              type="button"
              onClick={() => onNavigate(channel.id)}
            >
              <span className="channelSwitcherName">{channel.name}</span>
              <span className="channelSwitcherDetail">{channel.detail}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
