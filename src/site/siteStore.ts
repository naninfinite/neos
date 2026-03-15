import { useSyncExternalStore } from 'react';

export type SiteChannel = 'home' | 'me' | 'you' | 'third' | 'connect' | null;

export interface SiteStoreState {
  bootComplete: boolean;
  activeChannel: SiteChannel;
}

export interface SiteStoreActions {
  completeBoot(): void;
  setChannel(channel: SiteChannel): void;
}

export type SiteStore = SiteStoreState & SiteStoreActions;

type Listener = () => void;

let state: SiteStoreState = {
  bootComplete: false,
  activeChannel: 'home',
};

const listeners = new Set<Listener>();

const emitChange = (): void => {
  listeners.forEach((listener) => listener());
};

const setState = (updater: (current: SiteStoreState) => SiteStoreState): void => {
  const nextState = updater(state);
  if (Object.is(nextState, state)) {
    return;
  }
  state = nextState;
  snapshot = buildSnapshot();
  emitChange();
};

const actions: SiteStoreActions = {
  completeBoot(): void {
    setState((current) => {
      if (current.bootComplete) {
        return current;
      }
      return { ...current, bootComplete: true };
    });
  },
  setChannel(channel: SiteChannel): void {
    setState((current) => ({ ...current, activeChannel: channel }));
  },
};

const buildSnapshot = (): SiteStore => ({
  ...state,
  ...actions,
});

let snapshot: SiteStore = buildSnapshot();

export const siteStore = {
  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return (): void => {
      listeners.delete(listener);
    };
  },
  getState(): SiteStore {
    return snapshot;
  },
  ...actions,
};

export function useSiteStore<T>(selector: (store: SiteStore) => T): T {
  return useSyncExternalStore(
    siteStore.subscribe,
    () => selector(siteStore.getState()),
    () => selector(siteStore.getState()),
  );
}
