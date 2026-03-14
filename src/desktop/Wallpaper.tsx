import type { CSSProperties, JSX } from 'react';
import { SHELL_Z_INDEX } from '../core/types';

const wallpaperStyle: CSSProperties = {
  position: 'absolute',
  inset: 0,
  zIndex: SHELL_Z_INDEX.WALLPAPER,
  background:
    'radial-gradient(circle at 12% 18%, rgba(255, 160, 122, 0.24), transparent 42%), radial-gradient(circle at 82% 75%, rgba(95, 163, 255, 0.20), transparent 46%), linear-gradient(155deg, #0b0f1f 0%, #121a34 48%, #1f2a4d 100%)',
};

export function Wallpaper(): JSX.Element {
  return <div aria-hidden="true" style={wallpaperStyle} />;
}
