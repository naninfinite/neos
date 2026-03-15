/**
 * Raw WebGL2 renderer for the liquid-glass effect.
 *
 * Draws a single full-screen quad whose fragment shader evaluates all
 * registered glass regions in one pass (SDF loop, Snell's-law refraction,
 * Poisson-disk blur, specular highlights, soft shadows).
 *
 * Background texture is loaded from a real image (or generated fallback)
 * so the refraction distorts actual visual content — not a flat gradient.
 */

import { VERTEX_SHADER, FRAGMENT_SHADER, MAX_REGIONS } from './shaders';
import { getRegions } from './glassRegistry';
import { glassStore } from './glassStore';

/* ── Helpers ─────────────────────────────────────────────── */

function compileShader(
  gl: WebGL2RenderingContext,
  type: number,
  source: string,
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader compile error:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

/**
 * Generate a block-color diagnostic background for testing refraction.
 * Four quadrants: warm red, gold, teal, deep blue — so distortion
 * direction is immediately visible.
 */
export function renderDiagnosticBackground(canvas: HTMLCanvasElement, w: number, h: number): void {
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  const hw = w / 2;
  const hh = h / 2;

  ctx.fillStyle = '#c44d3f'; // top-left: warm red
  ctx.fillRect(0, 0, hw, hh);
  ctx.fillStyle = '#d4a040'; // top-right: gold
  ctx.fillRect(hw, 0, hw, hh);
  ctx.fillStyle = '#3a8a7a'; // bottom-left: teal
  ctx.fillRect(0, hh, hw, hh);
  ctx.fillStyle = '#2d4a8a'; // bottom-right: deep blue
  ctx.fillRect(hw, hh, hw, hh);
}

/**
 * Render the SiteShell background gradient to an offscreen canvas.
 * Used as fallback when the wallpaper image hasn't loaded yet.
 */
function renderGradientBackground(canvas: HTMLCanvasElement, w: number, h: number): void {
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  const angle = (145 * Math.PI) / 180;
  const cx = w / 2;
  const cy = h / 2;
  const reach = Math.max(w, h);
  const grad = ctx.createLinearGradient(
    cx - Math.cos(angle) * reach,
    cy - Math.sin(angle) * reach,
    cx + Math.cos(angle) * reach,
    cy + Math.sin(angle) * reach,
  );
  grad.addColorStop(0, '#f5e6d3');
  grad.addColorStop(0.35, '#e8d5c4');
  grad.addColorStop(0.65, '#d4a574');
  grad.addColorStop(1, '#c4956a');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  const r2 = ctx.createRadialGradient(w * 0.85, h * 0.8, 0, w * 0.85, h * 0.8, reach * 0.5);
  r2.addColorStop(0, 'rgba(228,180,140,0.7)');
  r2.addColorStop(1, 'rgba(228,180,140,0)');
  ctx.fillStyle = r2;
  ctx.fillRect(0, 0, w, h);

  const r1 = ctx.createRadialGradient(w * 0.14, h * 0.16, 0, w * 0.14, h * 0.16, reach * 0.7);
  r1.addColorStop(0, 'rgba(255,245,235,0.95)');
  r1.addColorStop(0.42, 'rgba(248,232,216,0.88)');
  r1.addColorStop(0.7, 'rgba(255,245,235,0)');
  ctx.fillStyle = r1;
  ctx.fillRect(0, 0, w, h);
}

/* ── Background wallpaper URL ────────────────────────────── */

// Default: archisvaze reference wallpaper (rich interior photo shows refraction well)
const WALLPAPER_URL =
  'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop';

/* ── Public entry point ──────────────────────────────────── */

export function createGlassRenderer(canvas: HTMLCanvasElement): () => void {
  const maybeGl = canvas.getContext('webgl2', {
    alpha: true,
    premultipliedAlpha: false,
    antialias: false,
  });

  if (!maybeGl) {
    console.warn('[LiquidGlass] WebGL2 unavailable — CSS fallback active');
    return () => {};
  }

  const gl: WebGL2RenderingContext = maybeGl;

  /* ── Compile & link ──────────────────────────────────── */

  const vs = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
  if (!vs || !fs) return () => {};

  const program = gl.createProgram()!;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('[LiquidGlass] Link error:', gl.getProgramInfoLog(program));
    return () => {};
  }

  /* ── Full-screen quad (triangle strip, 4 verts) ──────── */

  const vao = gl.createVertexArray()!;
  gl.bindVertexArray(vao);

  const posBuf = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
    gl.STATIC_DRAW,
  );

  const aPos = gl.getAttribLocation(program, 'aPosition');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
  gl.bindVertexArray(null);

  /* ── Uniform locations ───────────────────────────────── */

  gl.useProgram(program);

  const loc = {
    resolution:  gl.getUniformLocation(program, 'uResolution'),
    bgTex:       gl.getUniformLocation(program, 'uBgTex'),
    bgAspect:    gl.getUniformLocation(program, 'uBgAspect'),
    regionCount: gl.getUniformLocation(program, 'uRegionCount'),
    regions:     Array.from({ length: MAX_REGIONS }, (_, i) =>
      gl.getUniformLocation(program, `uRegions[${i}]`),
    ),
    radii: Array.from({ length: MAX_REGIONS }, (_, i) =>
      gl.getUniformLocation(program, `uRadii[${i}]`),
    ),
    ior:       gl.getUniformLocation(program, 'uIOR'),
    thickness: gl.getUniformLocation(program, 'uThickness'),
    blur:      gl.getUniformLocation(program, 'uBlur'),
    bezel:     gl.getUniformLocation(program, 'uBezel'),
    specular:  gl.getUniformLocation(program, 'uSpecular'),
    tint:      gl.getUniformLocation(program, 'uTint'),
    shadow:    gl.getUniformLocation(program, 'uShadow'),
  };

  /* ── Background texture ──────────────────────────────── */

  const bgTex = gl.createTexture()!;
  gl.bindTexture(gl.TEXTURE_2D, bgTex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  let bgAspect = 1.5; // default until image loads

  // Start with gradient fallback, then load real wallpaper
  const fallbackCanvas = document.createElement('canvas');

  function uploadFallback(w: number, h: number): void {
    renderGradientBackground(fallbackCanvas, w, h);
    bgAspect = w / h;
    gl.bindTexture(gl.TEXTURE_2D, bgTex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, fallbackCanvas);
  }

  // Load real wallpaper image
  const wallpaperImg = new Image();
  wallpaperImg.crossOrigin = 'anonymous';
  let wallpaperLoaded = false;

  wallpaperImg.onload = () => {
    wallpaperLoaded = true;
    bgAspect = wallpaperImg.width / wallpaperImg.height;
    gl.bindTexture(gl.TEXTURE_2D, bgTex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, wallpaperImg);

    // Also set the DOM background to match
    const bgEl = document.getElementById('site-shell-bg');
    if (bgEl) {
      bgEl.style.background = `url('${WALLPAPER_URL}') center/cover no-repeat`;
    }
  };

  wallpaperImg.onerror = () => {
    console.warn('[LiquidGlass] Failed to load wallpaper, using gradient fallback');
  };

  wallpaperImg.src = WALLPAPER_URL;

  /* ── Resize ──────────────────────────────────────────── */

  function resize(): boolean {
    const rect = canvas.getBoundingClientRect();
    const w = Math.round(rect.width);
    const h = Math.round(rect.height);
    if (canvas.width === w && canvas.height === h) return false;
    canvas.width = w;
    canvas.height = h;
    gl.viewport(0, 0, w, h);
    if (!wallpaperLoaded) {
      uploadFallback(w, h);
    }
    return true;
  }

  /* ── Render loop ─────────────────────────────────────── */

  let running = true;
  let raf = 0;

  function render(): void {
    if (!running) return;

    resize();

    const regions = getRegions();
    const count = Math.min(regions.length, MAX_REGIONS);

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    if (count === 0) {
      raf = requestAnimationFrame(render);
      return;
    }

    gl.useProgram(program);
    gl.bindVertexArray(vao);

    // Resolution + background aspect
    gl.uniform2f(loc.resolution, canvas.width, canvas.height);
    gl.uniform1f(loc.bgAspect, bgAspect);

    // Regions — convert DOM coords (top-left origin) to GL (bottom-left)
    gl.uniform1i(loc.regionCount, count);
    for (let i = 0; i < count; i++) {
      const r = regions[i];
      gl.uniform4f(
        loc.regions[i],
        r.x,                         // centre X (px)
        canvas.height - r.y,         // centre Y flipped
        r.width / 2,                 // half-width
        r.height / 2,                // half-height
      );
      gl.uniform1f(loc.radii[i], r.radius);
    }

    // Global glass params
    const state = glassStore.getState();
    gl.uniform1f(loc.ior, state.ior);
    gl.uniform1f(loc.thickness, state.thickness);
    gl.uniform1f(loc.blur, state.blur);
    gl.uniform1f(loc.bezel, state.bezel);
    gl.uniform1f(loc.specular, state.specular);
    gl.uniform1f(loc.tint, state.tint);
    gl.uniform1f(loc.shadow, state.shadow);

    // Background texture (unit 0)
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, bgTex);
    gl.uniform1i(loc.bgTex, 0);

    // Blending
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    gl.bindVertexArray(null);

    raf = requestAnimationFrame(render);
  }

  render();

  /* ── Cleanup ─────────────────────────────────────────── */

  return () => {
    running = false;
    cancelAnimationFrame(raf);
    gl.deleteProgram(program);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    gl.deleteBuffer(posBuf);
    gl.deleteVertexArray(vao);
    gl.deleteTexture(bgTex);
  };
}
