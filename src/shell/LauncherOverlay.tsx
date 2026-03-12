import { useMemo, useState } from 'react';
import type { ReactElement } from 'react';
import type { LauncherApp } from './mockApps';

interface LauncherOverlayProps {
  apps: LauncherApp[];
  onClose: () => void;
}

interface LauncherSection {
  category: string;
  apps: LauncherApp[];
}

function filterApps(apps: LauncherApp[], query: string): LauncherApp[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return apps;
  }

  return apps.filter((app) => {
    const haystack = `${app.name} ${app.category}`.toLowerCase();
    return haystack.includes(normalizedQuery);
  });
}

function groupByCategory(apps: LauncherApp[]): LauncherSection[] {
  const sections = new Map<string, LauncherApp[]>();

  for (const app of apps) {
    const section = sections.get(app.category);
    if (section) {
      section.push(app);
      continue;
    }
    sections.set(app.category, [app]);
  }

  return Array.from(sections.entries()).map(([category, categoryApps]) => ({
    category,
    apps: categoryApps,
  }));
}

export function LauncherOverlay({
  apps,
  onClose,
}: LauncherOverlayProps): ReactElement {
  const [query, setQuery] = useState('');
  const visibleSections = useMemo<LauncherSection[]>(() => {
    return groupByCategory(filterApps(apps, query));
  }, [apps, query]);

  return (
    <section className="launcherOverlay" role="presentation" onClick={onClose}>
      <div
        aria-label="NEOS Launcher"
        aria-modal="true"
        className="launcherPanel"
        role="dialog"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="launcherHeader">
          <p className="launcherEyebrow">NEOS</p>
          <h2 className="launcherTitle">Launcher</h2>
        </header>

        <label className="launcherSearchWrap" htmlFor="launcher-search">
          <span className="srOnly">Search apps</span>
          <input
            autoFocus
            className="launcherSearch"
            id="launcher-search"
            name="launcher-search"
            placeholder="search apps..."
            type="search"
            value={query}
            onChange={(event) => setQuery(event.currentTarget.value)}
          />
        </label>

        <div className="launcherSections">
          {visibleSections.length > 0 ? (
            visibleSections.map((section) => (
              <section className="launcherSection" key={section.category}>
                <h3 className="launcherSectionTitle">{section.category}</h3>
                <div className="launcherGrid">
                  {section.apps.map((app) => (
                    <button
                      key={app.id}
                      className="launcherCard"
                      type="button"
                      title={`${app.name} (placeholder)`}
                    >
                      <span className="launcherIcon" aria-hidden="true">
                        {app.icon}
                      </span>
                      <span className="launcherName">{app.name}</span>
                    </button>
                  ))}
                </div>
              </section>
            ))
          ) : (
            <p className="launcherEmpty">No apps found for this search.</p>
          )}
        </div>
      </div>
    </section>
  );
}
