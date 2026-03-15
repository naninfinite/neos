import { Canvas } from '@react-three/fiber';
import type { ReactElement } from 'react';
import { GreyboxScene } from './GreyboxScene';
import { PlayerController } from './PlayerController';

export function ConnectScene(): ReactElement {
  return (
    <Canvas
      camera={{ fov: 70, near: 0.1, far: 200, position: [-2, 1.7, 1] }}
      className="connectCanvas"
      shadows
    >
      <color attach="background" args={['#b8d4e8']} />
      <fog attach="fog" args={['#b8d4e8', 20, 80]} />
      <PlayerController />
      <GreyboxScene />
    </Canvas>
  );
}
