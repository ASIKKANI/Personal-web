import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { useStore } from '../store/useStore';

const Display: FC = () => {
  const activeMenu = useStore((state) => state.activeMenu);
  const isPlaying = useStore((state) => state.isPlaying);
  const viewMode = useStore((state) => state.viewMode);
  const setIsPlaying = useStore((state) => state.setIsPlaying);
  const setActiveMenu = useStore((state) => state.setActiveMenu);
  
  const [showTools, setShowTools] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const handleClose = () => {
    setIsPlaying(false);
    setShowTools(false);
    setSelectedProject(null);
    useStore.getState().setViewMode('shelf');
    setTimeout(() => setActiveMenu(null), 1000);
  };

  // Reset selected project when switching albums
  useEffect(() => {
    setSelectedProject(null);
    setShowTools(false);
  }, [activeMenu?.id]);

  const isVisible = isPlaying && viewMode === 'player';
  const allTools = ["Python", "PyTorch", "LangChain", "TensorFlow", "React", "Node.js", "C++", "Arduino", "Nvidia NIM", "Amazon Bedrock", "AWS SageMaker"];

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      right: 0,
      width: '45vw',
      height: '100vh',
      pointerEvents: isVisible ? 'auto' : 'none',
      opacity: isVisible ? 1 : 0,
      background: 'rgba(5, 5, 5, 0.6)',
      backdropFilter: 'blur(12px)',
      transition: 'opacity 0.8s ease, transform 0.8s ease',
      transform: isVisible ? 'translateX(0)' : 'translateX(100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingLeft: '5rem',
      paddingRight: '3rem',
      zIndex: 10,
      color: 'white',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      borderLeft: '1px solid rgba(255,255,255,0.05)',
    }}>
      {activeMenu && (
        <div style={{
          maxWidth: '550px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem'
        }}>
          {/* Header Section */}
          <div className="animate-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '30px', height: '1px', background: '#ff4d00' }} />
              <span style={{ color: '#ff4d00', fontSize: '0.75rem', fontWeight: 900, letterSpacing: '4px' }}>
                {selectedProject ? 'TRACK DETAILS' : activeMenu.section || 'SECTION'}
              </span>
            </div>
            
            <h1 className="animate-fade-up delay-100" style={{ 
              margin: '0', 
              fontSize: '3.5rem', 
              fontWeight: 900, 
              lineHeight: 1.1, 
              letterSpacing: '-2px',
              background: 'linear-gradient(135deg, #ffffff 0%, #a0a0a0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              {selectedProject ? selectedProject.title : activeMenu.title}
            </h1>
            
            {(selectedProject?.subtitle || activeMenu.content?.tagline) && (
              <p className="animate-fade-up delay-200" style={{ color: '#ff4d00', marginTop: '0.2rem', fontSize: '1.1rem', fontWeight: 600, opacity: 0.9 }}>
                {selectedProject ? selectedProject.subtitle : activeMenu.content.tagline}
              </p>
            )}
          </div>

          <div className="custom-scroll animate-fade-up delay-300" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxHeight: '60vh', overflowY: 'auto', paddingRight: '1rem', paddingBottom: '2rem' }}>
            
            {/* 1. PROJECT TRACK LIST VIEW */}
            {activeMenu.id === 'projects' && !selectedProject && activeMenu.content?.projectsList && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
                <p style={{ opacity: 0.6, fontSize: '0.7rem', color: 'white', letterSpacing: '2px', marginBottom: '0.5rem' }}>SELECT A TRACK TO INSPECT</p>
                {activeMenu.content.projectsList.map((project: any, i: number) => (
                  <div 
                    key={project.id}
                    onClick={() => setSelectedProject(project)}
                    className="track-item glass-card animate-slide-right"
                    style={{
                      animationDelay: `${(i+1) * 100}ms`,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1.5rem',
                      pointerEvents: 'auto'
                    }}
                  >
                    <span style={{ fontSize: '0.8rem', color: '#ff4d00', fontWeight: 900 }}>0{i + 1}</span>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>{project.title}</span>
                      <span style={{ fontSize: '0.75rem', color: 'white', opacity: 0.7, letterSpacing: '1px', marginTop: '0.2rem' }}>{project.subtitle}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 2. PROJECT DETAIL VIEW */}
            {selectedProject && (
              <div className="animate-fade-up delay-100" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div className="glass-card">
                  <p style={{ lineHeight: '1.8', fontSize: '1rem', color: '#ffffff', fontWeight: 300, margin: 0 }}>
                    {selectedProject.description}
                  </p>
                </div>

                {selectedProject.features && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    <h4 style={{ margin: 0, fontSize: '0.7rem', color: '#ff4d00', fontWeight: 900, letterSpacing: '2px' }}>KEY FEATURES</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      {selectedProject.features.map((feature: any, i: number) => (
                        <div key={i} className="glass-card animate-slide-right" style={{ animationDelay: `${i * 100}ms`, padding: '1.2rem', gap: '0.5rem', display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#ffffff' }}>{feature.name}</span>
                          <span style={{ fontSize: '0.75rem', color: '#ffffff', opacity: 0.7, lineHeight: 1.5 }}>{feature.detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedProject.impact && (
                  <div className="glass-card animate-fade-up delay-300" style={{ borderLeft: '4px solid #ff4d00' }}>
                    <span style={{ fontSize: '0.65rem', color: '#ff4d00', fontWeight: 900, letterSpacing: '2px', display: 'block', marginBottom: '0.5rem' }}>CORE IMPACT</span>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#ffffff', lineHeight: 1.6 }}>{selectedProject.impact}</p>
                  </div>
                )}

                <button 
                  onClick={() => setSelectedProject(null)}
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    padding: '1rem 2rem',
                    borderRadius: '30px',
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    width: 'fit-content',
                    pointerEvents: 'auto',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  ← Back to Project List
                </button>
              </div>
            )}

            {/* 3. STANDARD BIO VIEW (About Me / Experiences) */}
            {!selectedProject && activeMenu.id !== 'projects' && (
              <>
                {activeMenu.content?.bio && (
                  <p style={{ lineHeight: '1.8', fontSize: '1rem', color: 'rgba(255,255,255,0.9)', fontWeight: 300, margin: 0 }}>
                    {activeMenu.content.bio}
                  </p>
                )}

                {activeMenu.content?.roles && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                    {activeMenu.content.roles.map((role: any, i: number) => (
                      <div key={i} className="glass-card animate-slide-right" style={{ animationDelay: `${i * 100}ms` }}>
                        <div style={{ position: 'absolute', left: '0', top: '0', width: '4px', height: '100%', background: '#ff4d00' }} />
                        <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: 'white' }}>{role.title}</h3>
                        <p style={{ margin: '0.5rem 0', fontSize: '0.85rem', color: '#ff4d00', fontWeight: 600 }}>{role.company} • <span style={{ color: 'white', opacity: 0.6 }}>{role.period}</span></p>
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                          {role.skills.map((skill: string, j: number) => (
                            <span key={j} style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.05)', padding: '0.3rem 0.8rem', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)' }}>{skill}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeMenu.id === 'about-me' && activeMenu.content && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="glass-card animate-slide-right delay-100" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.65rem', color: '#ff4d00', fontWeight: 900, letterSpacing: '2px' }}>EDUCATION</span>
                      <span style={{ fontSize: '1rem', color: 'white', fontWeight: 500 }}>{activeMenu.content.education}</span>
                    </div>
                    <div className="glass-card animate-slide-right delay-200" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.65rem', color: '#ff4d00', fontWeight: 900, letterSpacing: '2px' }}>TECHNICAL FOCUS</span>
                      <span style={{ fontSize: '1rem', color: 'white', fontWeight: 500, lineHeight: 1.5 }}>{activeMenu.content.focus}</span>
                    </div>

                    {/* Hobbies Section */}
                    {activeMenu.content.hobbies && (
                      <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <span className="animate-fade-up delay-300" style={{ fontSize: '0.65rem', color: '#ff4d00', fontWeight: 900, letterSpacing: '2px' }}>HOBBIES & PASSIONS</span>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.8rem' }}>
                          {activeMenu.content.hobbies.map((hobby: any, i: number) => (
                            <div key={i} className="glass-card animate-slide-right" style={{ animationDelay: `${(i+4)*100}ms`, display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                              <span style={{ fontSize: '1.8rem', filter: 'drop-shadow(0 0 10px rgba(255,77,0,0.3))' }}>
                                {hobby.name === 'Audiophile' ? '🎵' : hobby.name === 'Poetry' ? '✍️' : '🎮'}
                              </span>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                                <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'white' }}>{hobby.name}</span>
                                <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.4 }}>{hobby.detail}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeMenu.content?.achievements && (
                  <div className="glass-card animate-fade-up delay-500" style={{
                    borderColor: 'rgba(255, 77, 0, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.2rem',
                    color: '#ff4d00',
                    fontWeight: 900,
                    fontSize: '0.9rem',
                    letterSpacing: '1px',
                    marginTop: '1rem'
                  }}>
                    <span style={{ fontSize: '1.8rem' }}>🏆</span>
                    <span>{activeMenu.content.achievements.toUpperCase()}</span>
                  </div>
                )}

                {/* Connect Links Section */}
                {activeMenu.id === 'connect' && activeMenu.content?.links && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                    {activeMenu.content.links.map((link: any, i: number) => (
                      <a 
                        key={i}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="glass-card animate-slide-right"
                        style={{
                          animationDelay: `${(i+1) * 100}ms`,
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          color: 'white',
                          pointerEvents: 'auto'
                        }}
                      >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                          <span style={{ fontSize: '0.7rem', color: '#ff4d00', fontWeight: 900, letterSpacing: '2px' }}>{link.name.toUpperCase()}</span>
                          <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>{link.type === 'email' ? 'Send a Message' : `Visit ${link.name}`}</span>
                        </div>
                        <span style={{ fontSize: '1.5rem', opacity: 0.8 }}>→</span>
                      </a>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Tools Grid Displayed when Toggled */}
            {showTools && (
              <div className="glass-card animate-fade-up" style={{ 
                marginTop: '1rem', 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', 
                gap: '0.8rem',
              }}>
                {allTools.map((tool, i) => (
                  <div key={i} style={{ 
                    fontSize: '0.75rem', 
                    color: 'white', 
                    fontWeight: 600,
                    textAlign: 'center',
                    padding: '0.6rem',
                    background: 'rgba(255, 77, 0, 0.1)',
                    border: '1px solid rgba(255, 77, 0, 0.2)',
                    borderRadius: '4px'
                  }}>
                    {tool}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="animate-fade-up delay-400" style={{ display: 'flex', gap: '1rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <button 
              onClick={handleClose}
              style={{
                background: '#ffffff',
                border: 'none',
                color: '#050505',
                cursor: 'pointer',
                fontSize: '0.75rem',
                fontWeight: 900,
                padding: '1rem 2rem',
                borderRadius: '30px',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                transition: 'all 0.3s ease',
                pointerEvents: 'auto',
                boxShadow: '0 4px 15px rgba(255,255,255,0.2)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(255,255,255,0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(255,255,255,0.2)';
              }}
            >
              Stop Playing
            </button>
            
            {(activeMenu.id === 'experiences' || activeMenu.id === 'projects') && (
              <button 
                onClick={() => setShowTools(!showTools)}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  padding: '1rem 2rem',
                  borderRadius: '30px',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  transition: 'all 0.3s ease',
                  pointerEvents: 'auto'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                }}
              >
                {showTools ? 'Hide Tech Stack' : 'View Tech Stack'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Display;