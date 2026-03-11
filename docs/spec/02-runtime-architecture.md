# 02 - Runtime Architecture

*Addendum to the v2 Architecture & UX Blueprint*
*Scope: how the seven runtime subsystems are defined, wired, and bounded*

-----

> [!IMPORTANT]
> This document is part of the Terminal-OS v2 spec pack.
> If this file conflicts with `SOURCE_OF_TRUTH.md` or `05-implementation-decisions-lock.md`, follow those files.
> Working title: **Terminal-OS v2**. Project rename is allowed later; architecture and contracts remain valid.


## Overview: The Runtime Model

Terminal-OS boots a single-page React application that simulates an operating system. There is no server-side rendering. There is no router. There is one root DOM node. Everything — windows, apps, the file system, the taskbar — lives inside a single React tree managed by a small set of Zustand stores and plain TypeScript services.

The runtime is divided into **seven subsystems**. Each has a single responsibility. None of them bleeds into another’s territory.

```
┌─────────────────────────────────────────────────────────┐
│                        Desktop                          │
│  ┌─────────────┐  ┌──────────────────────────────────┐  │
│  │  Taskbar    │  │         WindowManager            │  │
│  │             │  │  ┌──────────┐  ┌──────────┐     │  │
│  │ [task list] │  │  │ Window   │  │ Window   │ ... │  │
│  │ [sys tray]  │  │  │ AppRuntime│  │AppRuntime│     │  │
│  └─────────────┘  │  └──────────┘  └──────────┘     │  │
│                   └──────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘

          AppRegistry      VFS       SystemServices
         (static map)  (file tree)  (storage, events,
                                     notifications)
```

The three bottom-row subsystems are **not React components**. They are plain TypeScript singletons that exist outside the render tree and are accessed via hooks or the `OsApi` surface.

-----

## 1. WindowManager

### Responsibility

Owns the lifecycle, position, size, stacking order, and focus state of every open window. It is the single source of truth for all windowing state. Nothing else may mutate window state.

### State shape (`windowStore` — Zustand)

```typescript
interface WindowState {
  id: string;                  // UUID, assigned at launch
  appId: string;               // References AppRegistry entry
  title: string;               // Current window title (apps may update this)
  position: { x: number; y: number };
  size: { w: number; h: number };
  minSize: { w: number; h: number };
  maxSize?: { w: number; h: number };
  zIndex: number;
  status: 'normal' | 'minimized' | 'maximized';
  isActive: boolean;           // Only one window can be true at a time
  launchArgs?: Record<string, unknown>;
}

interface WindowManagerStore {
  windows: WindowState[];
  activeWindowId: string | null;
  zCounter: number;            // Monotonically increasing z-index counter

  // Actions
  openWindow(appId: string, args?: Record<string, unknown>): string;
  closeWindow(id: string): void;
  focusWindow(id: string): void;
  minimizeWindow(id: string): void;
  maximizeWindow(id: string): void;
  restoreWindow(id: string): void;
  setPosition(id: string, pos: { x: number; y: number }): void;
  setSize(id: string, size: { w: number; h: number }): void;
  setTitle(id: string, title: string): void;
  cycleNext(): void;           // Alt+Tab forward
  cyclePrev(): void;           // Alt+Tab backward
}
```

### Rules

- `openWindow` calls `AppRegistry.resolve(appId)` to check the manifest. If `singleton: true` and the app is already open, it calls `focusWindow` on the existing instance instead of opening a new one.
- `focusWindow` increments `zCounter`, assigns the new value to the target window’s `zIndex`, sets `isActive: true` on target, `isActive: false` on all others.
- `zCounter` resets and resequences all open windows if it exceeds 800 (keeping headroom below the taskbar’s z-index of 900).
- `setPosition` clamps: `x` must keep at least 100px of title bar within the viewport horizontally; `y` must be ≥ 0 (cannot slide above the top edge) and ≤ `viewportHeight - taskbarHeight - 10`.
- `setSize` enforces per-window `minSize`. If no `maxSize`, the window can grow to viewport minus taskbar.
- Window state is **not persisted**. Every session starts with a clean window list. (App-internal state may persist via `StorageService`.)

### Component tree

```
<WindowManager>               ← reads windowStore, renders nothing itself
  {windows.map(w =>
    <WindowFrame key={w.id}>  ← chrome: title bar, controls, resize handles
      <AppRuntime ... />      ← lazy-loads and mounts the app component
    </WindowFrame>
  )}
</WindowManager>
```

