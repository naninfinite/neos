/**
 * React hook that registers a DOM element as a liquid-glass region.
 *
 * Usage:
 *   const ref = useRef<HTMLElement>(null);
 *   useGlassRegion(ref, { radius: 16 });
 *   return <header ref={ref} ... />;
 *
 * The hook tracks the element's viewport rect via ResizeObserver +
 * window resize/scroll, and registers it with the global glass registry
 * so the WebGL renderer can include it in its shader pass.
 */

import { useEffect, useId, type RefObject } from 'react';
import { registerRegion, unregisterRegion } from './glassRegistry';

export interface GlassRegionOptions {
  /** CSS border-radius in pixels (default 16). */
  radius?: number;
}

export function useGlassRegion(
  ref: RefObject<HTMLElement | null>,
  options?: GlassRegionOptions,
): void {
  const id = useId();
  const radius = options?.radius ?? 16;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = (): void => {
      const rect = el.getBoundingClientRect();
      registerRegion({
        id,
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        width: rect.width,
        height: rect.height,
        radius,
      });
    };

    const ro = new ResizeObserver(update);
    ro.observe(el);
    update();

    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
      unregisterRegion(id);
    };
  }, [id, ref, radius]);
}
