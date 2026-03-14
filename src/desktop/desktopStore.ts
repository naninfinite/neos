import { useSyncExternalStore } from 'react';

export type ContextMenuItem =
  | {
      kind: 'action';
      label: string;
      icon?: string;
      onClick: () => void;
      disabled?: boolean;
    }
  | { kind: 'separator' }
  | {
      kind: 'submenu';
      label: string;
      icon?: string;
      items: ContextMenuItem[];
    };

export interface ContextMenuState {
  position: { x: number; y: number };
  items: ContextMenuItem[];
}

export interface OsNotification {
  id: string;
  title: string;
  body?: string;
  icon?: string;
  duration?: number;
  actions?: Array<{
    label: string;
    onClick: () => void;
  }>;
  timestamp: number;
}

export interface DesktopStoreState {
  bootComplete: boolean;
  launcherOpen: boolean;
  contextMenu: ContextMenuState | null;
  notifications: OsNotification[];
  isMobile: boolean;
  appSwitcherOpen: boolean;
  mobileHistory: string[];
}

export interface DesktopStoreActions {
  completeBoot(): void;
  openLauncher(): void;
  closeLauncher(): void;
  toggleLauncher(): void;
  showContextMenu(state: ContextMenuState): void;
  dismissContextMenu(): void;
  pushNotification(notification: OsNotification): void;
  dismissNotification(id: string): void;
  setMobile(isMobile: boolean): void;
  openAppSwitcher(): void;
  closeAppSwitcher(): void;
  pushMobileHistory(windowId: string): void;
  popMobileHistory(): string | undefined;
  removeFromMobileHistory(windowId: string): void;
}

export type DesktopStore = DesktopStoreState & DesktopStoreActions;

type Listener = () => void;

const initialState: DesktopStoreState = {
  bootComplete: false,
  launcherOpen: false,
  contextMenu: null,
  notifications: [],
  isMobile: false,
  appSwitcherOpen: false,
  mobileHistory: [],
};

let state: DesktopStoreState = initialState;
const listeners = new Set<Listener>();

const emitChange = (): void => {
  listeners.forEach((listener) => listener());
};

const setState = (updater: (previous: DesktopStoreState) => DesktopStoreState): void => {
  const nextState = updater(state);
  if (Object.is(nextState, state)) {
    return;
  }
  state = nextState;
  snapshot = buildSnapshot();
  emitChange();
};

const actions: DesktopStoreActions = {
  completeBoot(): void {
    setState((previous) => {
      if (previous.bootComplete) {
        return previous;
      }
      return { ...previous, bootComplete: true };
    });
  },
  openLauncher(): void {
    setState((previous) => ({ ...previous, launcherOpen: true }));
  },
  closeLauncher(): void {
    setState((previous) => ({ ...previous, launcherOpen: false }));
  },
  toggleLauncher(): void {
    setState((previous) => ({ ...previous, launcherOpen: !previous.launcherOpen }));
  },
  showContextMenu(nextContext: ContextMenuState): void {
    setState((previous) => ({ ...previous, contextMenu: nextContext }));
  },
  dismissContextMenu(): void {
    setState((previous) => ({ ...previous, contextMenu: null }));
  },
  pushNotification(notification: OsNotification): void {
    setState((previous) => ({
      ...previous,
      notifications: [...previous.notifications, notification],
    }));
  },
  dismissNotification(id: string): void {
    setState((previous) => ({
      ...previous,
      notifications: previous.notifications.filter(
        (notification) => notification.id !== id,
      ),
    }));
  },
  setMobile(isMobile: boolean): void {
    setState((previous) => ({ ...previous, isMobile }));
  },
  openAppSwitcher(): void {
    setState((previous) => ({ ...previous, appSwitcherOpen: true }));
  },
  closeAppSwitcher(): void {
    setState((previous) => ({ ...previous, appSwitcherOpen: false }));
  },
  pushMobileHistory(windowId: string): void {
    setState((previous) => {
      const nextHistory = previous.mobileHistory.filter((id) => id !== windowId);
      nextHistory.push(windowId);
      return { ...previous, mobileHistory: nextHistory };
    });
  },
  popMobileHistory(): string | undefined {
    let poppedWindowId: string | undefined;
    setState((previous) => {
      if (previous.mobileHistory.length === 0) {
        return previous;
      }
      const nextHistory = [...previous.mobileHistory];
      poppedWindowId = nextHistory.pop();
      return { ...previous, mobileHistory: nextHistory };
    });
    return poppedWindowId;
  },
  removeFromMobileHistory(windowId: string): void {
    setState((previous) => ({
      ...previous,
      mobileHistory: previous.mobileHistory.filter((id) => id !== windowId),
    }));
  },
};

const buildSnapshot = (): DesktopStore => ({
  ...state,
  ...actions,
});

let snapshot: DesktopStore = buildSnapshot();

export const desktopStore = {
  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return (): void => {
      listeners.delete(listener);
    };
  },
  getState(): DesktopStore {
    return snapshot;
  },
  ...actions,
};

export function useDesktopStore<T>(selector: (store: DesktopStore) => T): T {
  return useSyncExternalStore(
    desktopStore.subscribe,
    () => selector(desktopStore.getState()),
    () => selector(desktopStore.getState()),
  );
}