`WindowFrame` is a pure presentational component. It receives the `WindowState` and dispatch callbacks as props. It does not touch the store directly.

### Drag and resize implementation

Both use the [Pointer Events API](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events), not mouse events, for unified desktop/touch handling.

```
pointerdown on title bar → setPointerCapture → store dragOffset
pointermove               → dispatch setPosition(id, clamped(e.x - offset))
pointerup                 → releasePointerCapture → check snap threshold
```

Position is applied as `transform: translate(x px, y px)` on the `WindowFrame` root element. `top` and `left` are never used for window positioning. This keeps windows on their own GPU compositing layer and avoids layout reflow on every pointer move.

`will-change: transform` is set on `pointerdown` and removed on `pointerup`.

-----

## 2. Desktop

### Responsibility

The Desktop is the root shell component. It owns the viewport canvas, renders the layer stack, bootstraps the OS on first mount, and coordinates the global keyboard shortcuts.

### Component structure

```typescript
function Desktop(): JSX.Element {
  // Reads from desktopStore
  const { bootComplete, launcherOpen } = useDesktopStore();

  // Global keyboard shortcuts registered here, nowhere else
  useKeyboardShortcut('ctrl+space', openLauncher);
  useKeyboardShortcut('alt+tab',    cycleWindows);
  useKeyboardShortcut('escape',     dismissOverlay);

  return (
    <div className={styles.desktop}>
      <Wallpaper />                      {/* z: 0  */}
      <DesktopIconLayer />               {/* z: 10 */}
      <WindowManager />                  {/* z: 100–899 */}
      <Taskbar />                        {/* z: 900 */}
      {launcherOpen && <AppLauncher />}  {/* z: 1000 */}
      <NotificationLayer />             {/* z: 1000 */}
      <ContextMenuLayer />              {/* z: 1000 */}
      {!bootComplete && <BootSequence />}{/* z: 9999 */}
    </div>
  );
}
```

### `desktopStore` (Zustand)

```typescript
interface DesktopStore {
  bootComplete: boolean;
  launcherOpen: boolean;
  contextMenu: ContextMenuState | null;
  notifications: Notification[];

  // Actions
  completeBoot(): void;
  openLauncher(): void;
  closeLauncher(): void;
  showContextMenu(state: ContextMenuState): void;
  dismissContextMenu(): void;
  pushNotification(n: Notification): void;
  dismissNotification(id: string): void;
}
```

### Boot sequence

On first mount, `Desktop` triggers the boot sequence. The `BootSequence` component renders at z-index 9999 and covers everything. When its animation completes, it calls `desktopStore.completeBoot()`, which sets `bootComplete: true` and removes the overlay from the tree.

Boot sequence steps:

1. Black screen with blinking cursor (200ms)
2. BIOS-style text output (typewriter effect, ~1.5s total)
3. CRT flicker (3 quick opacity pulses, 300ms)
4. Desktop fades in (200ms), `BootSequence` unmounts

First-run detection: if `StorageService.get('system.hasBooted')` is `null`, the boot sequence adds a “Welcome” notification after completing and writes the flag.

### Context menus

The `ContextMenuLayer` renders a single `<ContextMenu>` positioned absolutely using `desktopStore.contextMenu.position`. There is exactly one context menu in the DOM at any time. Components that need a right-click menu call `desktopStore.showContextMenu({ position, items })` — they never render their own menu components.

-----

## 3. Taskbar

### Responsibility

Persistent OS chrome. Displays the launcher button, the list of open windows, the system clock, and notification indicators. Reflects window state; it does not own it.

### Data flow

```
windowStore ──► useTaskbarItems() ──► <TaskList>
desktopStore ──► useClock()       ──► <SystemTray>
                 useNotifications()
```

Taskbar reads from `windowStore` and `desktopStore` only. It never writes to `windowStore` directly — it calls `windowStore.focusWindow()` or `windowStore.minimizeWindow()` via the store’s action interface.

### Task button behaviour

```
Click on task button:
  if window.status === 'minimized' → restoreWindow(id) + focusWindow(id)
  else if window.isActive          → minimizeWindow(id)
  else                             → focusWindow(id)
```

This matches the behaviour of Windows 95/XP task buttons, which is the expected mental model for the OS metaphor.

### Structure

