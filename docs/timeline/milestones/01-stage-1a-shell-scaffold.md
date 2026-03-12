# Stage 1A - First Shell UI Pass

## What we were trying to do

Strengthen the first impression of HOME so arrival feels intentional and spatial, while keeping channel switching secondary and keeping ME.EXE as the only taskbar owner.

## What changed

- Upgraded HOME into a stronger landing composition with a clear intro block and larger channel surfaces
- Made ME.EXE the hero surface on HOME, with substantial YOU.EXE and THIRD.EXE panels
- Replaced always-visible tab-style channel switching with a secondary quick-switch dialog
- Kept ME taskbar and launcher local to ME.EXE only
- Preserved and extended heavy Liquid Glass styling across all shell layers

## Why this matters

This improved first impression and hierarchy together:
- HOME now reads as a destination, not a sparse menu
- Channel switching is available but clearly secondary
- ME.EXE remains the contained OS channel
- Other channels stay free for future custom UX

## In plain English

Before this change, HOME was clearer than before but still felt closer to a utility panel grid.

Now, HOME feels like a proper arrival surface with visual weight, and channel switching feels like a deliberate action instead of the main layout pattern.

## What the UI looked like

After boot, users land on HOME with a strong hero-led composition.
The taskbar appears only after entering ME.EXE, and quick-switch opens as a secondary overlay.

![Stage 1A shell home](../assets/01-stage-1a/shell-home.png)

## Important code

```tsx
export function SiteShell(): ReactElement {
  return (
    <main className="neosShell">
      <div className="wallpaper" aria-hidden="true" />
      <ChannelBar ... onOpenSwitcher={() => setSwitcherOpen(true)} />
      <div className="channelViewport">
        <ChannelView channel={activeChannel} onNavigate={setActiveChannel} />
      </div>
      {switcherOpen ? <ChannelSwitcher ... /> : null}
      {bootVisible ? <BootOverlay /> : null}
    </main>
  );
}
```

This composition keeps HOME strong, ME scoped, and channel switching secondary.
