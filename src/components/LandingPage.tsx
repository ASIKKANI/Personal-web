import { useState, useRef, useEffect } from 'react';
import type { FC } from 'react';
import { useStore } from '../store/useStore';
import { useProgress } from '@react-three/drei';

const LandingPage: FC = () => {
  const setHasStarted = useStore((state) => state.setHasStarted);
  const { progress, total, loaded } = useProgress();
  const isLoaded = progress === 100 || (total > 0 && loaded === total);

  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startY = useRef(0);
  const startRot = useRef(0);

  // Background Loop Audio
  const bgAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    bgAudioRef.current = new Audio('/New_Project.mp3');
    bgAudioRef.current.volume = 0.5;
    
    // Loop only the first 17 seconds
    const handleTimeUpdate = () => {
      if (bgAudioRef.current && bgAudioRef.current.currentTime >= 17) {
        bgAudioRef.current.currentTime = 0;
        bgAudioRef.current.play().catch(() => {});
      }
    };
    
    bgAudioRef.current.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      if (bgAudioRef.current) {
        bgAudioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
        bgAudioRef.current.pause();
        bgAudioRef.current.src = '';
      }
    };
  }, []);

  // Web Audio Context for realistic vinyl scratching
  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseGainRef = useRef<GainNode | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);
  const timeoutRef = useRef<any>(null);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;

      const bufferSize = ctx.sampleRate * 2; // 2 seconds of noise
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1; // white noise
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = buffer;
      noiseSource.loop = true;

      // Bandpass filter to make it sound like a needle scratch
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1000;
      filter.Q.value = 2.0; // Sharp resonance for a vinyl 'swish'
      filterRef.current = filter;

      const gain = ctx.createGain();
      gain.gain.value = 0; // silent initially
      noiseGainRef.current = gain;

      noiseSource.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noiseSource.start();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    
    // Start background music on first interaction
    if (bgAudioRef.current && bgAudioRef.current.paused) {
      bgAudioRef.current.play().catch(() => {});
    }
  };

  const playScratch = (speed: number) => {
    if (noiseGainRef.current && filterRef.current && audioCtxRef.current) {
      const ctx = audioCtxRef.current;
      const safeSpeed = Math.min(speed, 50); // cap speed
      
      // Louder and higher pitch when moving faster
      const targetGain = Math.min(0.4, safeSpeed * 0.02);
      const targetFreq = 300 + safeSpeed * 40; // Pitch bends with speed

      noiseGainRef.current.gain.setTargetAtTime(targetGain, ctx.currentTime, 0.02);
      filterRef.current.frequency.setTargetAtTime(targetFreq, ctx.currentTime, 0.02);

      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        if (noiseGainRef.current) {
          noiseGainRef.current.gain.setTargetAtTime(0, audioCtxRef.current!.currentTime, 0.1);
        }
      }, 50);
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    initAudio();
    setIsDragging(true);
    startY.current = e.clientY;
    startRot.current = rotation;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging) {
      const deltaY = e.clientY - startY.current;
      setRotation(Math.max(0, startRot.current + deltaY * 1.5));
      playScratch(Math.abs(e.movementY || 10));
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      initAudio();
      setRotation(prev => Math.max(0, prev + e.deltaY * 0.5));
      playScratch(Math.abs(e.deltaY * 0.5));
    };

    const handleFirstInteraction = () => {
      initAudio();
      window.removeEventListener('pointerdown', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };

    window.addEventListener('wheel', handleWheel);
    window.addEventListener('pointerdown', handleFirstInteraction);
    window.addEventListener('keydown', handleFirstInteraction);
    
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('pointerdown', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, []);

  // Helper to map rotation to opacity and transform
  const getStyle = (threshold: number) => {
    const progress = Math.min(1, Math.max(0, (rotation - threshold) / 90));
    return {
      opacity: progress,
      transform: `translateY(${30 - progress * 30}px)`,
      transition: isDragging ? 'none' : 'all 0.1s ease-out'
    };
  };

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      overflow: 'hidden',
      fontFamily: "'Outfit', 'Inter', sans-serif",
      background: 'transparent'
    }}>
      {/* Interactive Wrapper for the Disc */}
      <div 
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{
          position: 'absolute',
          left: '-15%',
          width: '110vh',
          height: '110vh',
          cursor: isDragging ? 'grabbing' : 'grab',
          transform: `rotate(${rotation}deg)`,
          touchAction: 'none' // Prevent scrolling on mobile while dragging
        }}
      >
        {/* Decorative Disc - Detailed with Breathing Animation */}
        <div className="breathing-disc interactive-disc" style={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          background: '#080808',
          boxShadow: '0 0 150px rgba(0,0,0,1), inset 0 0 80px rgba(255,255,255,0.02)',
          animation: 'breathe 8s ease-in-out infinite',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0.85,
          border: '1px solid #111',
          position: 'relative'
        }}>
          {[...Array(25)].map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              width: `${96 - i * 3}%`,
              height: `${96 - i * 3}%`,
              borderRadius: '50%',
              border: '1px solid rgba(255,255,255,0.035)',
              boxShadow: 'inset 0 0 8px rgba(0,0,0,0.6)',
              pointerEvents: 'none'
            }} />
          ))}
          
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: 'conic-gradient(from 0deg, transparent 0%, rgba(255,255,255,0.04) 15%, transparent 30%, transparent 50%, rgba(255,255,255,0.04) 65%, transparent 80%)',
            borderRadius: '50%',
            pointerEvents: 'none'
          }} />

          <div style={{
            position: 'absolute',
            width: '28%',
            height: '28%',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #ff4d00, #ff8800)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#000',
            fontWeight: 900,
            fontSize: '1.2rem',
            textAlign: 'center',
            boxShadow: 'inset 0 0 30px rgba(0,0,0,0.3)',
            letterSpacing: '-1px',
            pointerEvents: 'none'
          }}>
            <span style={{ fontSize: '0.6rem', opacity: 0.6, letterSpacing: '3px', marginBottom: '4px' }}>DRAG OR SCROLL</span>
            ASIK<br/>KANI
          </div>
        </div>
      </div>

      {/* Info Content - Interactive Reveal */}
      <div style={{
        zIndex: 101,
        maxWidth: '1000px',
        width: '90%',
        paddingLeft: '38%',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        pointerEvents: 'none' /* Let drags pass through to the wrapper if needed, but we'll enable pointer events on the button */
      }}>
        <div style={getStyle(0)}>
          <h2 style={{ 
            fontSize: '1rem', 
            textTransform: 'uppercase', 
            letterSpacing: '8px', 
            color: '#ff4d00', 
            margin: 0, 
            marginBottom: '0.8rem',
            fontWeight: 700 
          }}>
            AI / ML ARCHITECT
          </h2>
          <h1 style={{ 
            fontSize: '7.5rem', 
            margin: 0, 
            fontWeight: 900, 
            lineHeight: 0.8, 
            letterSpacing: '-5px',
            background: 'linear-gradient(to bottom, #fff 50%, #666 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            ASIK KANI
          </h1>
        </div>

        <p style={{ 
          fontSize: '1.8rem', 
          lineHeight: 1.2, 
          color: '#999', 
          maxWidth: '600px', 
          margin: 0, 
          fontWeight: 300,
          ...getStyle(90)
        }}>
          Engineering <span style={{ color: '#fff', fontWeight: 600 }}>Interpretable AI</span>, 
          autonomous agents, and high-performance LLM pipelines.
        </p>

        <div style={{ 
          display: 'flex', 
          gap: '5rem', 
          marginTop: '1rem',
          ...getStyle(180)
        }}>
          <div>
            <div style={{ fontSize: '3.5rem', fontWeight: 900, color: '#fff' }}>5</div>
            <div style={{ fontSize: '0.7rem', color: '#555', letterSpacing: '4px', fontWeight: 800 }}>CHAMPION WINS</div>
          </div>
          <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }} />
          <div>
            <div style={{ fontSize: '3.5rem', fontWeight: 900, color: '#fff' }}>40+</div>
            <div style={{ fontSize: '0.7rem', color: '#555', letterSpacing: '4px', fontWeight: 800 }}>PUBLIC REPOS</div>
          </div>
        </div>

        <div style={{ ...getStyle(270), pointerEvents: 'auto' }}>
          <button 
            onClick={() => isLoaded && setHasStarted(true)}
            className={isLoaded ? 'enter-button' : ''}
            style={{
              marginTop: '2.5rem',
              width: 'fit-content',
              background: isLoaded ? 'white' : 'rgba(255,255,255,0.1)',
              color: isLoaded ? 'black' : 'rgba(255,255,255,0.5)',
              border: 'none',
              padding: '1.5rem 5rem',
              fontSize: '1.2rem',
              fontWeight: 900,
              cursor: isLoaded ? 'pointer' : 'wait',
              letterSpacing: '5px',
              textTransform: 'uppercase',
              transition: 'all 0.4s cubic-bezier(0.19, 1, 0.22, 1)',
              position: 'relative',
              overflow: 'hidden'
            }}
            disabled={!isLoaded}
          >
            {isLoaded ? 'Enter Experience' : `Loading ${Math.round(progress)}%`}
          </button>
        </div>
      </div>

      <style>{`
        .interactive-disc {
          transition: transform 0.4s cubic-bezier(0.19, 1, 0.22, 1), box-shadow 0.4s ease;
        }
        .interactive-disc:hover {
          transform: scale(1.02) !important;
          box-shadow: 0 0 200px rgba(255, 77, 0, 0.15), inset 0 0 100px rgba(255,255,255,0.03) !important;
        }
        .interactive-disc:active {
          transform: scale(0.98);
        }
        .enter-button:hover {
          background: #ff4d00 !important;
          color: white !important;
          transform: scale(1.05) translateY(-5px) !important;
          box-shadow: 0 20px 40px rgba(255, 77, 0, 0.3) !important;
        }
        .enter-button:active {
          transform: scale(0.98) !important;
        }
        @keyframes breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.01); }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