```typescript
function Taskbar(): JSX.Element {
  return (
    <div className={styles.taskbar}>               {/* height: 48px, z: 900 */}
      <LauncherButton />                           {/* opens AppLauncher */}
      <TaskList />                                 {/* one TaskButton per open window */}
      <SystemTray>
        <Clock />
        <NotificationBadge />
      </SystemTray>
    </div>
  );
}
```

`TaskButton` receives a `WindowState` snapshot as a prop. It is a pure component — no store access inside `TaskButton` itself.

### Mobile

On viewports < 768px, the `Taskbar` is replaced by a `MobileDock` component. `MobileDock` renders icon-only buttons for each open app and the launcher. Window chrome is hidden. The active app fills the full screen. Swiping between apps is managed by a `MobileAppSwitcher` component owned by `Desktop`, not `Taskbar`.

-----

## 4. AppRegistry

### Responsibility

A static, synchronous map of every available app in the OS. It is the only place where an app’s manifest and component loader are coupled together. The rest of the OS knows apps only by their `appId` string.

### Implementation

`AppRegistry` is a plain TypeScript class — not a React context, not a Zustand store. It is instantiated once in `OsBootstrap.ts` and referenced as a module-level singleton.

```typescript
type AppLoader = () => Promise<{ default: React.ComponentType<AppProps> }>;

interface AppRegistryEntry {
  manifest: AppManifest;
  load: AppLoader;    // dynamic import — app code not loaded until first open
}

class AppRegistry {
  private entries = new Map<string, AppRegistryEntry>();

  register(manifest: AppManifest, load: AppLoader): void {
    if (this.entries.has(manifest.id)) {
      throw new Error(`AppRegistry: duplicate app id "${manifest.id}"`);
    }
    this.entries.set(manifest.id, { manifest, load });
  }

  resolve(appId: string): AppRegistryEntry {
    const entry = this.entries.get(appId);
    if (!entry) throw new Error(`AppRegistry: unknown app "${appId}"`);
    return entry;
  }

  getAllManifests(): AppManifest[] {
    return [...this.entries.values()].map(e => e.manifest);
  }

  getByCategory(category: AppCategory): AppManifest[] {
    return this.getAllManifests().filter(m => m.category === category);
  }
}

export const appRegistry = new AppRegistry();
```

### Registration pattern

Each app registers itself in its own `index.ts`:

```typescript
// src/apps/fileman/index.ts
import { appRegistry } from '@/core/AppRegistry';
import { manifest } from './manifest';

appRegistry.register(manifest, () => import('./FileManApp'));
```

All app `index.ts` files are imported once in `OsBootstrap.ts`:

```typescript
// src/core/OsBootstrap.ts
import '@/apps/terminal';
import '@/apps/fileman';
import '@/apps/arcade';
import '@/apps/me';
import '@/apps/you';
import '@/apps/third';
import '@/apps/home';
import '@/apps/settings';
```

These imports are side-effects only. They execute the `appRegistry.register()` calls. The actual app component code is behind a dynamic `import()` in each loader function and will not be fetched until the app is first opened.

### Validation

`AppRegistry.register()` validates the manifest shape at registration time (development mode only). If `manifest.id` is not snake_case, or `defaultSize` values are below the absolute minimum (200×150px), it throws immediately during boot rather than silently failing later.

-----

## 5. AppRuntime

### Responsibility

`AppRuntime` is the component that sits inside every `WindowFrame`. It owns the lazy-loading of the app component, the error boundary, and the construction of the `OsApi` instance that the app receives as a prop.

### Lifecycle

```
WindowManager.openWindow(appId)
  → creates WindowState in store
  → renders <WindowFrame>
      → renders <AppRuntime appId windowId>
          → calls AppRegistry.resolve(appId)
          → React.lazy wraps the AppLoader
          → Suspense shows OS-style loading state
          → App component mounts with OsApi injected
          → ErrorBoundary catches any app crash
```

### Implementation

```typescript
interface AppRuntimeProps {
  appId: string;
  windowId: string;
}

function AppRuntime({ appId, windowId }: AppRuntimeProps): JSX.Element {
  const entry = appRegistry.resolve(appId);
  const AppComponent = useMemo(
    () => React.lazy(entry.load),
    [appId]   // stable: appId never changes for a given window
  );

  const osApi = useOsApi(windowId);    // constructs OsApi bound to this windowId
  const isActive = useIsWindowActive(windowId);
  const isMobile = useMobileDetect();

  return (
    <AppErrorBoundary appId={appId} windowId={windowId}>
      <Suspense fallback={<AppLoadingState />}>
        <AppComponent
          windowId={windowId}
          isActive={isActive}
          isMobile={isMobile}
          osApi={osApi}
        />
      </Suspense>
    </AppErrorBoundary>
  );
}
```

