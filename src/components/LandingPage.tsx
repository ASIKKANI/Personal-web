import React from 'react';
import { useStore } from '../store/useStore';

const LandingPage: React.FC = () => {
  const setHasStarted = useStore((state) => state.setHasStarted);

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
      fontFamily: "'Inter', sans-serif",
      background: 'transparent'
    }}>
      {/* Decorative Disc - 20-Layered Detail */}
      <div style={{
        position: 'absolute',
        left: '-5%',
        width: '100vh',
        height: '100vh',
        borderRadius: '50%',
        background: '#080808',
        boxShadow: '0 0 120px rgba(0,0,0,1), inset 0 0 60px rgba(255,255,255,0.02)',
        animation: 'rotate 30s linear infinite',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.8,
        border: '1px solid #111'
      }}>
        {[...Array(20)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: `${95 - i * 3}%`,
            height: `${95 - i * 3}%`,
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.03)',
            boxShadow: 'inset 0 0 5px rgba(0,0,0,0.5)'
          }} />
        ))}
        
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: 'conic-gradient(from 0deg, transparent 0%, rgba(255,255,255,0.03) 15%, transparent 30%, transparent 50%, rgba(255,255,255,0.03) 65%, transparent 80%)',
          borderRadius: '50%',
          animation: 'rotate-reverse 15s linear infinite'
        }} />

        <div style={{
          position: 'absolute',
          width: '28%',
          height: '28%',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #ff4d00, #ff8800)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#000',
          fontWeight: 900,
          fontSize: '1.4rem',
          textAlign: 'center',
          boxShadow: 'inset 0 0 20px rgba(0,0,0,0.2)'
        }}>
          ASIK<br/>KANI
        </div>
        <div style={{
          position: 'absolute',
          width: '8px',
          height: '8px',
          background: '#050505',
          borderRadius: '50%'
        }} />
      </div>

      {/* Info Content */}
      <div style={{
        zIndex: 101,
        maxWidth: '900px',
        width: '90%',
        paddingLeft: '35%',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        pointerEvents: 'auto'
      }}>
        <div>
          <h2 style={{ fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '6px', color: '#ff4d00', margin: 0, marginBottom: '0.5rem' }}>AI / ML BUILDER</h2>
          <h1 style={{ fontSize: '6rem', margin: 0, fontWeight: 900, lineHeight: 0.85 }}>ASIK KANI</h1>
        </div>
        <p style={{ fontSize: '1.6rem', color: '#bbb', maxWidth: '550px', margin: 0 }}>
          Building <span style={{ color: '#fff', fontWeight: 600 }}>Interpretable AI</span>, LLM pipelines, and autonomous agents.
        </p>
        <div style={{ display: 'flex', gap: '4rem', marginTop: '1rem' }}>
          <div>
            <div style={{ fontSize: '3rem', fontWeight: 900 }}>5</div>
            <div style={{ fontSize: '0.75rem', color: '#666', letterSpacing: '3px' }}>HACKATHON WINS</div>
          </div>
          <div>
            <div style={{ fontSize: '3rem', fontWeight: 900 }}>40+</div>
            <div style={{ fontSize: '0.75rem', color: '#666', letterSpacing: '3px' }}>PUBLIC REPOS</div>
          </div>
        </div>
        <button 
          onClick={() => setHasStarted(true)}
          style={{
            marginTop: '2.5rem',
            width: 'fit-content',
            background: 'white',
            color: 'black',
            border: 'none',
            padding: '1.4rem 4rem',
            fontSize: '1.2rem',
            fontWeight: 800,
            cursor: 'pointer',
            letterSpacing: '4px'
          }}
        >
          Enter Experience
        </button>
      </div>

      <style>{`
        @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes rotate-reverse { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
      `}</style>
    </div>
  );
};

export default LandingPage;
