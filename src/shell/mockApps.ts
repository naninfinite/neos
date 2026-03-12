export interface LauncherApp {
  id: string;
  name: string;
  category: string;
  icon: string;
}

export const MOCK_LAUNCHER_APPS: LauncherApp[] = [
  { id: 'home', name: 'Home.EXE', category: 'System', icon: 'HM' },
  { id: 'terminal', name: 'Terminal.EXE', category: 'System', icon: 'TR' },
  { id: 'fileman', name: 'FileMan.EXE', category: 'System', icon: 'FM' },
  { id: 'me', name: 'ME.EXE', category: 'Personal', icon: 'ME' },
  { id: 'you', name: 'YOU.EXE', category: 'Personal', icon: 'YO' },
  { id: 'third', name: 'THIRD.EXE', category: 'Creative', icon: '3D' },
  { id: 'connect', name: 'CONNECT.EXE', category: 'Games', icon: 'CN' },
];