### OsApi construction (`useOsApi`)

`useOsApi` is a hook that returns a stable `OsApi` object bound to the given `windowId`. The reference is stable across renders (via `useMemo`). Apps can safely store it in a ref or pass it down.

```typescript
function useOsApi(windowId: string): OsApi {
  const store = useWindowManagerStore();
  const desktop = useDesktopStore();

  return useMemo((): OsApi => ({
    closeWindow:    () => store.closeWindow(windowId),
    minimizeWindow: () => store.minimizeWindow(windowId),
    setTitle:       (t) => store.setTitle(windowId, t),
    requestFocus:   () => store.focusWindow(windowId),
    launchApp:      (id, args) => store.openWindow(id, args),
    notify:         (opts) => desktop.pushNotification({ ...opts, id: uuid() }),
    storage:        storageService.forApp(appId),   // namespaced slice
    emit:           (event, payload) => eventBus.emit(event, payload),
    on:             (event, handler) => eventBus.on(event, handler),
  }), [windowId]);
}
```

### Error boundary

`AppErrorBoundary` catches any React error thrown inside the app tree and renders an OS-style crash screen instead of propagating to the Desktop. The window stays open (with the crash UI). The user can close it normally. The window manager and desktop are unaffected.

```
┌─────────────────────────────────┐
│ FileMan.EXE                  ✕  │
├─────────────────────────────────┤
│  ⚠  APPLICATION ERROR           │
│                                 │
│  FileMan.EXE has encountered    │
│  a fatal error and must close.  │
│                                 │
│  Error: Cannot read properties  │
│  of null (reading 'children')   │
│                                 │
│  [Close Window]  [Report]       │
└─────────────────────────────────┘
```

-----

## 6. VFS (Virtual File System)

### Responsibility

Provides a read-only tree of typed file nodes that represents the creator’s “filesystem”. Apps traverse it, open files, and get typed content back. The VFS does not write during a session (all writes would be to the underlying JSON manifest, which is a build-time concern).

### Node types

```typescript
type VFSNode = VFSDirectory | VFSFile;

interface VFSDirectory {
  kind: 'directory';
  name: string;
  path: string;           // absolute e.g. 'C:/WORK/project-alpha'
  children: VFSNode[];
  meta?: Record<string, string>;
}

interface VFSFile {
  kind: 'file';
  name: string;
  path: string;
  type: 'text' | 'image' | 'video' | 'project' | 'binary';
  content?: string;       // inline content for text files
  src?: string;           // URL for image/video/binary
  meta?: {
    size?: number;
    created?: string;
    description?: string;
    tags?: string[];
  };
}
```

### Data source

The VFS tree is defined in a static JSON file committed to the repo:

```
public/vfs/manifest.json
```

`VirtualFileSystem` fetches this file once on boot (a single `fetch()` call). It is never re-fetched during the session. The creator updates the portfolio content by editing this JSON file.

### Service API

```typescript
class VirtualFileSystem {
  private root: VFSDirectory | null = null;
  private ready: Promise<void>;

  constructor() {
    this.ready = this.load();
  }

  private async load(): Promise<void> {
    const res = await fetch('/vfs/manifest.json');
    this.root = await res.json();
  }

  async awaitReady(): Promise<void> {
    return this.ready;
  }

  resolve(path: string): VFSNode | null {
    // Walks the tree by path segments
    // Returns null for missing paths (never throws)
  }

  readDir(path: string): VFSDirectory | null {
    const node = this.resolve(path);
    return node?.kind === 'directory' ? node : null;
  }

  readFile(path: string): VFSFile | null {
    const node = this.resolve(path);
    return node?.kind === 'file' ? node : null;
  }

  search(query: string, startPath = 'C:/'): VFSFile[] {
    // Recursive search by filename and meta.tags
  }
}

export const vfs = new VirtualFileSystem();
```

### Access pattern

Apps access the VFS via `OsApi` (for a clean boundary) or import `vfs` directly when they are filesystem-centric (FileMan.EXE is the one legitimate direct importer). All other apps go through `OsApi`:

