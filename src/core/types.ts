export const Z_LAYER = {
  WALLPAPER: 1,
  DESKTOP_ICONS: 2,
  WINDOWS: 3,
  TASKBAR: 4,
  OVERLAY: 5,
} as const;

export const SHELL_Z_INDEX = {
  WALLPAPER: 0,
  DESKTOP_ICONS: 10,
  WINDOWS: 100,
  TASKBAR: 900,
  LAUNCHER: 1000,
  OVERLAY: 9999,
} as const;

export const TASKBAR_HEIGHT_PX = 48;
