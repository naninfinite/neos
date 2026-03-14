# 03 - Type Contracts

> [!IMPORTANT]
> This is the implementation contract for the v2 rewrite.
> If this file conflicts with older wording elsewhere, this file wins unless `05-implementation-decisions-lock.md` says otherwise.

> [!IMPORTANT]
> **Scope clarification (updated 2026-03-14):**
> The types, contracts, folder layout, and API shapes in this document apply to the **ME.EXE channel** (OS desktop experience).
> They do **not** apply to the site-level channel surface (`src/site/`).
> The site shell has its own lightweight component structure and does not use `OsApi`, `WindowState`, `desktopStore`, or the app registry.
> Before implementing anything from this document, confirm you are working inside ME.EXE scope, not the site root.

## Intent

This document gives Codex an unambiguous scaffold and contract set to build from.

It combines the locked direction from the Blueprint, Runtime Architecture, and pre-build reconciliation pass into one coding-facing reference.

## Core implementation rules

- Use a **fresh codebase**.
- Use **strict TypeScript**.
- Use **lazy app loading**.
- Keep **services outside React** where possible.
- Apps only communicate with the shell through **`OsApi`**.
- Use **forward-slash VFS paths** such as `C:/WORK/project-alpha/README.md`.
- Canonical file-open event: **`'vfs:open-file'`**.

## Required src layout

```text
src/
  core/
    AppRegistry.ts
    EventBus.ts
    KeyboardService.ts
    OsBootstrap.ts
    types.ts
  windowing/
    windowStore.ts
    WindowManager.tsx
    WindowFrame.tsx
    WindowLayer.tsx
    AppRuntime.tsx
    AppErrorBoundary.tsx
    DragHandle.tsx
    ResizeHandle.tsx
    SnapGuide.tsx
    useWindowManager.ts
  desktop/
    desktopStore.ts
    Desktop.tsx
    Taskbar.tsx
    MobileDock.tsx
    MobileAppSwitcher.tsx
    AppLauncher.tsx
    DesktopIconLayer.tsx
    DesktopIcon.tsx
    ContextMenuLayer.tsx
    NotificationLayer.tsx
    BootSequence.tsx
    Wallpaper.tsx
  apps/
    terminal/
    fileman/
    arcade/
    me/
    you/
    third/
    home/
    settings/
    viewers/
  ui/
    Button.tsx
    Input.tsx
    ScrollArea.tsx
    ProgressBar.tsx
    Modal.tsx
    Tooltip.tsx
    OsLoadingState.tsx
    OsErrorState.tsx
    icons/
  hooks/
    useKeyboardShortcut.ts
    useOsApi.ts
    useVfs.ts
    useMobileDetect.ts
    useAnimationFrame.ts
    useLocalStorage.ts
  services/
    VirtualFileSystem.ts
    StorageService.ts
    YouApiClient.ts
    NotificationService.ts
  styles/
    index.scss
    tokens.scss
    reset.scss
    typography.scss
    animations.scss
  types/
    os.d.ts
    vfs.d.ts
    events.d.ts
  main.tsx
  vite-env.d.ts
```

## App categories

```ts
export type AppCategory =
  | 'system'
  | 'personal'
  | 'creative'
  | 'games'
  | 'experimental';
```

## App manifest

`AppManifest` is **metadata only**. The lazy loader is passed separately to `appRegistry.register()`.

```ts
export interface AppManifest {
  id: string;                // snake_case unique id
  name: string;              // e.g. "FileMan.EXE"
  version: string;
  description: string;
  category: AppCategory;
  icon: string;              // SVG name relative to src/ui/icons/
  defaultSize: { w: number; h: number };
  minSize?: { w: number; h: number };
  maxSize?: { w: number; h: number };
  singleton?: boolean;
  resizable?: boolean;
  maximizable?: boolean;
  hidden?: boolean;
  requiresStorage?: boolean;
  keywords?: string[];
  desktopShortcut?: boolean; // optional curated desktop shortcut flag
}
```

## App props

```ts
export interface AppProps {
  windowId: string;
  isActive: boolean;
  isMobile: boolean;
  osApi: OsApi;
}
```

## OS API

All methods are **window-scoped** unless stated otherwise.