```typescript
// In a future OsApi extension:
interface OsApi {
  vfs: {
    resolve(path: string): VFSNode | null;
    readDir(path: string): VFSDirectory | null;
    readFile(path: string): VFSFile | null;
    search(query: string): VFSFile[];
  };
}
```

### File opening protocol

When an app wants to open a file, it emits an event rather than directly instantiating a viewer:

```typescript
osApi.emit('vfs:open-file', { path: 'C:/WORK/project-alpha/README.md' });
```

ME.EXE listens for `vfs:open-file` and dispatches the appropriate viewer window via `osApi.launchApp('viewer_text', { path })`. This keeps viewer selection logic in one place.

-----

## 7. SystemServices

These are three plain TypeScript singletons that underpin the whole runtime. They are not React components. They are imported by hooks and the `OsApi` constructor.

### 7.1 StorageService

Wraps `localStorage` with namespacing, JSON serialisation, and schema version management.

```typescript
class StorageService {
  private readonly SCHEMA_VERSION = 2;

  constructor() {
    this.migrate();   // runs version migration on every boot
  }

  /** Returns a namespaced slice for a specific app */
  forApp(appId: string): OsStorageApi {
    const prefix = `tos.app.${appId}.`;
    return {
      get: <T>(key: string): T | null => {
        const raw = localStorage.getItem(prefix + key);
        return raw ? (JSON.parse(raw) as T) : null;
      },
      set: <T>(key: string, value: T): void => {
        localStorage.setItem(prefix + key, JSON.stringify(value));
      },
      delete: (key: string): void => {
        localStorage.removeItem(prefix + key);
      },
      clear: (): void => {
        Object.keys(localStorage)
          .filter(k => k.startsWith(prefix))
          .forEach(k => localStorage.removeItem(k));
      },
    };
  }

  /** System-level storage (not namespaced to any app) */
  system = {
    get: <T>(key: string): T | null => { /* same pattern, prefix: 'tos.sys.' */ },
    set: <T>(key: string, value: T): void => { /* */ },
  };

  private migrate(): void {
    const stored = this.system.get<number>('schemaVersion');
    if (stored !== this.SCHEMA_VERSION) {
      // Run migrations, then write new version
      this.system.set('schemaVersion', this.SCHEMA_VERSION);
    }
  }
}

export const storageService = new StorageService();
```

Key design decisions:

- All keys are prefixed `tos.` to avoid collisions with any other code that might share `localStorage`.
- `forApp()` returns a new `OsStorageApi` object each call but the underlying storage is the same — this is fine because `OsApi` is constructed once per window instance.
- No app can read another app’s storage via this API. Direct `localStorage` access from app code is a coding standards violation.

### 7.2 EventBus

A typed pub/sub bus. The event map is defined once in `src/types/events.d.ts` and enforced via generics.

```typescript
// src/types/events.d.ts
interface OsEventMap {
  'vfs:open-file':        { path: string };
  'window:focused':       { windowId: string };
  'window:closed':        { windowId: string };
  'you:new-message':      { count: number };
  'system:theme-changed': { theme: 'dark' | 'light' };
  // ... extend as apps add events
}

// src/services/EventBus.ts
type Handler<T> = (payload: T) => void;

class EventBus {
  private listeners = new Map<string, Set<Handler<unknown>>>();

  emit<K extends keyof OsEventMap>(event: K, payload: OsEventMap[K]): void {
    this.listeners.get(event)?.forEach(fn => fn(payload));
  }

  on<K extends keyof OsEventMap>(
    event: K,
    handler: Handler<OsEventMap[K]>
  ): () => void {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event)!.add(handler as Handler<unknown>);
    // Returns unsubscribe function — callers must call this in useEffect cleanup
    return () => this.listeners.get(event)?.delete(handler as Handler<unknown>);
  }
}

export const eventBus = new EventBus();
```

Usage inside an app component:

```typescript
useEffect(() => {
  const unsub = osApi.on('you:new-message', ({ count }) => {
    setUnreadCount(count);
  });
  return unsub;   // cleanup on window close
}, []);
```

Adding a new event: add one line to `OsEventMap` in `events.d.ts`. TypeScript will enforce that all `emit` and `on` calls pass correct payload shapes.

### 7.3 NotificationService

Manages the queue of OS-level notifications (the banner popups above the system tray). Writes to `desktopStore`.

