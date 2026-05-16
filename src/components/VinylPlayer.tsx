import { useRef, useEffect, Suspense, FC } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../store/useStore';
import { useGLTF, useTexture } from '@react-three/drei';
import gsap from 'gsap';

const Tonearm: FC<{ isPlaying: boolean }> = ({ isPlaying }) => {
  const armRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (armRef.current) {
      if (isPlaying) {
        gsap.to(armRef.current.rotation, { y: -Math.PI / 6, duration: 1.5, ease: 'power2.inOut' });
        gsap.to(armRef.current.rotation, { x: 0.05, duration: 0.8, delay: 1.2, ease: 'bounce.out' });
      } else {
        gsap.to(armRef.current.rotation, { x: 0, duration: 0.5, ease: 'power2.in' });
        gsap.to(armRef.current.rotation, { y: 0, duration: 1.0, delay: 0.2, ease: 'power2.inOut' });
      }
    }
  }, [isPlaying]);

  return (
    <group position={[1.0, 0.9, -0.8]} ref={armRef}>
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.4, 16]} />
        <meshStandardMaterial color="#222" metalness={0.8} roughness={0.2} />
      </mesh>
      <group position={[0, 0.1, 0]}>
        <mesh position={[0, 0, 1.0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 2.0, 8]} />
          <meshStandardMaterial color="#888" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0, -0.05, 2.0]}>
          <boxGeometry args={[0.1, 0.05, 0.15]} />
          <meshStandardMaterial color="#111" />
        </mesh>
      </group>
    </group>
  );
};

const RecordLabel: FC<{ color: string, url?: string }> = ({ color, url }) => {
  // Use a fallback to prevent error if image is missing
  const texture = url ? useTexture(url) : null;
  
  return (
    <mesh position={[0, 0.021, 0]}>
      <cylinderGeometry args={[0.35, 0.35, 0.01, 32]} />
      <meshStandardMaterial 
        color={texture ? '#ffffff' : color} 
        map={texture}
        roughness={0.6} 
      />
    </mesh>
  );
};

interface VinylPlayerProps {
  position?: [number, number, number];
}

const VinylPlayer: FC<VinylPlayerProps> = ({ position = [0, 0, 0] }) => {
  const platterRef = useRef<THREE.Group>(null);
  const activeMenu = useStore((state) => state.activeMenu);
  const isPlaying = useStore((state) => state.isPlaying);
  const activeColor = activeMenu ? activeMenu.color : '#111';

  const { scene } = useGLTF('/models/voxel_turntable.glb');

  // Ensure original model details pop with shadows
  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        // Improve material appearance if needed
        if (child.material) {
          child.material.metalness = 0.5;
          child.material.roughness = 0.4;
        }
      }
    });
  }, [scene]);

  useFrame(() => {
    if (isPlaying && platterRef.current) {
      platterRef.current.rotation.y -= 0.05;
    }
  });

  return (
    <group position={position}>
      <group position={[0, -0.1, 0]} scale={[0.07, 0.07, 0.07]}>
        <primitive object={scene} />
      </group>

      <Tonearm isPlaying={isPlaying} />

      {/* Floating active record - Sitting perfectly on the model's platter */}
      <group position={[0, 0.81, 0]} ref={platterRef}>
        {activeMenu && (
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[1.05, 1.05, 0.04, 32]} />
            <meshStandardMaterial color="#050505" roughness={0.1} metalness={0.5} />
            <Suspense fallback={<mesh><cylinderGeometry args={[0.35, 0.35, 0.01, 32]} /><meshStandardMaterial color={activeColor} /></mesh>}>
              <RecordLabel color={activeColor} url={activeMenu.image} />
            </Suspense>
            <mesh position={[0, 0.021, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.4, 1.0, 64]} />
              <meshStandardMaterial color="#000000" transparent opacity={0.6} />
            </mesh>
          </mesh>
        )}
      </group>
    </group>
  );
};

useGLTF.preload('/models/voxel_turntable.glb');

export default VinylPlayer;