```ts
export interface OsApi {
  // Window lifecycle
  closeWindow(): void;
  minimizeWindow(): void;
  setTitle(title: string): void;
  requestFocus(): void;

  // App launching
  launchApp(appId: string, args?: Record<string, unknown>): string;

  // Storage (app-namespaced)
  storage: OsStorageApi;

  // Notifications
  notify(opts: NotifyOptions): string;

  // Typed event bus
  emit<K extends keyof OsEventMap>(event: K, payload: OsEventMap[K]): void;
  on<K extends keyof OsEventMap>(
    event: K,
    handler: (payload: OsEventMap[K]) => void,
  ): () => void;

  // Keyboard claims
  claimKey(key: string, handler: (e: KeyboardEvent) => void): () => void;

  // Virtual filesystem
  vfs: {
    resolve(path: string): VFSNode | null;
    readDir(path: string): VFSDirectory | null;
    readFile(path: string): VFSFile | null;
    search(query: string, startPath?: string): VFSFile[];
  };
}
```

## Storage API

```ts
export interface OsStorageApi {
  get<T>(key: string): T | null;
  set<T>(key: string, value: T): void;
  delete(key: string): void;
  clear(): void;
}
```

## Notifications

```ts
export interface NotifyOptions {
  title: string;
  body?: string;
  icon?: string;
  duration?: number; // 0 = sticky
  actions?: Array<{
    label: string;
    onClick: () => void;
  }>;
}

export interface OsNotification extends NotifyOptions {
  id: string;
  timestamp: number;
}
```

## Window state and window manager store

Windows are stored as an **ordered array**. The topmost window is the last item.

```ts
export type WindowStatus = 'normal' | 'minimized' | 'maximized';

export interface WindowState {
  id: string;
  appId: string;
  title: string;
  position: { x: number; y: number };
  size: { w: number; h: number };
  minSize: { w: number; h: number };
  maxSize?: { w: number; h: number };
  zIndex: number; // within WindowLayer stacking context: 1..N
  status: WindowStatus;
  isActive: boolean;
  launchArgs?: Record<string, unknown>;
}

export interface WindowManagerStore {
  windows: WindowState[];
  activeWindowId: string | null;
  openWindow(appId: string, args?: Record<string, unknown>): string;
  closeWindow(id: string): void;
  focusWindow(id: string): void;
  minimizeWindow(id: string): void;
  maximizeWindow(id: string): void;
  restoreWindow(id: string): void;
  setPosition(id: string, pos: { x: number; y: number }): void;
  setSize(id: string, size: { w: number; h: number }): void;
  setTitle(id: string, title: string): void;
  cycleNext(): void;
  cyclePrev(): void;
}
```

## Desktop store

```ts
export interface DesktopStore {
  bootComplete: boolean;
  launcherOpen: boolean;
  contextMenu: ContextMenuState | null;
  notifications: OsNotification[];
  isMobile: boolean;
  appSwitcherOpen: boolean;
  mobileHistory: string[];

  completeBoot(): void;
  openLauncher(): void;
  closeLauncher(): void;
  showContextMenu(state: ContextMenuState): void;
  dismissContextMenu(): void;
  pushNotification(n: OsNotification): void;
  dismissNotification(id: string): void;
  setMobile(isMobile: boolean): void;
  openAppSwitcher(): void;
  closeAppSwitcher(): void;
  pushMobileHistory(windowId: string): void;
  popMobileHistory(): string | undefined;
  removeFromMobileHistory(windowId: string): void;
}
```

## Context menus

```ts
export interface ContextMenuState {
  position: { x: number; y: number };
  items: ContextMenuItem[];
}

export type ContextMenuItem =
  | { kind: 'action'; label: string; icon?: string; onClick: () => void; disabled?: boolean }
  | { kind: 'separator' }
  | { kind: 'submenu'; label: string; icon?: string; items: ContextMenuItem[] };
```

## VFS contracts

```ts
export type VFSFileType = 'text' | 'image' | 'video' | 'project' | 'binary';

export interface VFSDirectory {
  kind: 'directory';
  name: string;
  path: string;
  children: VFSNode[];
  meta?: Record<string, string>;
}

export interface VFSFile {
  kind: 'file';
  name: string;
  path: string;
  type: VFSFileType;
  content?: string;
  src?: string;
  meta?: {
    size?: number;
    created?: string;
    modified?: string;
    description?: string;
    tags?: string[];
  };
}

export type VFSNode = VFSDirectory | VFSFile;

export interface VFSManifest {
  version: number;
  root: VFSDirectory;
}
```

## Event map

```ts
export interface OsEventMap {
  'vfs:open-file': { path: string };
  'vfs:ready': void;

  'window:opened': { windowId: string; appId: string };
  'window:closed': { windowId: string; appId: string };
  'window:focused': { windowId: string };
  'window:minimized': { windowId: string };

  'system:boot-complete': void;
  'system:theme-changed': { theme: 'dark' | 'light' };
  'system:mobile-changed': { isMobile: boolean };

  'you:new-message': { count: number };
  'you:draft-saved': { preview: string };

  'third:scene-saved': { slotId: string };
}
```

