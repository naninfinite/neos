/**
 * Full-screen WebGL2 canvas that renders the liquid-glass effect.
 *
 * Positioned absolute behind all DOM content inside SiteShell.
 * Transparent everywhere except registered glass regions, where it
 * shows refracted/distorted background with specular highlights.
 *
 * pointer-events: none — all interaction passes through to the DOM.
 */

import { useEffect, useRef, type CSSProperties, type JSX } from 'react';
import { createGlassRenderer } from './glassRenderer';

const canvasStyle: CSSProperties = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  zIndex: 0,
  pointerEvents: 'none',
};

export function GlassCanvas(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    return createGlassRenderer(canvas);
  }, []);

  return <canvas ref={canvasRef} style={canvasStyle} />;
}
