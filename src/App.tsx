import { useRef, Suspense, useEffect, useState } from 'react';
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
    
    // Initial Wide Shot
    let targetPos = new THREE.Vector3(-14, 7, 12);
    let targetLook = new THREE.Vector3(0, 0, 0);

    if (hasStarted) {
      if (viewMode === 'shelf') {
        // Broad view of the collection - adjusted for new closer position
        targetPos = new THREE.Vector3(4.0, 3.0, 7.5);
        targetLook = new THREE.Vector3(4.0, 1.5, 0);
      } else {
        if (activeMenu) {
          if (isPlaying) {
            // Dynamic Cinematic Angles per Portfolio Track - highly dramatic, player nicely on the left
            if (activeMenu.id === 'about-me') {
              targetPos = new THREE.Vector3(0, 2.8, 4.0);
              targetLook = new THREE.Vector3(1.5, 0.4, 0);
            } else if (activeMenu.id === 'experiences') {
              targetPos = new THREE.Vector3(0, 4.0, 2.5);
              targetLook = new THREE.Vector3(1.5, 0, 0);
            } else if (activeMenu.id === 'projects') {
              targetPos = new THREE.Vector3(0, 2.0, 4.5);
              targetLook = new THREE.Vector3(1.5, 0.5, 0);
            } else if (activeMenu.id === 'connect') {
              targetPos = new THREE.Vector3(-1.0, 3.0, 4.0);
              targetLook = new THREE.Vector3(1.5, 0.2, -0.5);
            } else {
              targetPos = new THREE.Vector3(0, 2.8, 4.0);
              targetLook = new THREE.Vector3(1.5, 0.4, 0);
            }
          } else {
            // Album selected but paused - Left framed but perfectly balanced
            targetPos = new THREE.Vector3(0, 3.5, 4.5);
            targetLook = new THREE.Vector3(1.5, 0.5, 0);
          }
        } else {
          // Home Page (No album selected) - Perfectly Center the player
          targetPos = new THREE.Vector3(0, 3.2, 3.0);
          targetLook = new THREE.Vector3(0, 0, 0);
        }
      }
    }

    // High-end dual-stage lerp for silky smoothness
    const speed = hasStarted ? 0.03 : 0.008;
    state.camera.position.lerp(targetPos, speed); 
    controlsRef.current.target.lerp(targetLook, speed);
    controlsRef.current.update();
  });
  
  return null;
}

function AudioManager() {
  const activeMenu = useStore((state) => state.activeMenu);
  const isPlaying = useStore((state) => state.isPlaying);
  const setIsPlaying = useStore((state) => state.setIsPlaying);
  const hasStarted = useStore((state) => state.hasStarted);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  
  const [isMuted, setIsMuted] = useState(false);
  const isMutedRef = useRef(isMuted);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.loop = false; // Once a track stops playing, nothing should play
      
      audioRef.current.addEventListener('ended', () => {
        setIsPlaying(false);
      });
    }
  }, [setIsPlaying]);

  useEffect(() => {
    isMutedRef.current = isMuted;
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  useEffect(() => {
    if (!audioRef.current) return;

    if (activeMenu && isPlaying) {
      // Avoid restarting if it's already playing the correct track
      if (audioRef.current.src.endsWith(encodeURI(activeMenu.audioSrc)) && !audioRef.current.paused) {
        return;
      }
      
      audioRef.current.src = activeMenu.audioSrc;
      
      // Simulate needle drop crackle
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          audioCtxRef.current = new AudioContextClass();
        }
      }
      
      const ctx = audioCtxRef.current;
      if (ctx && !isMutedRef.current) {
        if (ctx.state === 'suspended') ctx.resume();
        
        // Needle Drop Crackle
        const bufferSize = ctx.sampleRate * 0.5; // 0.5 seconds of crackle
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() > 0.95 ? (Math.random() * 2 - 1) * 0.5 : 0;
        }
        
        const noiseSource = ctx.createBufferSource();
        noiseSource.buffer = buffer;
        
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 2500;
        
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.8, ctx.currentTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);
        
        noiseSource.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        
        noiseSource.start();
        
        // Delay actual track start slightly to mimic physical needle drop
        setTimeout(() => {
          if (audioRef.current) audioRef.current.play().catch(() => {});
        }, 300);
      } else {
        audioRef.current.play().catch(() => {});
      }
    } else {
      audioRef.current.pause();
    }
  }, [activeMenu, isPlaying]);

  if (!hasStarted) return null;

  return (
    <button
      onClick={() => setIsMuted(!isMuted)}
      style={{
        position: 'absolute',
        bottom: '2rem',
        right: '2rem',
        background: 'rgba(0,0,0,0.5)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '50%',
        width: '45px',
        height: '45px',
        color: 'white',
        cursor: 'pointer',
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease',
        backdropFilter: 'blur(10px)',
      }}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
    >
      {isMuted ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"></path><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>
      )}
    </button>
  );
}

