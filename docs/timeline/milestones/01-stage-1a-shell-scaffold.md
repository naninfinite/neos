# Stage 1A - First Shell UI Pass

## What we were trying to do

Separate global site navigation from the internal OS navigation so ME.EXE contains the taskbar, while the wider site remains channel-based and readable.

## What changed

- Introduced a site-level shell with a global channel bar (`Home`, `ME`, `YOU`, `THIRD`)
- Kept HOME as a panel-based landing hub with immediate project surface previews
- Moved taskbar and launcher ownership into `ME.EXE` only
- Ensured `YOU.EXE` and `THIRD.EXE` channels render without inheriting ME taskbar chrome
- Preserved Liquid Glass styling across global shell and channel surfaces

## Why this matters

This fixed the hierarchy boundary:
- site shell handles channel-level navigation
- ME.EXE owns OS-style navigation (taskbar/launcher/windowing later)
- other channels stay free to use channel-specific UX patterns

It keeps Terminal-OS central to the product while preventing OS chrome from being forced across unrelated surfaces.

## In plain English

Before this change, the whole site behaved like one big OS shell.

Now, the site works like a modern multi-channel product: HOME helps you choose where to go, ME.EXE is where the full OS metaphor lives, and other channels can be purpose-built.

## What the UI looked like

After boot, users land on HOME with channel panels and a top channel bar.
The taskbar appears only after entering ME.EXE.

![Stage 1A shell home](../assets/01-stage-1a/shell-home.png)

## Important code

```tsx
export function SiteShell(): ReactElement {
  return (
    <main className="neosShell">
      <div className="wallpaper" aria-hidden="true" />
      <ChannelBar activeChannel={activeChannel} onNavigate={setActiveChannel} />
      <div className="channelViewport">
        <ChannelView channel={activeChannel} onNavigate={setActiveChannel} />
      </div>
      {bootVisible ? <BootOverlay /> : null}
    </main>
  );
}
```

This composition cleanly separates global navigation from in-channel navigation and keeps ME.EXE as a contained OS environment.
