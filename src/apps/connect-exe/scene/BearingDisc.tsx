import type { ReactElement } from 'react';
import { useConnectRuntimeState } from '../runtime/store';

const DISC_SIZE = 72;

/**
 * Bearing Disc — minimal always-on heading aid.
 * Shows cardinal directions and player facing direction.
 * Per OPEN_QUESTIONS #5A: heading aid only, no maze layout or puzzle state.
 */
export function BearingDisc(): ReactElement {
  const { players } = useConnectRuntimeState();
  const heading = players.local.transform.headingRadians;
  // Convert heading to degrees for CSS rotation. Heading is yaw where 0 = north (+Z).
  const rotationDeg = (heading * 180) / Math.PI;

  return (
    <div className="bearingDisc" aria-label="Bearing Disc">
      <svg
        width={DISC_SIZE}
        height={DISC_SIZE}
        viewBox="0 0 72 72"
        style={{ transform: `rotate(${rotationDeg}deg)` }}
      >
        {/* Outer ring */}
        <circle cx="36" cy="36" r="34" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        <circle cx="36" cy="36" r="30" fill="rgba(0,0,0,0.25)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />

        {/* Cardinal labels */}
        <text x="36" y="14" textAnchor="middle" fill="#ef4444" fontSize="10" fontWeight="bold">N</text>
        <text x="36" y="64" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="9">S</text>
        <text x="10" y="39" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="9">W</text>
        <text x="62" y="39" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="9">E</text>

        {/* Tick marks */}
        <line x1="36" y1="6" x2="36" y2="10" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
        <line x1="36" y1="62" x2="36" y2="66" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
        <line x1="6" y1="36" x2="10" y2="36" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
        <line x1="62" y1="36" x2="66" y2="36" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
      </svg>
      {/* Player facing indicator (fixed, doesn't rotate with disc) */}
      <div className="bearingDiscPointer" />
    </div>
  );
}
