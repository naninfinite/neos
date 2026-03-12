export interface DesktopPanelPreview {
  id: string;
  appId: string;
  title: string;
  subtitle: string;
  summary: string;
  detail: string;
}

export const DESKTOP_PANEL_PREVIEWS: DesktopPanelPreview[] = [
  {
    id: 'panel-me',
    appId: 'me',
    title: 'ME.EXE',
    subtitle: 'Portfolio Surface',
    summary: 'Projects, notes, and profile context.',
    detail: 'Primary identity surface for the rebuild.',
  },
  {
    id: 'panel-you',
    appId: 'you',
    title: 'YOU.EXE',
    subtitle: 'Message Board',
    summary: 'Community and direct response layer.',
    detail: 'Future message stream and interaction queue.',
  },
  {
    id: 'panel-third',
    appId: 'third',
    title: 'THIRD.EXE',
    subtitle: '3D Workspace',
    summary: 'Experimental spatial surface.',
    detail: 'Reserved slot for real-time scene previews.',
  },
  {
    id: 'panel-home',
    appId: 'home',
    title: 'HOME',
    subtitle: 'System Snapshot',
    summary: 'NEOS desktop status and launch hints.',
    detail: 'Runtime milestone: Stage 1A landing model.',
  },
];
