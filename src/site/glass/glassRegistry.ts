/**
 * Global registry of glass regions.
 *
 * Components register their bounding rectangles here via useGlassRegion.
 * The renderer reads the registry each frame to build uniform arrays.
 */

export interface GlassRegion {
  id: string;
  /** Centre X in viewport pixels (DOM coordinate system, origin top-left). */
  x: number;
  /** Centre Y in viewport pixels. */
  y: number;
  /** Width in pixels. */
  width: number;
  /** Height in pixels. */
  height: number;
  /** CSS border-radius equivalent, in pixels. */
  radius: number;
}

const regions = new Map<string, GlassRegion>();

let version = 0;

export function registerRegion(region: GlassRegion): void {
  regions.set(region.id, region);
  version++;
}

export function unregisterRegion(id: string): void {
  regions.delete(id);
  version++;
}

export function getRegions(): GlassRegion[] {
  return Array.from(regions.values());
}

export function getVersion(): number {
  return version;
}
