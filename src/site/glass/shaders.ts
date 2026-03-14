/**
 * Liquid Glass GLSL shaders — raw WebGL2.
 *
 * Ported from archisvaze/liquid-glass (WebGL approach),
 * adapted for multi-region rendering on a single full-screen quad.
 *
 * The fragment shader supports up to MAX_REGIONS glass panes in one pass.
 * Each pane is an SDF rounded rectangle with Snell's law refraction,
 * Poisson-disk blur, specular rim lighting, and soft drop shadow.
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

// Per-region data (pixel coords, bottom-left origin)
uniform int   uRegionCount;
uniform vec4  uRegions[MAX_REGIONS]; // xy = center,  zw = halfSize
uniform float uRadii[MAX_REGIONS];   // corner radius

// Global glass tuning
uniform float uIOR;        // index of refraction  (1.0 – 3.0)
uniform float uThickness;  // refraction magnitude (0.0 – 2.0)
uniform float uBlur;       // background blur px   (0.0 – 40.0)
uniform float uBezel;      // edge bevel width px  (10 – 80)
uniform float uSpecular;   // rim highlight         (0.0 – 1.0)

in  vec2 vUv;
out vec4 fragColor;

/* ── Poisson disk (16-tap) ───────────────────────────────── */

const vec2 poisson[NUM_SAMPLES] = vec2[](
  vec2(-0.94201624, -0.39906216),
  vec2( 0.94558609, -0.76890725),
  vec2(-0.09418410, -0.92938870),
  vec2( 0.34495938,  0.29387760),
  vec2(-0.91588581,  0.45771432),
  vec2(-0.81544232, -0.87912464),
  vec2(-0.38277543,  0.27676845),
  vec2( 0.97484398,  0.75648379),
  vec2( 0.44323325, -0.97511554),
  vec2( 0.53742981, -0.47373420),
  vec2(-0.26496911, -0.41893023),
  vec2( 0.79197514,  0.19090188),
  vec2(-0.24188840,  0.99706507),
  vec2(-0.81409955,  0.91437590),
  vec2( 0.19984126,  0.78641367),
  vec2( 0.14383161, -0.14100790)
);

/* ── SDF helpers ─────────────────────────────────────────── */

float sdRoundedRect(vec2 p, vec2 halfSize, float r) {
  vec2 q = abs(p) - halfSize + r;
  return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
}

// Glass bulge profile: convex squircle (matches archisvaze/liquid-glass).
float surfaceHeight(float t) {
  return pow(1.0 - pow(1.0 - t, 4.0), 0.25);
}

/* ── Main ────────────────────────────────────────────────── */

void main() {
  vec2 fragCoord = vUv * uResolution;

  /* ── Find closest glass region ─────────────────────────── */
  float bestDist = 1e6;
  int   bestIdx  = -1;

  for (int i = 0; i < MAX_REGIONS; i++) {
    if (i >= uRegionCount) break;
    float d = sdRoundedRect(
      fragCoord - uRegions[i].xy,
      uRegions[i].zw,
      uRadii[i]
    );
    if (d < bestDist) {
      bestDist = d;
      bestIdx  = i;
    }
  }

  // Far from every region → fully transparent
  if (bestIdx < 0 || bestDist > 50.0) {
    fragColor = vec4(0.0);
    return;
  }

  /* ── Shadow zone (outside glass, close to edge) ────────── */
  if (bestDist > 0.0) {
    float s = smoothstep(50.0, 0.0, bestDist);
    fragColor = vec4(0.0, 0.0, 0.0, s * s * 0.09);
    return;
  }

  /* ── Inside glass ──────────────────────────────────────── */
  vec2  center   = uRegions[bestIdx].xy;
  vec2  halfSize = uRegions[bestIdx].zw;

  float distFromEdge = -bestDist;
  float bezelW       = min(uBezel, min(halfSize.x, halfSize.y));
  float t            = clamp(distFromEdge / bezelW, 0.0, 1.0);
  float h            = surfaceHeight(t);

  /* ── Snell's law refraction ────────────────────────────── */
  vec2  toCenter    = center - fragCoord;
  float dToCenter   = length(toCenter);
  vec2  dir         = dToCenter > 0.001 ? toCenter / dToCenter : vec2(0.0, 1.0);

  float slope       = h * 2.0 / max(bezelW, 1.0);
  float slopeAngle  = atan(slope);
  float sinR        = sin(slopeAngle) / uIOR;
  float thetaR      = asin(clamp(sinR, -1.0, 1.0));
  float displacement = h * uThickness * (tan(slopeAngle) - tan(thetaR));

  vec2 refractedUV = vUv + dir * displacement / uResolution;
  refractedUV      = clamp(refractedUV, vec2(0.0), vec2(1.0));

  /* ── Poisson-disk blurred background sample ────────────── */
  vec3 color     = vec3(0.0);
  vec2 blurScale = vec2(uBlur) / uResolution;

  for (int j = 0; j < NUM_SAMPLES; j++) {
    vec2 sampleUV = clamp(refractedUV + poisson[j] * blurScale, vec2(0.0), vec2(1.0));
    color += texture(uBgTex, sampleUV).rgb;
  }
  color /= float(NUM_SAMPLES);

  /* ── Specular rim + inner glow + subtle tint ─────────────── */
  float rimLight  = pow(1.0 - t, 3.5) * uSpecular;
  float innerGlow = h * 0.04;
  vec3  edgeTint  = vec3(1.0, 1.0, 1.0) * (1.0 - t) * 0.06;

  // Minimal white tint — keep glass nearly transparent like reference
  vec3 whiteTint = vec3(1.0) * 0.06 * h;

  vec3  final = color + vec3(rimLight + innerGlow) + edgeTint + whiteTint;
  float alpha = mix(0.45, 0.82, h);

  fragColor = vec4(final, alpha);
}
`;
