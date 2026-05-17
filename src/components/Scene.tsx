import type { FC } from 'react';
import VinylPlayer from './VinylPlayer';
import RecordShelf from './RecordShelf';
import { Text } from '@react-three/drei';
import { useStore } from '../store/useStore';

// Final cinematic scene stabilization
const Scene: FC = () => {
  const viewMode = useStore((state) => state.viewMode);

  return (
    <group position={[0, 0, 0]}>
      {/* Interactive Title - Peak Design Aesthetic with Dual Tones */}
      <group 
        position={[-1.2, 4.2, -2]}
        onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { document.body.style.cursor = 'default'; }}
      >
        <Text
          position={[0, 0, 0]}
          fontSize={0.5}
          color="#ffffff"
          font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf"
          anchorX="right"
          anchorY="middle"
          letterSpacing={0.2}
        >
          PORT
        </Text>
        <Text
          position={[0, 0, 0]}
          fontSize={0.5}
          color="#ff4d00"
          font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf"
          anchorX="left"
          anchorY="middle"
          letterSpacing={0.2}
        >
          FOLIO
        </Text>
      </group>

      <group position={[0, 0, 0]}>
        <VinylPlayer />
      </group>
      
      {/* Right side: Shelf Context - Moved closer to the player (x=2.8) */}
      <group position={[2.8, 0, 0.5]} visible={viewMode === 'shelf'}>
        <RecordShelf />
      </group>
    </group>
  );
};

export default Scene;