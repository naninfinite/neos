# Stage 1A - First Shell UI Pass

## What we were trying to do

Replace the bootstrap placeholder with a real first-look shell that sets the visual direction for NEOS.

## What changed

- Added a fixed desktop shell canvas with a light liquid-glass wallpaper
- Added a glass-style bottom taskbar with launcher trigger, empty task zone, and live clock
- Added a full-screen launcher overlay with search and grouped placeholder app cards
- Added a 2-second static boot overlay that reveals the shell
- Split the shell into small focused components for incremental growth

## Why this matters

This is the first version that feels like a product shell instead of a scaffolding message.

It establishes:
- a concrete visual language ("liquid glass")
- the first real OS-like landing experience
- a clean baseline for upcoming windowing and runtime work

## In plain English

This step was like replacing a construction sign with an actual lobby.

Before this, NEOS showed a single placeholder card.
After this, it behaves like a desktop shell with a taskbar and launcher flow.

## What the UI looked like

At this stage, the app opens into a bright liquid-glass desktop surface with a glass taskbar and launcher entry point.
No windows are open by default, which keeps the first screen calm and clear.

![Stage 1A shell home](../assets/01-stage-1a/shell-home.png)

## Important code

```tsx
export function DesktopShell(): ReactElement {
  return (
    <main className="neosShell">
      <div className="wallpaper" aria-hidden="true" />
      <section aria-label="Desktop surface" className="desktopSurface" />
      <Taskbar ... />
      {launcherOpen ? <LauncherOverlay apps={launcherApps} onClose={...} /> : null}
      {bootVisible ? <BootOverlay /> : null}
    </main>
  );
}
```

This is the first true shell composition: wallpaper, desktop surface, taskbar, launcher overlay, and boot overlay.
