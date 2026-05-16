import React from 'react';
import { useGLTF } from '@react-three/drei';

export const DrakengardFlower: React.FC = () => {
  const { scene } = useGLTF('/models/drakengard_3_the_flower_zero_eye.glb');
  return (
    <group position={[-2.5, 0.05, 1.5]}>
      <primitive object={scene} scale={0.2} rotation={[0, -Math.PI / 6, 0]} />
    </group>
  );
};

useGLTF.preload('/models/drakengard_3_the_flower_zero_eye.glb');

