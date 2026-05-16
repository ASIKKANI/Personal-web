import { FC } from 'react';
import { useStore } from '../store/useStore';

const LandingPage: FC = () => {
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
      fontFamily: "'Outfit', 'Inter', sans-serif",
      background: 'transparent'
    }}>
      {/* Decorative Disc - Detailed with Breathing Animation */}
      <div className="breathing-disc" style={{
        position: 'absolute',
        left: '-8%',
        width: '110vh',
        height: '110vh',
        borderRadius: '50%',
        background: '#080808',
        boxShadow: '0 0 150px rgba(0,0,0,1), inset 0 0 80px rgba(255,255,255,0.02)',
        animation: 'rotate 40s linear infinite, breathe 8s ease-in-out infinite',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.85,
        border: '1px solid #111'
      }}>
        {[...Array(25)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: `${96 - i * 3}%`,
            height: `${96 - i * 3}%`,
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.035)',
            boxShadow: 'inset 0 0 8px rgba(0,0,0,0.6)'
          }} />
        ))}
        
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: 'conic-gradient(from 0deg, transparent 0%, rgba(255,255,255,0.04) 15%, transparent 30%, transparent 50%, rgba(255,255,255,0.04) 65%, transparent 80%)',
          borderRadius: '50%',
          animation: 'rotate-reverse 20s linear infinite'
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
          fontSize: '1.6rem',
          textAlign: 'center',
          boxShadow: 'inset 0 0 30px rgba(0,0,0,0.3)',
          letterSpacing: '-1px'
        }}>
          ASIK<br/>KANI
        </div>
      </div>

      {/* Info Content - Staggered Animations */}
      <div style={{
        zIndex: 101,
        maxWidth: '1000px',
        width: '90%',
        paddingLeft: '38%',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        pointerEvents: 'auto'
      }}>
        <div className="fade-in-up" style={{ animationDelay: '0.2s' }}>
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

        <p className="fade-in-up" style={{ 
          fontSize: '1.8rem', 
          lineHeight: 1.2, 
          color: '#999', 
          maxWidth: '600px', 
          margin: 0, 
          fontWeight: 300,
          animationDelay: '0.4s'
        }}>
          Engineering <span style={{ color: '#fff', fontWeight: 600 }}>Interpretable AI</span>, 
          autonomous agents, and high-performance LLM pipelines.
        </p>

        <div className="fade-in-up" style={{ 
          display: 'flex', 
          gap: '5rem', 
          marginTop: '1rem',
          animationDelay: '0.6s'
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

        <button 
          onClick={() => setHasStarted(true)}
          className="fade-in-up enter-button"
          style={{
            marginTop: '2.5rem',
            width: 'fit-content',
            background: 'white',
            color: 'black',
            border: 'none',
            padding: '1.5rem 5rem',
            fontSize: '1.2rem',
            fontWeight: 900,
            cursor: 'pointer',
            letterSpacing: '5px',
            textTransform: 'uppercase',
            animationDelay: '0.8s',
            transition: 'all 0.4s cubic-bezier(0.19, 1, 0.22, 1)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          Enter Experience
        </button>
      </div>

      <style>{`
        .fade-in-up {
          opacity: 0;
          transform: translateY(30px);
          animation: fadeInUp 1s cubic-bezier(0.19, 1, 0.22, 1) forwards;
        }
        .enter-button:hover {
          background: #ff4d00 !important;
          color: white !important;
          transform: scale(1.05) translateY(-5px);
          box-shadow: 0 20px 40px rgba(255, 77, 0, 0.3);
        }
        .enter-button:active {
          transform: scale(0.98);
        }
        @keyframes fadeInUp {
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }
        @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes rotate-reverse { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
      `}</style>
    </div>
  );
};

export default LandingPage;
