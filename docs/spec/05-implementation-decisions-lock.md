# 05 - Implementation Decisions Lock

## Purpose

This file contains the final locked resolutions Codex should treat as settled before implementation.

If older wording in Blueprint or Runtime Architecture conflicts with this file, this file wins.

## Locked decisions

### D-01 - Fresh rewrite posture
Build v2 in a fresh repo or fresh project folder. The legacy Terminal-OS repo is read-only reference only.

### D-02 - Working title is provisional
Use **Terminal-OS v2** as the current working title. A later rename is allowed and does not affect architecture or contracts.

### D-03 - App registration model
`AppManifest` contains metadata only. App modules register through:

```ts
appRegistry.register(manifest, () => import('./App'));
```

### D-04 - Lazy app loading
All apps are lazy-loaded through dynamic imports.

### D-05 - Shell layer model
Use shell layer constants:

```ts
export const Z_LAYER = {
  WALLPAPER: 1,
  DESKTOP_ICONS: 2,
  WINDOWS: 3,
  TASKBAR: 4,
  OVERLAY: 5,
} as const;
```

Within `WindowLayer`, window z-order is relative and stored on `WindowState.zIndex` as `1..N`.

### D-06 - `WindowState.zIndex` is stored
`WindowState` includes `zIndex`, and the window store owns it.

### D-07 - `OsApi` is window-scoped
Apps receive `windowId` via `AppProps`. `OsApi` methods do not take `windowId` as a normal caller parameter.

### D-08 - `launchApp()` return value
`launchApp(appId, args?)` returns the new `windowId`.

### D-09 - `OsApi` includes VFS
`OsApi` exposes:
- `vfs.resolve`
- `vfs.readDir`
- `vfs.readFile`
- `vfs.search`

### D-10 - Notification routing
`osApi.notify()` must call `notificationService.push()` and return the notification id.

### D-11 - Canonical VFS path format
Use forward-slash absolute paths, for example:
- `C:/`
- `C:/WORK/`
- `C:/WORK/project-alpha/README.md`

### D-12 - Canonical file-open event
Use:

```ts
'vfs:open-file'
```

Earlier file-open names are superseded.

### D-13 - Viewer apps are hidden registered apps
At minimum, register:
- `viewer_text`
- `viewer_image`
- `viewer_pdf`

These are hidden from launcher UI but valid app ids for `launchApp()`.

### D-14 - Desktop icon persistence
Desktop icon positions are not persisted in v2.

### D-15 - Settings keys
Define settings keys centrally:

```ts
export const SETTINGS_KEYS = {
  CRT_ENABLED: 'crtEnabled',
  WINDOW_CONTROL_STYLE: 'windowControlStyle',
} as const;
```

### D-16 - CONNECT.EXE scope
CONNECT.EXE is not part of the locked initial v2 app set unless later reintroduced by spec.

### D-17 - Alt+Tab behaviour
Alt+Tab includes minimized windows. Selecting a minimized window restores it, then focuses it.

### D-18 - Mobile history cleanup
Closing a window must remove its id from `mobileHistory`.

### D-19 - Boot / VFS timing
Boot does not block on VFS readiness. `vfs.prefetch()` starts during bootstrap, and VFS-dependent apps handle their own loading states.

## Implementation note

Before starting any milestone, Codex should confirm that the code it is about to write is consistent with this file and `03-type-contracts.md`.
