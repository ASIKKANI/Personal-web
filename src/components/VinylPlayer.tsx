import React, { useRef, useEffect, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../store/useStore';
import { useGLTF, useTexture } from '@react-three/drei';
import gsap from 'gsap';

const Tonearm: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => {
  const armRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (armRef.current) {
      if (isPlaying) {
        // Move arm to the record
        gsap.to(armRef.current.rotation, {
          y: -Math.PI / 6,
          duration: 1.5,
          ease: 'power2.inOut'
        });
        // Drop needle slightly
        gsap.to(armRef.current.rotation, {
          x: 0.05,
          duration: 0.8,
          delay: 1.2,
          ease: 'bounce.out'
        });
      } else {
        // Raise needle
        gsap.to(armRef.current.rotation, {
          x: 0,
          duration: 0.5,
          ease: 'power2.in'
        });
        // Move arm back to rest
        gsap.to(armRef.current.rotation, {
          y: 0,
          duration: 1.0,
          delay: 0.2,
          ease: 'power2.inOut'
        });
      }
    }
  }, [isPlaying]);

  return (
    <group position={[1.0, 0.9, -0.8]} ref={armRef}>
      {/* Arm Base */}
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.4, 16]} />
        <meshStandardMaterial color="#222" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* The Arm itself */}
      <group position={[0, 0.1, 0]}>
        <mesh position={[0, 0, 1.0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 2.0, 8]} />
          <meshStandardMaterial color="#888" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Headshell / Needle area */}
        <mesh position={[0, -0.05, 2.0]}>
          <boxGeometry args={[0.1, 0.05, 0.15]} />
          <meshStandardMaterial color="#111" />
        </mesh>
      </group>
    </group>
  );
};

const RecordLabel: React.FC<{ color: string, url?: string }> = ({ color, url }) => {
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

const VinylPlayer: React.FC<VinylPlayerProps> = ({ position = [0, 0, 0] }) => {
  const platterRef = useRef<THREE.Group>(null);
  const activeMenu = useStore((state) => state.activeMenu);
  const isPlaying = useStore((state) => state.isPlaying);
  const activeColor = activeMenu ? activeMenu.color : '#111';

  // Load the downloaded 3D Model securely
  const { scene } = useGLTF('/models/voxel_turntable.glb');

  useFrame((state) => {
    if (isPlaying && platterRef.current) {
      platterRef.current.rotation.y -= 0.05;
    }
  });

  return (
    <group position={position}>
      {/* Complete Vinyl Player Model */}
      <group position={[0, -0.1, 0]} scale={[0.07, 0.07, 0.07]}>
        <primitive object={scene} />
      </group>

      {/* Tonearm Animation - Raised to sit on top */}
      <Tonearm isPlaying={isPlaying} />

      {/* Floating active record - Raised to sit perfectly on top of the platter (approx y=0.85) */}
      <group position={[0, 0.85, 0]} ref={platterRef}>
        {activeMenu && (
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[1.05, 1.05, 0.04, 32]} />
            <meshStandardMaterial color="#050505" roughness={0.1} metalness={0.5} />
            
            {/* Record Label with optional texture */}
            <Suspense fallback={
              <mesh position={[0, 0.021, 0]}>
                <cylinderGeometry args={[0.35, 0.35, 0.01, 32]} />
                <meshStandardMaterial color={activeColor} roughness={0.8} />
              </mesh>
            }>
              <RecordLabel color={activeColor} url={activeMenu.image} />
            </Suspense>

            {/* Subtle Grooves effect */}
            <mesh position={[0, 0.021, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.4, 1.0, 64]} />
              <meshStandardMaterial color="#000000" transparent opacity={0.4} wireframe />
            </mesh>
          </mesh>
        )}
      </group>
    </group>
  );
};

useGLTF.preload('/models/voxel_turntable.glb');

export default VinylPlayer;
