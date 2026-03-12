import type { ReactElement } from 'react';
import { useConnectRuntimeState } from '../runtime/store';
import type { ConnectPlayerState } from '../runtime/types';

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
      <mesh castShadow position={[0, 1.18, 0.55]}>
        <boxGeometry args={[0.14, 0.12, 0.45]} />
        <meshStandardMaterial color={markerColor} />
      </mesh>
    </group>
  );
}

export function GreyboxScene(): ReactElement {
  const { players } = useConnectRuntimeState();

  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight
        castShadow
        intensity={1}
        position={[7, 12, 6]}
        shadow-mapSize-height={1024}
        shadow-mapSize-width={1024}
      />

      <gridHelper args={[36, 36, '#8bb3cc', '#bcd4e4']} position={[0, 0.01, 0]} />

      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#ebf5fc" />
      </mesh>

      <mesh castShadow position={[0, 1.3, -6]}>
        <boxGeometry args={[12, 2.6, 0.8]} />
        <meshStandardMaterial color="#a0c8df" />
      </mesh>
      <mesh castShadow position={[-6, 1.3, 0]}>
        <boxGeometry args={[0.8, 2.6, 12]} />
        <meshStandardMaterial color="#a0c8df" />
      </mesh>
      <mesh castShadow position={[6, 1.3, 0]}>
        <boxGeometry args={[0.8, 2.6, 12]} />
        <meshStandardMaterial color="#a0c8df" />
      </mesh>

      <mesh castShadow position={[0, 1.2, 3.5]}>
        <boxGeometry args={[4.2, 2.4, 0.5]} />
        <meshStandardMaterial color="#dc7b57" />
      </mesh>
      <mesh castShadow position={[-1.9, 1.2, 3.5]}>
        <boxGeometry args={[0.5, 2.4, 1.2]} />
        <meshStandardMaterial color="#dc7b57" />
      </mesh>
      <mesh castShadow position={[1.9, 1.2, 3.5]}>
        <boxGeometry args={[0.5, 2.4, 1.2]} />
        <meshStandardMaterial color="#dc7b57" />
      </mesh>

      <PlayerPlaceholder color="#10a37f" player={players.local} />
      <PlayerPlaceholder color="#3b82f6" player={players.remote} />
    </>
  );
}
