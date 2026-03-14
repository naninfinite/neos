import { createElement, useEffect, type ReactElement } from 'react';
import { Desktop } from '../desktop/Desktop';

function prefetchVfsNonBlocking(): void {
  // SHELL-01A keeps bootstrap lightweight and never blocks desktop render on VFS.
}

export function OsBootstrap(): ReactElement {
  useEffect(() => {
    prefetchVfsNonBlocking();
  }, []);

  return createElement(Desktop);
}
