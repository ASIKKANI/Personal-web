import React, { useRef, Suspense } from 'react';
import * as THREE from 'three';
import { useStore } from '../store/useStore';
import { MENUS } from '../constants';
import { Text, useGLTF, useTexture } from '@react-three/drei';
import gsap from 'gsap';

interface RecordItemProps {
  menu: typeof MENUS[0];
  index: number;
}

const RecordCover: React.FC<{ menu: typeof MENUS[0], materialFromGLTF: any }> = ({ menu, materialFromGLTF }) => {
  const texture = menu.image ? useTexture(menu.image) : null;
  return (
    <mesh castShadow receiveShadow>
      <boxGeometry args={[2.5, 2.5, 0.05]} />
      <meshStandardMaterial 
        {...materialFromGLTF} 
        map={texture || materialFromGLTF.map}
        color={texture ? '#ffffff' : materialFromGLTF.color}
      />
    </mesh>
  );
};

const RecordItem: React.FC<RecordItemProps> = ({ menu, index }) => {
  const groupRef = useRef<THREE.Group>(null);
  const setActiveMenu = useStore((state) => state.setActiveMenu);
  const activeMenu = useStore((state) => state.activeMenu);
  const setIsPlaying = useStore((state) => state.setIsPlaying);
  const isPlaying = useStore((state) => state.isPlaying);

  const { materials } = useGLTF('/models/vinyls_1.glb') as any;
  const coverMaterialArray = [materials['cover.001'], materials['cover.003'], materials['cover.004'], materials['cover.002']];
  const materialFromGLTF = coverMaterialArray[index % coverMaterialArray.length];

  const isActive = activeMenu?.id === menu.id;
  const basePosition: [number, number, number] = [index * 0.9, 0.0, index * -0.1];
  const baseRotation: [number, number, number] = [0, Math.PI / 32, -Math.PI / 24]; 

  const handlePointerOver = () => {
    document.body.style.cursor = 'pointer';
    if (!isActive && groupRef.current) {
      gsap.to(groupRef.current.position, { y: 0.8, z: 0.5, duration: 0.4, ease: 'back.out(1.7)' });
    }
  };

  const handlePointerOut = () => {
    document.body.style.cursor = 'default';
    if (!isActive && groupRef.current) {
      gsap.to(groupRef.current.position, { y: 0, z: basePosition[2], duration: 0.4 });
    }
  };

  const handleClick = (e: any) => {
    e.stopPropagation();
    if (isActive) {
      setIsPlaying(!isPlaying);
    } else {
      setIsPlaying(false);
      if (groupRef.current) gsap.to(groupRef.current.position, { y: 0, duration: 0.2 });
      setTimeout(() => {
        setActiveMenu(menu);
        setIsPlaying(true);
        useStore.getState().setViewMode('player');
      }, 350);
    }
  };

  return (
    <group ref={groupRef} position={basePosition} rotation={baseRotation} onClick={handleClick} onPointerOver={handlePointerOver} onPointerOut={handlePointerOut}>
      <mesh visible={false}><boxGeometry args={[0.8, 3.5, 0.5]} /></mesh>
      <group position={[0, 1.25, 0]}>
        <mesh position={[0, 0, -0.01]}><boxGeometry args={[2.58, 2.58, 0.04]} /><meshStandardMaterial color="#ffffff" metalness={0.8} /></mesh>
        <Suspense fallback={<mesh><boxGeometry args={[2.5, 2.5, 0.05]} /><meshStandardMaterial {...materialFromGLTF} /></mesh>}>
          <RecordCover menu={menu} materialFromGLTF={materialFromGLTF} />
        </Suspense>
        <mesh position={[0, 1.1, 0.03]}>
          <planeGeometry args={[2.0, 0.5]} /><meshStandardMaterial color="#000000" transparent opacity={0.6} />
          <Text position={[0, 0, 0.01]} fontSize={0.2} color="#ffffff" anchorX="center" anchorY="middle" font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf">
            {menu.title.toUpperCase()}
          </Text>
        </mesh>
      </group>
    </group>
  );
};

const RecordShelf: React.FC = () => {
  return (
    <group position={[0.5, 0, 0.5]}>
      {MENUS.map((menu, index) => <RecordItem key={menu.id} menu={menu} index={index} />)}
    </group>
  );
};

export default RecordShelf;