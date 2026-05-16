import React, { useRef, Suspense, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sparkles, Environment } from '@react-three/drei';
import * as THREE from 'three';
import Scene from './components/Scene';
import Display from './components/Display';
import { useStore } from './store/useStore';
import LandingPage from './components/LandingPage';

function CameraRig({ controlsRef }: { controlsRef: any }) {
  const viewMode = useStore((state) => state.viewMode);
  const isPlaying = useStore((state) => state.isPlaying);
  const activeMenu = useStore((state) => state.activeMenu);
  const hasStarted = useStore((state) => state.hasStarted);

  useFrame((state) => {
    if (!controlsRef.current) return;
    
    // Starting position for cinematic effect
    let targetPos = new THREE.Vector3(-10, 5, 8);
    let targetLook = new THREE.Vector3(0, 0, 0);

    if (hasStarted) {
      if (viewMode === 'shelf') {
        targetPos = new THREE.Vector3(5.5, 2.5, 7.5);
        targetLook = new THREE.Vector3(5.5, 1.2, 0);
      } else {
        if (isPlaying && activeMenu) {
          if (activeMenu.id === 'kid-a') targetPos = new THREE.Vector3(1.2, 2.2, 1.2);
          else if (activeMenu.id === 'grace') targetPos = new THREE.Vector3(-1.2, 2.2, 0.8);
          else if (activeMenu.id === 'the-glow-pt2') targetPos = new THREE.Vector3(0, 3.0, 0.4);
          else targetPos = new THREE.Vector3(0.8, 1.8, 2.0);
          targetLook = new THREE.Vector3(0, 0.2, 0);
        } else {
          targetPos = new THREE.Vector3(0, 2.8, 2.2);
          targetLook = new THREE.Vector3(0, 0, 0);
        }
      }
    }

    const lerpSpeed = hasStarted ? 0.04 : 0.01; 
    state.camera.position.lerp(targetPos, lerpSpeed); 
    controlsRef.current.target.lerp(targetLook, lerpSpeed);
    controlsRef.current.update();
  });
  
  return null;
}

function AudioManager() {
  const activeMenu = useStore((state) => state.activeMenu);
  const isPlaying = useStore((state) => state.isPlaying);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.loop = true;
    }
  }, []);

  useEffect(() => {
    if (audioRef.current && activeMenu) {
      audioRef.current.src = activeMenu.audioSrc;
      if (isPlaying) audioRef.current.play().catch(() => {});
      else audioRef.current.pause();
    }
  }, [activeMenu, isPlaying]);

  return null;
}

function App() {
  const isPlaying = useStore((state) => state.isPlaying);
  const hasStarted = useStore((state) => state.hasStarted);
  const controlsRef = useRef(null);

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#050505', position: 'relative', overflow: 'hidden' }}>
      <AudioManager />
      
      {/* Landing Page Overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 100,
        opacity: hasStarted ? 0 : 1,
        pointerEvents: hasStarted ? 'none' : 'auto',
        transition: 'opacity 1.5s ease-in-out'
      }}>
        <LandingPage />
      </div>
      
      <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 1 }}>
        <Canvas shadows camera={{ position: [-10, 5, 8], fov: 45 }}>
          <color attach="background" args={['#050505']} />
          <fog attach="fog" args={['#050505', 10, 30]} />
          
          <ambientLight intensity={0.4} />
          <spotLight position={[5, 10, 6]} angle={0.7} penumbra={1} intensity={8} castShadow />
          <pointLight position={[-4, 3, -4]} intensity={1} />
          
          <Sparkles count={500} scale={15} size={2.5} speed={0.3} opacity={0.4} color="#ffffff" />
          <Sparkles count={200} scale={10} size={1.5} speed={0.6} opacity={0.6} color="#cccccc" />
          
          <Suspense fallback={null}>
            <Scene />
            <Environment preset="city" environmentIntensity={1.5} />
          </Suspense>

          <CameraRig controlsRef={controlsRef} />
          <OrbitControls 
            ref={controlsRef}
            makeDefault 
            minPolarAngle={Math.PI / 4} 
            maxPolarAngle={Math.PI / 2.1}
            enableZoom={false}
            enablePan={false}
            enabled={hasStarted && !isPlaying} 
          />
        </Canvas>
      </div>

      <Display />
    </div>
  );
}

export default App;