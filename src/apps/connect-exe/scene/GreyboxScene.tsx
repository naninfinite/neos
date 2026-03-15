import { useEffect } from 'react';
import type { ReactElement } from 'react';
import { useConnectRuntimeState, connectRuntimeStore } from '../runtime/store';
import type { ConnectPlayerState } from '../runtime/types';
import { SUN_MAZE_LANDMARKS } from '../runtime/landmarks';

/* ── Colours ── */
const WALL_COLOR = '#a0c8df';
const GROUND_COLOR = '#dce8f0';
const ARCH_COLOR = '#c45533';
const HEDGE_COLOR = '#5a8a5e';
const STONE_COLOR = '#8a9baa';
const FOUNTAIN_COLOR = '#7a8d9e';

/* ── Player placeholder (third-person remote view) ── */
interface PlayerPlaceholderProps {
  player: ConnectPlayerState;
  color: string;
}

function PlayerPlaceholder({ player, color }: PlayerPlaceholderProps): ReactElement {
  const markerColor = player.isMapOpen ? '#7d8ea3' : color;
  return (
    <group position={player.transform.position}>
      <mesh castShadow position={[0, 0.9, 0]}>
        <capsuleGeometry args={[0.28, 0.8, 8, 16]} />
        <meshStandardMaterial color={markerColor} />
      </mesh>
      <mesh castShadow position={[0, 1.8, 0]}>
        <sphereGeometry args={[0.24, 16, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

/* ── Wall helper ── */
interface WallProps {
  position: [number, number, number];
  size: [number, number, number];
  color?: string;
}

function Wall({ position, size, color = WALL_COLOR }: WallProps): ReactElement {
  return (
    <mesh castShadow receiveShadow position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

/* ── Landmark marker (visible in-scene label post) ── */
interface LandmarkMarkerProps {
  position: [number, number, number];
  label: string;
}

function LandmarkMarker({ position }: LandmarkMarkerProps): ReactElement {
  return (
    <group position={position}>
      {/* Marker post */}
      <mesh castShadow position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 2.4, 8]} />
        <meshStandardMaterial color="#e8c840" />
      </mesh>
      {/* Marker top */}
      <mesh castShadow position={[0, 2.5, 0]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial color="#e8c840" emissive="#e8c840" emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}

/* ── Entry Garden ── */
function EntryGarden(): ReactElement {
  return (
    <group>
      {/* Garden floor */}
      <mesh receiveShadow position={[0, -0.01, 4]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 16]} />
        <meshStandardMaterial color="#c8d8c0" />
      </mesh>

      {/* Entry gate posts */}
      <Wall position={[-2.5, 1.5, 10]} size={[0.6, 3, 0.6]} color={STONE_COLOR} />
      <Wall position={[2.5, 1.5, 10]} size={[0.6, 3, 0.6]} color={STONE_COLOR} />
      {/* Gate lintel */}
      <Wall position={[0, 3.2, 10]} size={[5.6, 0.4, 0.6]} color={STONE_COLOR} />

      {/* Central fountain base (entry) */}
      <mesh castShadow receiveShadow position={[0, 0.3, 4]}>
        <cylinderGeometry args={[1.5, 1.8, 0.6, 16]} />
        <meshStandardMaterial color={FOUNTAIN_COLOR} />
      </mesh>
      <mesh castShadow position={[0, 0.8, 4]}>
        <cylinderGeometry args={[0.2, 0.3, 1.0, 8]} />
        <meshStandardMaterial color={FOUNTAIN_COLOR} />
      </mesh>

      {/* Garden hedges — side boundaries */}
      <Wall position={[-9, 1, 4]} size={[0.8, 2, 16]} color={HEDGE_COLOR} />
      <Wall position={[9, 1, 4]} size={[0.8, 2, 16]} color={HEDGE_COLOR} />
      {/* Back hedge with opening */}
      <Wall position={[-6, 1, -3.5]} size={[6, 2, 0.8]} color={HEDGE_COLOR} />
      <Wall position={[6, 1, -3.5]} size={[6, 2, 0.8]} color={HEDGE_COLOR} />

      <LandmarkMarker position={[0, 0, 8]} label="Entry Gate" />
      <LandmarkMarker position={[0, 0, 4]} label="Entry Fountain" />
    </group>
  );
}

/* ── Red Arch District ── */
function RedArchDistrict(): ReactElement {
  return (
    <group>
      {/* District floor */}
      <mesh receiveShadow position={[0, -0.01, -12]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[24, 16]} />
        <meshStandardMaterial color={GROUND_COLOR} />
      </mesh>

      {/* The Red Arch — signature landmark */}
      {/* Left pillar */}
      <Wall position={[-2.5, 2, -12]} size={[0.8, 4, 0.8]} color={ARCH_COLOR} />
      {/* Right pillar */}
      <Wall position={[2.5, 2, -12]} size={[0.8, 4, 0.8]} color={ARCH_COLOR} />
      {/* Arch span */}
      <Wall position={[0, 4.2, -12]} size={[5.8, 0.6, 0.8]} color={ARCH_COLOR} />
      {/* Arch keystone detail */}
      <mesh castShadow position={[0, 4.6, -12]}>
        <boxGeometry args={[1.0, 0.4, 0.9]} />
        <meshStandardMaterial color="#a03020" />
      </mesh>

      {/* Side walls channelling toward arch */}
      <Wall position={[-8, 1.5, -8]} size={[0.6, 3, 8]} color={WALL_COLOR} />
      <Wall position={[8, 1.5, -8]} size={[0.6, 3, 8]} color={WALL_COLOR} />

      {/* West and east corridor walls beyond arch */}
      <Wall position={[-8, 1.5, -16]} size={[0.6, 3, 8]} color={WALL_COLOR} />
      <Wall position={[8, 1.5, -16]} size={[0.6, 3, 8]} color={WALL_COLOR} />

      {/* Interior maze walls (simple first pass) */}
      <Wall position={[-4, 1.2, -9]} size={[4, 2.4, 0.5]} color={WALL_COLOR} />
      <Wall position={[5, 1.2, -15]} size={[5, 2.4, 0.5]} color={WALL_COLOR} />
      <Wall position={[-3, 1.2, -17]} size={[0.5, 2.4, 4]} color={WALL_COLOR} />

      <LandmarkMarker position={[0, 0, -12]} label="Red Arch" />
      <LandmarkMarker position={[-8, 0, -12]} label="West Pillar" />
      <LandmarkMarker position={[8, 0, -12]} label="East Pillar" />
    </group>
  );
}

/* ── Dry Fountain / Survey Approach ── */
function DryFountainApproach(): ReactElement {
  return (
    <group>
      {/* Approach floor */}
      <mesh receiveShadow position={[0, -0.01, -26]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 12]} />
        <meshStandardMaterial color="#d0d8dd" />
      </mesh>

      {/* Dry fountain — larger, inactive */}
      <mesh castShadow receiveShadow position={[0, 0.4, -28]}>
        <cylinderGeometry args={[2.2, 2.6, 0.8, 16]} />
        <meshStandardMaterial color="#6a7d8e" />
      </mesh>
      <mesh castShadow position={[0, 1.0, -28]}>
        <cylinderGeometry args={[0.3, 0.5, 1.2, 8]} />
        <meshStandardMaterial color="#5a6d7e" />
      </mesh>

      {/* Surrounding low walls */}
      <Wall position={[-9, 0.8, -26]} size={[0.6, 1.6, 12]} color={STONE_COLOR} />
      <Wall position={[9, 0.8, -26]} size={[0.6, 1.6, 12]} color={STONE_COLOR} />
      <Wall position={[0, 0.8, -32]} size={[18, 1.6, 0.6]} color={STONE_COLOR} />

      <LandmarkMarker position={[0, 0, -28]} label="Dry Fountain" />
    </group>
  );
}

/* ── Connecting corridors ── */
function Corridors(): ReactElement {
  return (
    <group>
      {/* Entry Garden → Red Arch corridor floor */}
      <mesh receiveShadow position={[0, -0.01, -5.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[6, 5]} />
        <meshStandardMaterial color={GROUND_COLOR} />
      </mesh>
      {/* Corridor walls */}
      <Wall position={[-3, 1.2, -5.5]} size={[0.4, 2.4, 5]} color={WALL_COLOR} />
      <Wall position={[3, 1.2, -5.5]} size={[0.4, 2.4, 5]} color={WALL_COLOR} />

      {/* Red Arch → Dry Fountain corridor floor */}
      <mesh receiveShadow position={[0, -0.01, -21]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[6, 4]} />
        <meshStandardMaterial color={GROUND_COLOR} />
      </mesh>
      <Wall position={[-3, 1.2, -21]} size={[0.4, 2.4, 4]} color={WALL_COLOR} />
      <Wall position={[3, 1.2, -21]} size={[0.4, 2.4, 4]} color={WALL_COLOR} />
    </group>
  );
}

/* ── Main scene ── */
export function GreyboxScene(): ReactElement {
  const { players } = useConnectRuntimeState();

  // Register landmarks on mount
  useEffect(() => {
    connectRuntimeStore.setLandmarks(SUN_MAZE_LANDMARKS);
  }, []);

  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight
        castShadow
        intensity={1.0}
        position={[10, 18, 8]}
        shadow-mapSize-height={2048}
        shadow-mapSize-width={2048}
        shadow-camera-left={-40}
        shadow-camera-right={40}
        shadow-camera-top={40}
        shadow-camera-bottom={-40}
      />
      <hemisphereLight args={['#c8dce8', '#a0b8a0', 0.3]} />

      {/* Ground plane */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, -10]}>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color={GROUND_COLOR} />
      </mesh>

      <EntryGarden />
      <Corridors />
      <RedArchDistrict />
      <DryFountainApproach />

      {/* Remote player placeholder only (local player is first-person camera) */}
      <PlayerPlaceholder color="#3b82f6" player={players.remote} />
    </>
  );
}
