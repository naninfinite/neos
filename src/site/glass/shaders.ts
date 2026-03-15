/**
 * Liquid Glass GLSL shaders — raw WebGL2.
 *
 * Faithfully ported from archisvaze/liquid-glass (WebGL approach),
 * adapted for multi-region rendering on a single full-screen quad.
 *
 * Key differences from previous version:
 * - SDF gradient-based refraction direction (not center-pointing)
 * - Proper finite-difference surface slope for Snell's law
 * - Gaussian shadow falloff
 * - Directional specular with light vector
 * - Inner shadow + inner rim highlight
 * - Nearly-opaque alpha inside glass (smoothstep at edge)
 * - Background aspect-ratio correction
 * - Tint and shadow uniforms
 */

export const MAX_REGIONS = 16;

export const VERTEX_SHADER = /* glsl */ `#version 300 es
precision highp float;

in vec2 aPosition;
out vec2 vUv;

void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

export const FRAGMENT_SHADER = /* glsl */ `#version 300 es
precision highp float;

#define MAX_REGIONS 16
#define NUM_SAMPLES 16

/* ── Uniforms ────────────────────────────────────────────── */

uniform vec2  uResolution;
uniform sampler2D uBgTex;
uniform float uBgAspect;     // background image aspect ratio

// Per-region data (pixel coords, bottom-left origin)
uniform int   uRegionCount;
uniform vec4  uRegions[MAX_REGIONS]; // xy = center,  zw = halfSize
uniform float uRadii[MAX_REGIONS];   // corner radius

// Global glass tuning (matches archisvaze defaults)
uniform float uIOR;        // index of refraction  (1.0 – 3.0)
uniform float uThickness;  // refraction magnitude (0.0 – 200.0)
uniform float uBlur;       // background blur px   (0.0 – 40.0)
uniform float uBezel;      // edge bevel width px  (10 – 100)
uniform float uSpecular;   // rim highlight         (0.0 – 1.0)
uniform float uTint;       // white tint mix        (0.0 – 1.0)
uniform float uShadow;     // shadow intensity      (0.0 – 1.0)

in  vec2 vUv;
out vec4 fragColor;

/* ── Poisson disk (16-tap) ───────────────────────────────── */

const vec2 poisson[NUM_SAMPLES] = vec2[](
  vec2(-0.94201, -0.39906),
  vec2( 0.94558, -0.76890),
  vec2(-0.09418, -0.92938),
  vec2( 0.34495,  0.29387),
  vec2(-0.91588, -0.45771),
  vec2(-0.81544,  0.48568),
  vec2(-0.38277, -0.56071),
  vec2(-0.12675,  0.84686),
  vec2( 0.89642,  0.41254),
  vec2( 0.18150, -0.30020),
  vec2(-0.01445, -0.16001),
  vec2( 0.59614,  0.71118),
  vec2( 0.49742, -0.47280),
  vec2( 0.80685,  0.04588),
  vec2(-0.32490, -0.03965),
  vec2(-0.60975,  0.06566)
);

/* ── SDF helpers ─────────────────────────────────────────── */

float sdRoundedRect(vec2 p, vec2 halfSize, float r) {
  vec2 q = abs(p) - halfSize + r;
  return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
}

// Glass bulge profile: convex squircle (matches archisvaze/liquid-glass).
float surfaceHeight(float t) {
  float s = 1.0 - t;
  return pow(1.0 - s*s*s*s, 0.25);
}

/* ── Background sampling with aspect correction ──────────── */

vec3 sampleBg(vec2 screenUV) {
  float screenAspect = uResolution.x / uResolution.y;
  vec2 uv = screenUV;
  if (uBgAspect > screenAspect) {
    float s = screenAspect / uBgAspect;
    uv.x = uv.x * s + (1.0 - s) * 0.5;
  } else {
    float s = uBgAspect / screenAspect;
    uv.y = uv.y * s + (1.0 - s) * 0.5;
  }
  uv.y = 1.0 - uv.y;
  return texture(uBgTex, uv).rgb;
}

vec3 sampleBgBlurred(vec2 uv, float radius) {
  if (radius < 0.5) return sampleBg(uv);
  vec3 sum = vec3(0.0);
  vec2 px = 1.0 / uResolution;
  for (int i = 0; i < NUM_SAMPLES; i++) {
    sum += sampleBg(uv + poisson[i] * radius * px);
  }
  return sum / float(NUM_SAMPLES);
}

