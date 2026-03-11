# 04 - Issues Register

## Purpose

This file records the contradictions, omissions, and undefined decisions found during pre-build reconciliation.

It is an **audit trail**, not the final technical authority. Locked resolutions are captured in `05-implementation-decisions-lock.md`.

## Summary

**Total issues identified:** 13  
- 3 blocking omissions  
- 4 inconsistent areas  
- 6 undefined decisions

## Blocking omissions

### O1 - `osApi.vfs` referenced but missing from `OsApi`

The runtime docs and example app flows call `osApi.vfs.readDir(...)`, `osApi.vfs.readFile(...)`, and related methods, but the earlier contract surface omitted `vfs` from `OsApi`.

**Risk:** VFS-dependent apps fail to compile or invent their own access path.

**Locked resolution:** `OsApi` includes `vfs.resolve`, `vfs.readDir`, `vfs.readFile`, and `vfs.search`.

### O2 - `osApi.notify` bypassed `NotificationService`

Earlier wording allowed `osApi.notify` to call the desktop store directly instead of routing through `NotificationService.push()`.

**Risk:** Auto-dismiss timing never runs, so notifications become sticky by accident.

**Locked resolution:** `osApi.notify()` must call `notificationService.push()` and return the resulting notification id.

### O3 - Viewer app ids were referenced but not registered

File-open flows referenced viewer windows such as `viewer_text`, `viewer_image`, and `viewer_pdf`, but earlier materials did not consistently register them as real app manifests.

**Risk:** `launchApp('viewer_text', ...)` fails at runtime.

**Locked resolution:** viewer apps are hidden registered apps.

## Inconsistent areas

### C1 - Layer / z-index model drift

One version of the docs used large absolute numbers for windows, taskbar, notifications, and overlays. Another used a stacking-context model.

**Locked resolution:** use shell layer constants (`WALLPAPER`, `DESKTOP_ICONS`, `WINDOWS`, `TASKBAR`, `OVERLAY`) plus relative `WindowState.zIndex` values inside `WindowLayer`.

### C2 - `WindowState.zIndex` wording drift

One section implied z-index is stored; another implied it is not stored.

**Locked resolution:** `WindowState.zIndex` is stored as a relative stack position managed by the window store.

### C3 - Old `OsApi` signature style in Blueprint

Earlier Blueprint wording used an outdated style where methods took a `windowId` parameter directly.

**Locked resolution:** `OsApi` methods are window-scoped. The active app receives `windowId` via `AppProps`, not as repeated method parameters.

### C4 - Path and event naming drift

Blueprint examples used Windows-style backslashes and earlier file-open event names such as `file:open`.

**Locked resolution:** paths use forward slashes and the canonical file-open event is `'vfs:open-file'`.

## Undefined decisions that required locking

### D1 - Desktop icon persistence

Unclear whether user-dragged desktop icon positions should persist.

**Locked resolution:** not persisted in v2.

### D2 - Settings storage key names

Settings were referenced but key names were not locked.

**Locked resolution:** central `SETTINGS_KEYS` constants, including `crtEnabled` and `windowControlStyle`.

### D3 - CONNECT.EXE scope

CONNECT.EXE appeared in older materials but did not remain consistently defined in the v2 app set.

**Locked resolution:** out of initial v2 scope unless later reintroduced by spec.

### D4 - Alt+Tab with minimized windows

Unclear whether minimized windows should be excluded from cycling.

**Locked resolution:** include minimized windows; restore then focus when selected.

### D5 - Stale `mobileHistory` after window close

Unclear whether closed windows remained in mobile history.

**Locked resolution:** `closeWindow()` removes the window id from `mobileHistory`.

### D6 - Boot timing vs VFS readiness

Unclear whether boot animation intentionally masked VFS load or whether desktop boot should wait for VFS.

**Locked resolution:** boot does not block on VFS; prefetch begins during bootstrap; VFS-dependent apps render explicit loading states.
