import React from 'react';
import { useStore } from '../store/useStore';

const Display: React.FC = () => {
  const activeMenu = useStore((state) => state.activeMenu);
  const isPlaying = useStore((state) => state.isPlaying);
  const viewMode = useStore((state) => state.viewMode);
  const setIsPlaying = useStore((state) => state.setIsPlaying);
  const setActiveMenu = useStore((state) => state.setActiveMenu);

  const handleClose = () => {
    setIsPlaying(false);
    setTimeout(() => setActiveMenu(null), 1000);
  };

  const isVisible = isPlaying && viewMode === 'player';

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      right: 0, // stick to the right side
      width: '40vw',
      height: '100vh',
      pointerEvents: isVisible ? 'auto' : 'none',
      opacity: isVisible ? 1 : 0,
      background: 'linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(10, 8, 8, 0.9) 50%, rgba(10, 8, 8, 0.95) 100%)',
      backdropFilter: 'blur(4px)',
      transition: 'opacity 0.8s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingLeft: '4rem',
      paddingRight: '2rem',
      zIndex: 10,
      color: 'white',
    }}>
      {activeMenu && (
        <div style={{
          maxWidth: '500px',
          width: '100%',
          position: 'relative'
        }}>
          <h1 style={{ color: activeMenu.color, margin: '0 0 0.5rem 0', fontSize: '3rem', fontWeight: 800 }}>{activeMenu.title}</h1>
          <p style={{ color: '#aaa', marginBottom: '2.5rem', fontStyle: 'italic', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.8rem' }}>
            Now Playing: {activeMenu.title} Theme
          </p>
          <div style={{ lineHeight: '1.8', fontSize: '1.15rem', color: '#e0e0e0' }}>
            {activeMenu.id === 'kid-a' && <p>I am an AI/ML builder specializing in Interpretable AI and LLM pipelines. I love pushing the boundaries of autonomous agents and high-performance digital architectures.</p>}
            {activeMenu.id === 'grace' && <p>With 5 hackathon wins and 40+ public repositories, I focus on building robust, production-ready AI solutions that solve real-world problems.</p>}
            {activeMenu.id === 'the-glow-pt2' && <p>My technical stack includes Python, PyTorch, LangChain, and advanced vector databases. I build systems that are not just smart, but explainable.</p>}
            {activeMenu.id === 'the-bends' && <p>Let's collaborate on the next generation of autonomous intelligence. Reach out to me via email or GitHub to see my latest work.</p>}
          </div>

          <button 
            onClick={handleClose}
            style={{
              marginTop: '3rem',
              background: 'transparent',
              border: `1px solid ${activeMenu.color}`,
              color: activeMenu.color,
              cursor: 'pointer',
              fontSize: '1rem',
              padding: '0.8rem 2rem',
              borderRadius: '30px',
              transition: 'background 0.3s ease, color 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = activeMenu.color;
              e.currentTarget.style.color = '#111';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = activeMenu.color;
            }}
          >
            Stop Playing
          </button>
        </div>
      )}
    </div>
  );
};

export default Display;