## Core service contracts

### AppRegistry

```ts
export type AppLoader = () => Promise<{ default: React.ComponentType<AppProps> }>;

export interface AppRegistryEntry {
  manifest: AppManifest;
  load: AppLoader;
}

export declare const appRegistry: {
  register(manifest: AppManifest, load: AppLoader): void;
  resolve(appId: string): AppRegistryEntry;
  getAllManifests(): AppManifest[];
  getByCategory(category: AppCategory): AppManifest[];
  has(appId: string): boolean;
};
```

### KeyboardService

```ts
export type ShortcutTier = 'SHELL_EXCLUSIVE' | 'SHELL_DEFAULT' | 'APP';

export interface ShortcutRegistration {
  key: string;
  tier: ShortcutTier;
  handler: (e: KeyboardEvent) => void;
  windowId?: string;
}

export declare const keyboardService: {
  register(reg: ShortcutRegistration): () => void;
  claim(windowId: string, key: string, handler: (e: KeyboardEvent) => void): () => void;
  dispatch(e: KeyboardEvent): void;
};
```

### VirtualFileSystem service

```ts
export declare const vfs: {
  prefetch(): void;
  readonly ready: Promise<void>;
  resolve(path: string): VFSNode | null;
  readDir(path: string): VFSDirectory | null;
  readFile(path: string): VFSFile | null;
  search(query: string, startPath?: string): VFSFile[];
};
```

### StorageService

```ts
export declare const storageService: {
  forApp(appId: string): OsStorageApi;
  system: OsStorageApi;
  migrate(): void;
};
```

### NotificationService

```ts
export declare const notificationService: {
  push(opts: NotifyOptions): string;
  dismiss(id: string): void;
};
```

`osApi.notify()` must call `notificationService.push()` rather than writing directly to the desktop store.

## Hook contracts

### `useOsApi`

```ts
export function useOsApi(windowId: string, appId: string): OsApi;
```

### `useVfs`

```ts
export function useVfs(): {
  ready: boolean;
  error: Error | null;
  vfs: typeof vfs;
};
```

## App registration pattern

```ts
import { appRegistry } from '@/core/AppRegistry';
import { manifest } from './manifest';

appRegistry.register(manifest, () => import('./FileManApp'));
```

## App component pattern

```tsx
import type { AppProps } from '@/types/os';
import { useVfs } from '@/hooks/useVfs';
import { OsLoadingState } from '@/ui/OsLoadingState';
import { OsErrorState } from '@/ui/OsErrorState';

export default function FileManApp({ osApi }: AppProps): JSX.Element {
  const { ready, error } = useVfs();

  if (!ready) return <OsLoadingState label="Mounting filesystem..." />;
  if (error) return <OsErrorState label="Filesystem unavailable." />;

  return <div>{/* app content */}</div>;
}
```

## Hidden viewer apps

These must exist as registered manifests even though they do not appear in launcher UI.

Required hidden app ids:
- `viewer_text`
- `viewer_image`
- `viewer_pdf`

Pattern:

```ts
export const manifest: AppManifest = {
  id: 'viewer_text',
  name: 'Text Viewer',
  version: '2.0.0',
  description: 'Internal text file viewer.',
  category: 'system',
  icon: 'file-text',
  defaultSize: { w: 720, h: 520 },
  hidden: true,
  singleton: false,
  resizable: true,
  maximizable: true,
};
```

## Layer constants

Use layer constants for shell layers and relative `zIndex` values inside the window layer.

```ts
export const Z_LAYER = {
  WALLPAPER: 1,
  DESKTOP_ICONS: 2,
  WINDOWS: 3,
  TASKBAR: 4,
  OVERLAY: 5,
} as const;
```

Within `WindowLayer`, each `WindowState.zIndex` is `1..N`.

## Settings keys

Define storage keys centrally.

```ts
export const SETTINGS_KEYS = {
  CRT_ENABLED: 'crtEnabled',
  WINDOW_CONTROL_STYLE: 'windowControlStyle',
} as const;
```

## Mobile + boot contracts

- `Alt+Tab` includes minimized windows; selecting one restores it, then focuses it.
- `closeWindow()` must also remove the closed `windowId` from `mobileHistory`.
- Boot does **not** block on VFS readiness.
- `vfs.prefetch()` starts during bootstrap.
- VFS-dependent apps handle loading state through `useVfs()`.
- Desktop icon positions are **not persisted in v2**.

## Scope note for CONNECT.EXE

`CONNECT.EXE` is not part of the locked initial v2 core app set unless a later spec explicitly adds it back.
