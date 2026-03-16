import type { ReactElement } from 'react';
import { faHouse as faHouseRegular } from '@fortawesome/free-regular-svg-icons';
import { faHouse as faHouseSolid } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSiteStore } from './siteStore';
import type { SiteChannel } from './siteStore';
import './SiteNav.css';

interface ChannelEntry {
  id: SiteChannel;
  label: string;
  disabled?: boolean;
  icon?: 'house';
}

const CHANNELS: ChannelEntry[] = [
  { id: 'home', label: 'HOME', icon: 'house' },
  { id: 'me', label: 'ME.EXE' },
  { id: 'you', label: 'YOU.EXE' },
  { id: 'third', label: 'THIRD.EXE' },
  { id: 'connect', label: 'CONNECT.EXE', disabled: true },
];

export function SiteNav(): ReactElement {
  const activeChannel = useSiteStore((s) => s.activeChannel);
  const setChannel = useSiteStore((s) => s.setChannel);

  return (
    <nav className="siteNav" aria-label="Site navigation">
      <span className="siteNav-brand">NEOS</span>

      <div className="siteNav-channels">
        {CHANNELS.map((ch) => {
          const isActive = activeChannel === ch.id;
          return (
            <button
              key={ch.id}
              type="button"
              className={`siteNav-tab${isActive ? ' siteNav-tab--active' : ''}${ch.disabled ? ' siteNav-tab--disabled' : ''}`}
              aria-current={isActive ? 'page' : undefined}
              aria-disabled={ch.disabled || undefined}
              onClick={() => !ch.disabled && setChannel(ch.id)}
            >
              {ch.icon === 'house' ? (
                <>
                  <FontAwesomeIcon
                    icon={isActive ? faHouseSolid : faHouseRegular}
                    className="siteNav-tabIcon"
                  />
                  <span className="srOnly">{ch.label}</span>
                </>
              ) : (
                ch.label
              )}
            </button>
          );
        })}
      </div>

      <span className="siteNav-status" aria-live="polite">
        {CHANNELS.find((ch) => ch.id === activeChannel)?.label ?? ''}
      </span>
    </nav>
  );
}
