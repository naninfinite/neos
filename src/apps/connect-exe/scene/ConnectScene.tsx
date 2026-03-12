import { Canvas } from '@react-three/fiber';
import type { ReactElement } from 'react';
import { GreyboxScene } from './GreyboxScene';

export function ConnectScene(): ReactElement {
  return (
    <Canvas camera={{ fov: 52, position: [8, 7, 8] }} className="connectCanvas" shadows>
      <color attach="background" args={['#d8ecf9']} />
      <fog attach="fog" args={['#d8ecf9', 10, 42]} />
      <GreyboxScene />
    </Canvas>
  );
}
