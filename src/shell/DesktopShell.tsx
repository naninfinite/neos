import { useEffect, useMemo, useState } from 'react';
import type { ReactElement } from 'react';
import { BootOverlay } from './BootOverlay';
import { LauncherOverlay } from './LauncherOverlay';
import { MOCK_LAUNCHER_APPS } from './mockApps';
import { Taskbar } from './Taskbar';

const BOOT_TIMEOUT_MS = 2_000;

function formatClock(now: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(now);
}

export function DesktopShell(): ReactElement {
  const [bootVisible, setBootVisible] = useState(true);
  const [launcherOpen, setLauncherOpen] = useState(false);
  const [clockLabel, setClockLabel] = useState(() => formatClock(new Date()));

  useEffect(() => {
    const bootTimer = window.setTimeout(() => setBootVisible(false), BOOT_TIMEOUT_MS);
    return () => window.clearTimeout(bootTimer);
  }, []);

  useEffect(() => {
    const updateClock = () => setClockLabel(formatClock(new Date()));
    updateClock();
    const clockTicker = window.setInterval(updateClock, 15_000);
    return () => window.clearInterval(clockTicker);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.code === 'Space') {
        event.preventDefault();
        setLauncherOpen(true);
        return;
      }

      if (event.key === 'Escape') {
        setLauncherOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const launcherApps = useMemo(() => MOCK_LAUNCHER_APPS, []);

  return (
    <main className="neosShell">
      <div className="wallpaper" aria-hidden="true" />
      <section aria-label="Desktop surface" className="desktopSurface" />

      <Taskbar
        clockLabel={clockLabel}
        launcherOpen={launcherOpen}
        onToggleLauncher={() => setLauncherOpen((current) => !current)}
      />

      {launcherOpen ? (
        <LauncherOverlay apps={launcherApps} onClose={() => setLauncherOpen(false)} />
      ) : null}

      {bootVisible ? <BootOverlay /> : null}
    </main>
  );
}
