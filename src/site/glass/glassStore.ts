import { useSyncExternalStore } from 'react';

export interface GlassMaterialPreset {
  ior: number;
  thickness: number;
  blur: number;
  bezel: number;
  specular: number;
  tint: number;
  shadow: number;
}

export interface GlassStoreState extends GlassMaterialPreset {
  visible: boolean; // For dev panel visibility
}

export interface GlassStoreActions {
  setParam(key: keyof GlassMaterialPreset, value: number): void;
  togglePanel(): void;
  resetToDefaults(): void;
}

export type GlassStore = GlassStoreState & GlassStoreActions;

type Listener = () => void;

const DEFAULTS: GlassMaterialPreset = {
  ior: 3.0,
  thickness: 50,
  blur: 1.5,
  bezel: 60,
  specular: 0.55,
  tint: 0.08,
  shadow: 0.5,
};

const STORAGE_KEY = 'neos_glass_preset';

const loadSavedParams = (): Partial<GlassMaterialPreset> => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (err) {
    console.warn('Failed to load glass preset from localStorage', err);
  }
  return {};
};

const saveParams = (params: GlassMaterialPreset) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(params));
  } catch (err) {
    console.warn('Failed to save glass preset to localStorage', err);
  }
};

let state: GlassStoreState = {
  ...DEFAULTS,
  ...loadSavedParams(),
  visible: false,
};

const listeners = new Set<Listener>();

const emitChange = (): void => {
  listeners.forEach((listener) => listener());
};

const setState = (updater: (current: GlassStoreState) => GlassStoreState): void => {
  const nextState = updater(state);
  if (Object.is(nextState, state)) {
    return;
  }
  state = nextState;
  
  // Persist material params
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { visible, ...params } = state;
  saveParams(params);
  
  snapshot = buildSnapshot();
  emitChange();
};

const actions: GlassStoreActions = {
  setParam(key: keyof GlassMaterialPreset, value: number): void {
    setState((current) => ({ ...current, [key]: value }));
  },
  togglePanel(): void {
    setState((current) => ({ ...current, visible: !current.visible }));
  },
  resetToDefaults(): void {
    setState((current) => ({ ...current, ...DEFAULTS }));
  }
};

const buildSnapshot = (): GlassStore => ({
  ...state,
  ...actions,
});

let snapshot: GlassStore = buildSnapshot();

export const glassStore = {
  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return (): void => {
      listeners.delete(listener);
    };
  },
  getState(): GlassStore {
    return snapshot;
  },
  ...actions,
};

export function useGlassStore<T>(selector: (store: GlassStore) => T): T {
  return useSyncExternalStore(
    glassStore.subscribe,
    () => selector(glassStore.getState()),
    () => selector(glassStore.getState()),
  );
}
