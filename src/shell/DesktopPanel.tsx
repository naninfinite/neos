import type { ReactElement } from 'react';
import type { DesktopPanelPreview } from './desktopPanels';

interface DesktopPanelProps {
  panel: DesktopPanelPreview;
  onOpenPanel: (appId: string) => void;
}

export function DesktopPanel({
  panel,
  onOpenPanel,
}: DesktopPanelProps): ReactElement {
  return (
    <article
      aria-label={`${panel.title} preview`}
      className={`desktopPanel desktopPanel--${panel.appId} ${
        panel.layout === 'hero' ? 'desktopPanel--hero' : 'desktopPanel--standard'
      }`}
    >
      <header className="desktopPanelTitlebar">
        <p className="desktopPanelApp">{panel.title}</p>
        <button
          className="desktopPanelOpen"
          type="button"
          onClick={() => onOpenPanel(panel.appId)}
        >
          Open {panel.title}
        </button>
      </header>

      <div className="desktopPanelBody">
        <p className="desktopPanelSubtitle">{panel.subtitle}</p>
        <p className="desktopPanelSummary">{panel.summary}</p>
        <p className="desktopPanelDetail">{panel.detail}</p>
      </div>
    </article>
  );
}
