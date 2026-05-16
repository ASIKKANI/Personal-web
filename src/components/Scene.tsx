import React, { useRef } from 'react';
import VinylPlayer from './VinylPlayer';
import RecordShelf from './RecordShelf';
import { Text } from '@react-three/drei';
import { useStore } from '../store/useStore';
import gsap from 'gsap';
import * as THREE from 'three';

const Scene: React.FC = () => {
  const setViewMode = useStore((state) => state.setViewMode);
  const viewMode = useStore((state) => state.viewMode);
  const hasStarted = useStore((state) => state.hasStarted);
  const stackRef = useRef<THREE.Group>(null);

  const handleTextHover = (hovering: boolean) => {
    document.body.style.cursor = hovering ? 'pointer' : 'default';
    if (stackRef.current) {
      gsap.to(stackRef.current.position, {
        y: hovering ? 0.2 : 0.0,
        duration: 0.4,
        ease: 'power2.out'
      });
    }
  };

  if (!hasStarted) return null;

  return (
    <group position={[0, 0, 0]}>
      <group position={[0, 0, 0]}>
        <VinylPlayer />
        
        {/* Navigation Button - Correct Position and Size */}
        <group 
          position={[2.0, 0.2, 0.5]} 
          onClick={(e) => {
            e.stopPropagation();
            setViewMode(viewMode === 'shelf' ? 'player' : 'shelf');
          }}
          onPointerOver={() => handleTextHover(true)}
          onPointerOut={() => handleTextHover(false)}
        >
          <mesh visible={false}>
            <boxGeometry args={[1.5, 1.0, 1.0]} />
          </mesh>

          <group ref={stackRef}>
            <Text 
              position={[0, 0, 0]} 
              fontSize={0.15} 
              color="#ffffff" 
              anchorX="center" 
              anchorY="middle"
              font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf"
            >
              {viewMode === 'shelf' ? '← PLAYER' : 'RECORDS →'}
            </Text>
          </group>
        </group>
      </group>
      
      <group position={[4.0, 0, 0.5]} visible={viewMode === 'shelf'}>
        <RecordShelf />
      </group>
    </group>
  );
};

export default Scene;