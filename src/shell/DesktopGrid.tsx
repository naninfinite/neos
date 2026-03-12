import type { ReactElement } from 'react';
import { DesktopPanel } from './DesktopPanel';
import type { DesktopPanelPreview } from './desktopPanels';

interface DesktopGridProps {
  panels: DesktopPanelPreview[];
  onOpenPanel: (appId: string) => void;
}

export function DesktopGrid({
  panels,
  onOpenPanel,
}: DesktopGridProps): ReactElement {
  return (
    <section aria-label="Desktop surface" className="desktopSurface">
      <div className="desktopGrid">
        {panels.map((panel) => (
          <DesktopPanel key={panel.id} panel={panel} onOpenPanel={onOpenPanel} />
        ))}
      </div>
    </section>
  );
}
