'use client';

import { useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

export function CameraController() {
  const controlsRef = useRef<any>(null);
  const { camera } = useThree();

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
      minDistance={50}
      maxDistance={1000}
      maxPolarAngle={Math.PI / 1.5}
      dampingFactor={0.05}
      enableDamping={true}
    />
  );
}
