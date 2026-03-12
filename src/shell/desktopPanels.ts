export interface DesktopPanelPreview {
  id: string;
  appId: string;
  title: string;
  subtitle: string;
  summary: string;
  detail: string;
  layout: 'hero' | 'standard';
}

export const DESKTOP_PANEL_PREVIEWS: DesktopPanelPreview[] = [
  {
    id: 'panel-me',
    appId: 'me',
    title: 'ME.EXE',
    subtitle: 'Portfolio Surface',
    summary: 'Projects, notes, and profile context.',
    detail: 'Primary identity surface for the rebuild.',
    layout: 'hero',
  },
  {
    id: 'panel-you',
    appId: 'you',
    title: 'YOU.EXE',
    subtitle: 'Message Board',
    summary: 'Community and direct response layer.',
    detail: 'Future message stream and interaction queue.',
    layout: 'standard',
  },
  {
    id: 'panel-third',
    appId: 'third',
    title: 'THIRD.EXE',
    subtitle: '3D Workspace',
    summary: 'Experimental spatial surface.',
    detail: 'Reserved slot for real-time scene previews.',
    layout: 'standard',
  },
  {
    id: 'panel-connect',
    appId: 'connect',
    title: 'CONNECT.EXE',
    subtitle: 'Co-op Runtime',
    summary: 'Sun Maze greybox runtime foundation.',
    detail: 'M0 includes room phases, placeholders, and timer scaffolding.',
    layout: 'standard',
  },
];
