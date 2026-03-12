import type { ReactElement } from 'react';
import type { DesktopPanelPreview } from './desktopPanels';

interface DesktopPanelProps {
  panel: DesktopPanelPreview;
  isHero?: boolean;
  onOpenPanel: (appId: string) => void;
  onPromote?: (appId: string) => void;
}

export function DesktopPanel({
  panel,
  isHero = false,
  onOpenPanel,
  onPromote,
}: DesktopPanelProps): ReactElement {
  const handleClick = () => {
    if (!isHero && onPromote) {
      onPromote(panel.appId);
    }
  };

  return (
    <article
      aria-label={`${panel.title} preview`}
      className={`desktopPanel desktopPanel--${panel.appId} ${
        isHero ? 'desktopPanel--hero' : 'desktopPanel--dock'
      }`}
      onClick={handleClick}
      role={!isHero ? 'button' : undefined}
      tabIndex={!isHero ? 0 : undefined}
      onKeyDown={(e) => {
        if (!isHero && onPromote && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onPromote(panel.appId);
        }
      }}
    >
      <header className="desktopPanelTitlebar">
        <p className="desktopPanelApp">{panel.title}</p>
        {isHero && (
          <button
            className="desktopPanelOpen"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenPanel(panel.appId);
            }}
          >
            Open {panel.title}
          </button>
        )}
      </header>

      <div className="desktopPanelBody">
        <p className="desktopPanelSubtitle">{panel.subtitle}</p>
        <p className="desktopPanelSummary">{panel.summary}</p>
        <p className="desktopPanelDetail">{panel.detail}</p>
      </div>
    </article>
  );
}
