# Stage 1A - First Shell UI Pass

## What we were trying to do

Replace the launcher-first landing with a true desktop-first arrival while keeping a modern Liquid Glass style.

## What changed

- Added a visible desktop panel grid on landing (ME.EXE, YOU.EXE, THIRD.EXE, HOME)
- Kept the glass taskbar and launcher, but moved launcher to secondary access
- Kept the 2-second boot overlay handoff into the desktop
- Updated shell styling to heavy Liquid Glass depth and refraction cues
- Kept panel content as lightweight previews (not running app instances)

## Why this matters

This changed the first impression from "empty desktop" to "project surfaces are visible immediately."

It establishes:
- stronger Terminal-OS identity on first load
- clearer immediate discoverability without opening launcher first
- a clean path to future live previews for YOU.EXE and THIRD.EXE

## In plain English

Before this change, users landed on mostly empty space and had to open the launcher to discover the project.

Now, users see the main surfaces right away as desktop panels, so the system feels alive the moment it appears.

## What the UI looked like

At this stage, the app opens into a panel-based desktop with four preview cards above the taskbar.
The launcher still exists, but it is no longer the front door.

![Stage 1A shell home](../assets/01-stage-1a/shell-home.png)

## Important code

```tsx
export function DesktopShell(): ReactElement {
  return (
    <main className="neosShell">
      <div className="wallpaper" aria-hidden="true" />
      <DesktopGrid panels={desktopPanels} onOpenPanel={...} />
      <Taskbar ... />
      {launcherOpen ? <LauncherOverlay apps={launcherApps} onClose={...} /> : null}
      {bootVisible ? <BootOverlay /> : null}
    </main>
  );
}
```

This composition keeps OS structure simple while exposing core project surfaces immediately on the desktop.
