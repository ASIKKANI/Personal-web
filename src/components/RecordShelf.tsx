import { useRef, Suspense } from 'react';
import type { FC } from 'react';
import * as THREE from 'three';
import { useStore } from '../store/useStore';
import { MENUS } from '../constants';
import { Text, useGLTF, useTexture } from '@react-three/drei';
import gsap from 'gsap';

interface RecordItemProps {
  menu: typeof MENUS[0];
  index: number;
}

const RecordCover: FC<{ menu: typeof MENUS[0], materialFromGLTF: any }> = ({ menu, materialFromGLTF }) => {
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

const RecordItem: FC<RecordItemProps> = ({ menu, index }) => {
  const groupRef = useRef<THREE.Group>(null);
  const setActiveMenu = useStore((state) => state.setActiveMenu);
  const activeMenu = useStore((state) => state.activeMenu);
  const setIsPlaying = useStore((state) => state.setIsPlaying);
  const isPlaying = useStore((state) => state.isPlaying);

  const { materials } = useGLTF('/models/vinyls_1.glb') as any;
  const coverMaterialArray = [materials['cover.001'], materials['cover.003'], materials['cover.004'], materials['cover.002']];
  const materialFromGLTF = coverMaterialArray[index % coverMaterialArray.length];

  const isActive = activeMenu?.id === menu.id;
  
  // Premium fan-out layout
  const fanAngle = (index - 1.5) * 0.05; 
  const basePosition: [number, number, number] = [index * 1.4, 0.0, index * -0.15];
  const baseRotation: [number, number, number] = [0, Math.PI / 16 + fanAngle, -Math.PI / 18]; 

  const handlePointerOver = () => {
    document.body.style.cursor = 'pointer';
    if (!isActive && groupRef.current) {
      gsap.to(groupRef.current.position, {
        y: basePosition[1] + 1.2, // Higher pop
        z: basePosition[2] + 0.6, // More forward
        duration: 0.6,
        ease: 'elastic.out(1, 0.75)', // High-end springy feel
      });
      gsap.to(groupRef.current.rotation, {
        y: 0,
        z: 0,
        duration: 0.5,
        ease: 'power2.out'
      });
    }
  };

  const handlePointerOut = () => {
    document.body.style.cursor = 'default';
    if (!isActive && groupRef.current) {
      gsap.to(groupRef.current.position, {
        y: basePosition[1],
        z: basePosition[2],
        duration: 0.7,
        ease: 'power4.out',
      });
      gsap.to(groupRef.current.rotation, {
        y: baseRotation[1],
        z: baseRotation[2],
        duration: 0.7,
        ease: 'power4.out'
      });
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

  const labels = ['ABOUT ME', 'EXPERIENCES', 'PROJECTS', 'CONNECT'];

  return (
    <group ref={groupRef} position={basePosition} rotation={baseRotation} onClick={handleClick} onPointerOver={handlePointerOver} onPointerOut={handlePointerOut}>
      <mesh visible={false}><boxGeometry args={[0.8, 3.5, 0.5]} /></mesh>
      
      {/* Portfolio Category Label & Arrow - Moved left for alignment */}
      <group position={[-0.3, 3.2, 0]}>
        <Text
          fontSize={0.2}
          color="#ff4d00"
          font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf"
          anchorX="center"
          anchorY="bottom"
          letterSpacing={0.2}
          fontWeight="bold"
        >
          {labels[index] || 'SECTION'}
        </Text>
        <mesh position={[0, -0.2, 0]} rotation={[0, 0, -Math.PI]}>
          <coneGeometry args={[0.05, 0.15, 4]} />
          <meshBasicMaterial color="#ff4d00" />
        </mesh>
      </group>

      <group position={[0, 1.25, 0]}>
        <mesh position={[0, 0, -0.01]}><boxGeometry args={[2.58, 2.58, 0.04]} /><meshStandardMaterial color="#ffffff" metalness={0.8} /></mesh>
        <Suspense fallback={<mesh><boxGeometry args={[2.5, 2.5, 0.05]} /><meshStandardMaterial {...materialFromGLTF} /></mesh>}>
          <RecordCover menu={menu} materialFromGLTF={materialFromGLTF} />
        </Suspense>
      </group>
    </group>
  );
};

const RecordShelf: FC = () => {
  return (
    <group position={[0.5, 0, 0.5]}>
      {MENUS.map((menu, index) => <RecordItem key={menu.id} menu={menu} index={index} />)}
    </group>
  );
};

export default RecordShelf;

MENUS.forEach((menu) => {
  useTexture.preload(menu.image);
});