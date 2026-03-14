import type { CSSProperties, JSX } from 'react';
import { SHELL_Z_INDEX } from '../core/types';

const windowLayerStyle: CSSProperties = {
  position: 'absolute',
  inset: 0,
  zIndex: SHELL_Z_INDEX.WINDOWS,
  pointerEvents: 'none',
};

export function WindowLayer(): JSX.Element {
  return (
    <div
      aria-label="Window runtime mount point"
      data-shell-layer="windows"
      style={windowLayerStyle}
    />
  );
}
