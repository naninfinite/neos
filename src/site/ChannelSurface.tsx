import type { JSX } from 'react';
import type { SiteChannel } from './siteStore';

interface ChannelSurfaceProps {
  activeChannel: SiteChannel;
  onSelectChannel(channel: SiteChannel): void;
}

export function ChannelSurface(_props: ChannelSurfaceProps): JSX.Element {
  return <section>{/* Channel surface — to be rebuilt */}</section>;
}
