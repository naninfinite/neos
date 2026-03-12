import type { ReactElement } from 'react';

export function BootOverlay(): ReactElement {
  return (
    <section aria-label="Boot overlay" className="bootOverlay">
      <div className="bootSurface">
        <p className="bootBrand">NEOS</p>
        <h1 className="bootTitle">Initialising shell</h1>
        <p className="bootSubtitle">Desktop stack online.</p>
      </div>
    </section>
  );
}
