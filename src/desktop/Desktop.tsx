import type { CSSProperties, JSX } from 'react';
import { SHELL_Z_INDEX, TASKBAR_HEIGHT_PX } from '../core/types';
import { WindowLayer } from '../windowing/WindowLayer';
import { BootSequence } from './BootSequence';
import { Launcher } from './Launcher';
import { Taskbar } from './Taskbar';
import { useDesktopStore } from './desktopStore';
import { Wallpaper } from './Wallpaper';

const desktopStyle: CSSProperties = {
  position: 'relative',
  width: '100vw',
  height: '100vh',
  overflow: 'hidden',
  userSelect: 'none',
};

const previewSurfaceStyle: CSSProperties = {
  position: 'absolute',
  inset: 0,
  zIndex: SHELL_Z_INDEX.DESKTOP_ICONS,
  display: 'flex',
  alignItems: 'flex-start',
  padding: '1.25rem',
  paddingBottom: `calc(${TASKBAR_HEIGHT_PX}px + 1.25rem)`,
  pointerEvents: 'none',
};

const previewBadgeStyle: CSSProperties = {
  border: '1px dashed rgba(255, 255, 255, 0.32)',
  borderRadius: '8px',
  padding: '0.45rem 0.75rem',
  fontSize: '0.78rem',
  color: 'rgba(238, 245, 255, 0.82)',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
};

export function Desktop(): JSX.Element {
  const bootComplete = useDesktopStore((store) => store.bootComplete);
  const launcherOpen = useDesktopStore((store) => store.launcherOpen);
  const closeLauncher = useDesktopStore((store) => store.closeLauncher);

  const onPlaceholderLaunch = (id: string): void => {
    window.console.info(`[launcher-placeholder] ${id}`);
    closeLauncher();
  };

  return (
    <main aria-label="Desktop shell" style={desktopStyle}>
      <Wallpaper />

      <div aria-hidden="true" style={previewSurfaceStyle}>
        <span style={previewBadgeStyle}>Desktop Preview Surface</span>
      </div>

      <WindowLayer />
      <Taskbar />
      {launcherOpen ? (
        <Launcher onClose={closeLauncher} onPlaceholderLaunch={onPlaceholderLaunch} />
      ) : null}
      {!bootComplete ? <BootSequence /> : null}
    </main>
  );
}