/* ── Main ────────────────────────────────────────────────── */

void main() {
  vec2 screenPx = vec2(vUv.x, 1.0 - vUv.y) * uResolution;

  /* ── Find closest glass region ─────────────────────────── */
  float bestDist = 1e6;
  int   bestIdx  = -1;

  for (int i = 0; i < MAX_REGIONS; i++) {
    if (i >= uRegionCount) break;
    float d = sdRoundedRect(
      screenPx - uRegions[i].xy,
      uRegions[i].zw,
      uRadii[i]
    );
    if (d < bestDist) {
      bestDist = d;
      bestIdx  = i;
    }
  }

  // Far from every region → fully transparent
  if (bestIdx < 0 || bestDist > 60.0) {
    fragColor = vec4(0.0);
    return;
  }

  /* ── Shadow zone (outside glass, close to edge) ────────── */
  /* Gaussian falloff matching archisvaze */
  if (bestDist > 0.0) {
    float shadowFalloff = exp(-bestDist * bestDist / 800.0);
    float shadowAlpha = uShadow * shadowFalloff * 0.6;
    fragColor = vec4(0.0, 0.0, 0.0, shadowAlpha);
    return;
  }

  /* ── Inside glass ──────────────────────────────────────── */
  vec2  center   = uRegions[bestIdx].xy;
  vec2  halfSize = uRegions[bestIdx].zw;
  float radius   = uRadii[bestIdx];
  vec2  p        = screenPx - center;

  float distFromEdge = -bestDist;
  float bezel = min(uBezel, min(radius, min(halfSize.x, halfSize.y)) - 1.0);
  float t     = clamp(distFromEdge / bezel, 0.0, 1.0);

  float h = surfaceHeight(t);

  /* ── Proper surface slope via finite differences ────────── */
  float dt = 0.001;
  float h2 = surfaceHeight(min(t + dt, 1.0));
  float dh = (h2 - h) / dt;

  float slopeAngle = atan(dh * (uThickness / bezel));
  float sinR       = sin(slopeAngle) / uIOR;
  sinR             = clamp(sinR, -1.0, 1.0);
  float thetaR     = asin(sinR);
  float displacement = h * uThickness * (tan(slopeAngle) - tan(thetaR));

  /* ── SDF gradient for refraction direction ──────────────── */
  /* This is the key difference from our old shader:
     archisvaze computes the actual surface normal via finite
     differences of the SDF, not a center-pointing vector */
  float eps = 0.5;
  vec2 grad;
  grad.x = sdRoundedRect(p + vec2(eps, 0.0), halfSize, radius) - bestDist;
  grad.y = sdRoundedRect(p + vec2(0.0, eps), halfSize, radius) - bestDist;
  grad = normalize(grad);

  vec2 offset = -grad * displacement / uResolution;

  vec2 screenUV = screenPx / uResolution;
  vec2 refractedUV = screenUV + offset;

  /* ── Poisson-disk blurred background sample ────────────── */
  vec3 color = sampleBgBlurred(refractedUV, uBlur);

  /* ── Directional specular (archisvaze light model) ──────── */
  vec2  lightDir     = normalize(vec2(0.5, -0.7));
  float rimDot       = abs(dot(grad, lightDir));
  float rimFalloff   = 1.0 - smoothstep(0.0, bezel * 0.4, distFromEdge);
  float specHighlight = pow(rimDot * rimFalloff, 1.5);
  color += vec3(specHighlight * uSpecular);

  /* ── Inner shadow (archisvaze edge darkening) ──────────── */
  float innerShadow = 1.0 - smoothstep(0.0, bezel * 0.6, distFromEdge);
  color *= mix(1.0, 0.7, innerShadow * 0.3);

  /* ── Inner rim highlight (thin bright edge) ────────────── */
  float innerRim = smoothstep(0.0, 2.0, distFromEdge)
                 * (1.0 - smoothstep(2.0, 5.0, distFromEdge));
  color += vec3(innerRim * 0.15 * uSpecular);

  /* ── Tint (mix toward white) ───────────────────────────── */
  color = mix(color, vec3(1.0), uTint);

  /* ── Alpha: nearly opaque inside, transparent at edge ──── */
  float alpha = smoothstep(0.0, 1.5, distFromEdge);

  fragColor = vec4(color, alpha);
}
`;