function App() {
  const isPlaying = useStore((state) => state.isPlaying);
  const hasStarted = useStore((state) => state.hasStarted);
  const viewMode = useStore((state) => state.viewMode);
  const setViewMode = useStore((state) => state.setViewMode);
  const controlsRef = useRef(null);

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#050505', position: 'relative', overflow: 'hidden' }}>
      <AudioManager />
      
      {/* Landing Page Overlay - Physically removed when started to clear the way */}
      {!hasStarted && (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 100 }}>
          <LandingPage />
        </div>
      )}
      
      {/* Instruction Doodle Hint - Restored to Left Side pointing Right-Down */}
      {hasStarted && viewMode === 'player' && !isPlaying && (
        <div style={{
          position: 'fixed',
          top: '25%',
          left: '10%',
          zIndex: 150,
          color: 'white',
          fontFamily: "'Inter', sans-serif",
          pointerEvents: 'none',
          animation: 'float 4s ease-in-out infinite',
          textAlign: 'left'
        }}>
          <div style={{
            fontSize: '0.85rem',
            fontWeight: 300,
            letterSpacing: '4px',
            opacity: 0.6,
            maxWidth: '220px',
            lineHeight: 1.8,
            marginBottom: '1rem'
          }}>
            PORTFOLIO PLAYER,<br/>
            <span style={{ color: '#ff4d00', fontWeight: 900 }}>PICK AN ALBUM</span><br/>
            FROM COLLECTION
          </div>
          <svg width="120" height="100" viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Specific 'Down-Right' curve from user screenshot */}
            <path d="M10 10 C 10 40, 20 60, 90 80" stroke="#ff4d00" strokeWidth="3" strokeLinecap="round" />
            <path d="M75 70 L 90 80 L 70 85" stroke="#ff4d00" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}

      {/* Premium Website Navigation - Top Corners */}
      {hasStarted && (
        <>
          {/* Top Left: Home Button */}
          {viewMode === 'player' && (
            <div style={{
              position: 'fixed',
              top: '3rem',
              left: '3rem',
              zIndex: 200,
              pointerEvents: 'auto'
            }}>
              <button 
                onClick={() => {
                  useStore.getState().setHasStarted(false);
                  useStore.getState().setIsPlaying(false);
                  useStore.getState().setActiveMenu(null);
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'white',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  letterSpacing: '5px',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#ff4d00'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'white'; }}
              >
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff4d00' }} />
                HOME
              </button>
            </div>
          )}

          {/* Top Right: Collection Toggle */}
          <div style={{
            position: 'fixed',
            top: '3rem',
            right: '3rem',
            zIndex: 200,
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            pointerEvents: 'auto'
          }}>
            <button 
              onClick={() => setViewMode(viewMode === 'shelf' ? 'player' : 'shelf')}
              className="nav-button"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'white',
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.85rem',
                fontWeight: 800,
                letterSpacing: '5px',
                textTransform: 'uppercase',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '1.5rem',
                transition: 'all 0.3s ease'
              }}
            >
              <div className="nav-arrow" style={{
                width: '40px',
                height: '1px',
                background: '#ff4d00',
                position: 'relative',
                transition: 'all 0.4s ease',
                transform: viewMode === 'shelf' ? 'rotate(180deg)' : 'rotate(0deg)',
                order: viewMode === 'shelf' ? -1 : 1
              }}>
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: '-3px',
                  width: '7px',
                  height: '7px',
                  borderRight: '1px solid #ff4d00',
                  borderTop: '1px solid #ff4d00',
                  transform: 'rotate(45deg)'
                }} />
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <span style={{ opacity: 0.6 }}>{viewMode === 'shelf' ? 'BACK TO' : 'EXPLORE'}</span>
                <span style={{ color: '#ff4d00' }}>{viewMode === 'shelf' ? 'PLAYER' : 'COLLECTION'}</span>
              </div>
            </button>
          </div>
        </>
      )}
      
      <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 1 }}>
        <Canvas shadows camera={{ position: [-14, 7, 12], fov: 45 }}>
          <color attach="background" args={['#030303']} />
          <fog attach="fog" args={['#030303', 12, 35]} />
          
          {/* Professional Studio Lighting - Restored for better metallic detail */}
          <ambientLight intensity={0.4} />
          <spotLight 
            position={[5, 12, 5]} 
            angle={0.6} 
            penumbra={1} 
            intensity={15} 
            castShadow 
            shadow-bias={-0.0001} 
          />
          <pointLight position={[-4, 4, -4]} intensity={1.5} color="#ffffff" />
          
          <Sparkles count={1000} scale={20} size={4} speed={0.4} opacity={0.6} color="#ffffff" />
          <Sparkles count={400} scale={15} size={2} speed={0.8} opacity={0.4} color="#ff4d00" /> {/* Brand accent sparkles */}
          
          <Suspense fallback={null}>
            <Scene />
            <Environment preset="city" environmentIntensity={1.5} />
            
            {/* Ground Shadow Catcher */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.11, 0]} receiveShadow>
              <planeGeometry args={[50, 50]} />
              <shadowMaterial transparent opacity={0.4} />
            </mesh>
          </Suspense>

          <CameraRig controlsRef={controlsRef} />
          <OrbitControls 
            ref={controlsRef}
            makeDefault 
            minPolarAngle={Math.PI / 4} 
            maxPolarAngle={Math.PI / 2.1}
            minAzimuthAngle={-Math.PI / 4}
            maxAzimuthAngle={Math.PI / 4}
            enableZoom={false}
            enablePan={false}
            enabled={hasStarted && !isPlaying} 
          />
        </Canvas>
      </div>

      <Display />
      
      <style>{`
        .nav-button:hover {
          transform: translateX(-10px);
        }
        .nav-button:hover .nav-arrow {
          width: 60px;
          background: white;
        }
        .nav-button:hover .nav-arrow div {
          border-color: white !important;
        }
      `}</style>
    </div>
  );
}

export default App;