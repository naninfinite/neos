/**
 * Raw WebGL2 renderer for the liquid-glass effect.
 *
 * Draws a single full-screen quad whose fragment shader evaluates all
 * registered glass regions in one pass (SDF loop, Snell's-law refraction,
 * Poisson-disk blur, specular highlights, soft shadows).
 *
 * The background texture is an offscreen-canvas reproduction of the
 * SiteShell CSS gradient so the refraction distorts the correct imagery.
 */

import { VERTEX_SHADER, FRAGMENT_SHADER, MAX_REGIONS } from './shaders';
import { getRegions } from './glassRegistry';

/* ── Glass tuning knobs ──────────────────────────────────── */

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
 * Render the SiteShell background gradient to an offscreen canvas.
 * This canvas is uploaded as the WebGL background texture so the
 * refraction shader distorts the correct colours.
 */
function renderBackground(canvas: HTMLCanvasElement, w: number, h: number): void {
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  // 1. Base linear gradient — warm neutral tones (no blue)
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

  // 2. Radial warm highlight — bottom right
  const r2 = ctx.createRadialGradient(
    w * 0.85, h * 0.8, 0,
    w * 0.85, h * 0.8, reach * 0.5,
  );
  r2.addColorStop(0, 'rgba(228,180,140,0.7)');
  r2.addColorStop(1, 'rgba(228,180,140,0)');
  ctx.fillStyle = r2;
  ctx.fillRect(0, 0, w, h);

  // 3. Radial light wash — top left
  const r1 = ctx.createRadialGradient(
    w * 0.14, h * 0.16, 0,
    w * 0.14, h * 0.16, reach * 0.7,
  );
  r1.addColorStop(0, 'rgba(255,245,235,0.95)');
  r1.addColorStop(0.42, 'rgba(248,232,216,0.88)');
  r1.addColorStop(0.7, 'rgba(255,245,235,0)');
  ctx.fillStyle = r1;
  ctx.fillRect(0, 0, w, h);
}

/* ── Public entry point ──────────────────────────────────── */

/**
 * Initialise the liquid-glass renderer on the given `<canvas>`.
 * Returns a cleanup function for React's useEffect teardown.
 */
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
  };

  /* ── Background texture ──────────────────────────────── */

  const bgTex = gl.createTexture()!;
  gl.bindTexture(gl.TEXTURE_2D, bgTex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  const bgCanvas = document.createElement('canvas');

  function uploadBackground(w: number, h: number): void {
    renderBackground(bgCanvas, w, h);
    gl.bindTexture(gl.TEXTURE_2D, bgTex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bgCanvas);
  }

  /* ── Resize ──────────────────────────────────────────── */

  function resize(): boolean {
    const rect = canvas.getBoundingClientRect();
    const w = Math.round(rect.width);
    const h = Math.round(rect.height);
    if (canvas.width === w && canvas.height === h) return false;
    canvas.width = w;
    canvas.height = h;
    gl.viewport(0, 0, w, h);
    uploadBackground(w, h);
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

    // Resolution
    gl.uniform2f(loc.resolution, canvas.width, canvas.height);

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
    const { ior, thickness, blur, bezel, specular } = glassStore.getState();
    gl.uniform1f(loc.ior, ior);
    gl.uniform1f(loc.thickness, thickness);
    gl.uniform1f(loc.blur, blur);
    gl.uniform1f(loc.bezel, bezel);
    gl.uniform1f(loc.specular, specular);

    // Background texture (unit 0)
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, bgTex);
    gl.uniform1i(loc.bgTex, 0);

    // Blending — shader outputs premultiplied-ish alpha
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