```typescript
interface NotifyOptions {
  title: string;
  body?: string;
  icon?: string;          // app icon path
  duration?: number;      // ms, default 4000; 0 = sticky
  actions?: Array<{ label: string; onClick: () => void }>;
}

class NotificationService {
  push(opts: NotifyOptions): string {
    const id = uuid();
    desktopStore.getState().pushNotification({ ...opts, id });
    if (opts.duration !== 0) {
      setTimeout(() => desktopStore.getState().dismissNotification(id),
                 opts.duration ?? 4000);
    }
    return id;   // caller can dismiss early if needed
  }

  dismiss(id: string): void {
    desktopStore.getState().dismissNotification(id);
  }
}

export const notificationService = new NotificationService();
```

`NotificationService` is the only system service that writes to a Zustand store. This is intentional — notifications are display-layer state and belong in the render tree.

-----

## Wiring Diagram: Full Boot Sequence

```
main.tsx
  └── OsBootstrap.ts
        ├── imports all app index.ts files
        │     └── appRegistry.register() × N
        ├── storageService (constructed, migration runs)
        ├── vfs.awaitReady() (fetch vfs/manifest.json)
        └── renders <Desktop />

<Desktop />
  ├── mounts <BootSequence />
  ├── registers global keyboard shortcuts
  └── on bootComplete:
        unmounts <BootSequence />
        renders full shell:
          <Wallpaper />
          <DesktopIconLayer />   ← appRegistry.getAllManifests() for icon list
          <WindowManager />      ← empty windows[] on first render
          <Taskbar />
          <NotificationLayer />
          <ContextMenuLayer />
```

User opens an app (double-click icon or launcher):

```
user action
  → desktopStore.closeLauncher()
  → windowStore.openWindow('file_man')
      → appRegistry.resolve('file_man')   ← validates app exists
      → creates WindowState { id: uuid, ... }
      → <WindowFrame id="..." /> renders
          → <AppRuntime appId="file_man" windowId="..." />
              → React.lazy(entry.load)     ← dynamic import fires here
              → <Suspense> shows loading state
              → FileManApp.tsx chunk loads (~200KB)
              → <FileManApp osApi={...} /> mounts
                  → osApi.vfs.readDir('C:/') on first render
```

-----

## Subsystem Dependency Graph

```
Desktop
  ├── reads:  desktopStore, windowStore
  └── owns:   global keyboard shortcuts, layer z-index stack

Taskbar
  ├── reads:  windowStore, desktopStore
  └── calls:  windowStore.focusWindow / minimizeWindow

WindowManager
  ├── reads:  windowStore
  └── renders: WindowFrame → AppRuntime per window

AppRuntime
  ├── reads:  AppRegistry (resolve)
  ├── constructs: OsApi (per window)
  └── renders: lazy app component inside ErrorBoundary + Suspense

AppRegistry
  └── depends on: nothing (pure static map)

VFS
  └── depends on: fetch (one-time on boot)

SystemServices
  ├── StorageService: depends on localStorage
  ├── EventBus:       depends on nothing
  └── NotificationService: writes to desktopStore
```

Arrows that are explicitly **forbidden**:

```
apps/* → windowStore (direct)     ✗   use OsApi instead
apps/* → desktopStore (direct)    ✗   use OsApi instead
apps/* → other apps/* (direct)    ✗   use EventBus instead
services/* → React components     ✗   services are framework-agnostic
windowing/* → apps/*              ✗   AppRuntime is the only crossing point
```

-----

## Summary: What Each Subsystem Owns

|Subsystem     |Owns                                                                           |Does NOT own                            |
|--------------|-------------------------------------------------------------------------------|----------------------------------------|
|WindowManager |Window position, size, z-index, focus, open/close lifecycle                    |App component code, app data, VFS       |
|Desktop       |Layer stack, global shortcuts, boot state, context menus, notifications display|Window state, app state                 |
|Taskbar       |Task button rendering, clock, tray display                                     |Window state (reads only), app behaviour|
|AppRegistry   |App manifest map, lazy loader references                                       |Window state, app runtime state         |
|AppRuntime    |Lazy loading, error boundary, OsApi injection                                  |App business logic, window chrome       |
|VFS           |File tree, path resolution, search                                             |Window management, storage, network     |
|SystemServices|Storage namespacing, typed events, notification queue                          |Any rendering, window management        |

-----

*Terminal-OS v2 — Runtime Architecture Specification v1.0*
*March 2026*
