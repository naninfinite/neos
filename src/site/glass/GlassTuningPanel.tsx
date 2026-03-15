import { useEffect, useRef, type CSSProperties, type ChangeEvent, type JSX } from 'react';
import { glassStore, type GlassMaterialPreset, useGlassStore } from './glassStore';
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

export function GlassTuningPanel(): JSX.Element | null {
  const { visible, ior, thickness, blur, bezel, specular } = useGlassStore((state) => state);
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

  if (!visible) {
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
        Toggle with Ctrl + `
      </p>

      <div style={sectionStyle}>
        <label>
          <div style={labelRowStyle}>
            <span>IOR</span>
            <span>{ior.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="1"
            max="3"
            step="0.01"
            value={ior}
            onChange={(event) => handleChange('ior', event)}
            style={sliderStyle}
          />
        </label>

        <label>
          <div style={labelRowStyle}>
            <span>Thickness</span>
            <span>{thickness.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0"
            max="3"
            step="0.05"
            value={thickness}
            onChange={(event) => handleChange('thickness', event)}
            style={sliderStyle}
          />
        </label>

        <label>
          <div style={labelRowStyle}>
            <span>Blur</span>
            <span>{blur.toFixed(1)} px</span>
          </div>
          <input
            type="range"
            min="0"
            max="40"
            step="0.5"
            value={blur}
            onChange={(event) => handleChange('blur', event)}
            style={sliderStyle}
          />
        </label>

        <label>
          <div style={labelRowStyle}>
            <span>Bezel</span>
            <span>{bezel.toFixed(0)} px</span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            step="1"
            value={bezel}
            onChange={(event) => handleChange('bezel', event)}
            style={sliderStyle}
          />
        </label>

        <label>
          <div style={labelRowStyle}>
            <span>Specular</span>
            <span>{specular.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={specular}
            onChange={(event) => handleChange('specular', event)}
            style={sliderStyle}
          />
        </label>
      </div>

      <button type="button" onClick={() => glassStore.resetToDefaults()} style={resetButtonStyle}>
        Reset Defaults
      </button>
    </div>
  );
}
