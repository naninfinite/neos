import { useEffect, useRef, type CSSProperties, type ChangeEvent, type JSX } from 'react';
import { glassStore, type GlassMaterialPreset, type WallpaperPreset, useGlassStore } from './glassStore';
import { useGlassRegion } from './useGlassRegion';

const panelStyle = {
  position: 'fixed',
  top: '1.1rem',
  right: '1.1rem',
  width: 'min(20rem, calc(100vw - 2.2rem))',
  padding: '1rem',
  borderRadius: '16px',
  border: '1px solid rgba(255, 255, 255, 0.58)',
  background: 'rgba(255, 255, 255, 0.12)',
  backdropFilter: 'blur(14px)',
  boxShadow: '0 16px 40px rgba(120, 90, 60, 0.16)',
  color: '#2d2520',
  zIndex: 4,
} satisfies CSSProperties;

const sectionStyle = {
  display: 'grid',
  gap: '0.78rem',
} satisfies CSSProperties;

const labelRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: '0.75rem',
  marginBottom: '0.28rem',
  fontSize: '0.76rem',
} satisfies CSSProperties;

const sliderStyle = {
  width: '100%',
} satisfies CSSProperties;

const resetButtonStyle = {
  width: '100%',
  marginTop: '1rem',
  padding: '0.62rem 0.8rem',
  borderRadius: '999px',
  border: '1px solid rgba(255,255,255,0.58)',
  background: 'rgba(255,255,255,0.22)',
  color: '#2d2520',
  cursor: 'pointer',
  fontWeight: 700,
} satisfies React.CSSProperties;

type GlassParamKey = keyof GlassMaterialPreset;

interface SliderConfig {
  key: GlassParamKey;
  label: string;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
}

const wallpaperButtonStyle = {
  borderRadius: '8px',
  border: '1px solid rgba(255,255,255,0.5)',
  background: 'rgba(255,255,255,0.12)',
  padding: '0.34rem 0.58rem',
  fontSize: '0.7rem',
  fontWeight: 600,
  color: '#2d2520',
  cursor: 'pointer',
} satisfies CSSProperties;

const wallpaperButtonActiveStyle = {
  borderColor: 'rgba(255,255,255,0.85)',
  background: 'rgba(255,255,255,0.3)',
} satisfies CSSProperties;

const WALLPAPER_OPTIONS: { key: WallpaperPreset; label: string }[] = [
  { key: 'reference', label: 'Interior' },
  { key: 'editorial', label: 'Mountain' },
  { key: 'diagnostic', label: 'Block Color' },
  { key: 'gradient', label: 'Gradient' },
];

const SLIDERS: SliderConfig[] = [
  { key: 'ior', label: 'IOR', min: 1, max: 3, step: 0.01, format: (v) => v.toFixed(2) },
  { key: 'thickness', label: 'Thickness', min: 0, max: 200, step: 1, format: (v) => v.toFixed(0) },
  { key: 'blur', label: 'Blur', min: 0, max: 40, step: 0.5, format: (v) => `${v.toFixed(1)} px` },
  { key: 'bezel', label: 'Bezel', min: 10, max: 100, step: 1, format: (v) => `${v.toFixed(0)} px` },
  { key: 'specular', label: 'Specular', min: 0, max: 1, step: 0.01, format: (v) => v.toFixed(2) },
  { key: 'tint', label: 'Tint', min: 0, max: 0.5, step: 0.01, format: (v) => `${(v * 100).toFixed(0)}%` },
  { key: 'shadow', label: 'Shadow', min: 0, max: 1, step: 0.01, format: (v) => v.toFixed(2) },
];

export function GlassTuningPanel(): JSX.Element | null {
  const storeState = useGlassStore((state) => state);
  const panelRef = useRef<HTMLDivElement>(null);

  useGlassRegion(panelRef, { radius: 16 });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === '`') {
        glassStore.togglePanel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!storeState.visible) {
    return null;
  }

  const handleChange = (key: GlassParamKey, event: ChangeEvent<HTMLInputElement>) => {
    glassStore.setParam(key, Number(event.target.value));
  };

  return (
    <div ref={panelRef} style={panelStyle}>
      <h3 style={{ margin: 0, fontSize: '0.96rem', letterSpacing: '0.04em' }}>
        Glass Dev Tuning
      </h3>
      <p style={{ margin: '0.32rem 0 1rem', fontSize: '0.74rem', color: 'rgba(45, 37, 32, 0.72)' }}>
        Toggle with Ctrl + ` | archisvaze/liquid-glass parity
      </p>

      <div style={{ marginBottom: '0.9rem' }}>
        <div style={{ ...labelRowStyle, marginBottom: '0.45rem' }}>
          <span>Wallpaper</span>
          <span>{WALLPAPER_OPTIONS.find((o) => o.key === storeState.wallpaper)?.label}</span>
        </div>
        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
          {WALLPAPER_OPTIONS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              style={{
                ...wallpaperButtonStyle,
                ...(storeState.wallpaper === key ? wallpaperButtonActiveStyle : {}),
              }}
              onClick={() => glassStore.setWallpaper(key)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div style={sectionStyle}>
        {SLIDERS.map(({ key, label, min, max, step, format }) => (
          <label key={key}>
            <div style={labelRowStyle}>
              <span>{label}</span>
              <span>{format(storeState[key])}</span>
            </div>
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={storeState[key]}
              onChange={(event) => handleChange(key, event)}
              style={sliderStyle}
            />
          </label>
        ))}
      </div>

      <button type="button" onClick={() => glassStore.resetToDefaults()} style={resetButtonStyle}>
        Reset Defaults
      </button>
    </div>
  );
}
