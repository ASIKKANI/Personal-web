import { useState, useEffect, FC } from 'react';
import { useStore } from '../store/useStore';

const Display: FC = () => {
  const activeMenu = useStore((state) => state.activeMenu);
  const isPlaying = useStore((state) => state.isPlaying);
  const viewMode = useStore((state) => state.viewMode);
  const setIsPlaying = useStore((state) => state.setIsPlaying);
  const setActiveMenu = useStore((state) => state.setActiveMenu);
  
  const [showTools, setShowTools] = React.useState(false);
  const [selectedProject, setSelectedProject] = React.useState<any>(null);

  const handleClose = () => {
    setIsPlaying(false);
    setShowTools(false);
    setSelectedProject(null);
    useStore.getState().setViewMode('shelf');
    setTimeout(() => setActiveMenu(null), 1000);
  };

  // Reset selected project when switching albums
  React.useEffect(() => {
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
      background: 'rgba(3, 3, 3, 0.45)',
      backdropFilter: 'blur(8px)',
      transition: 'opacity 0.8s ease, transform 0.8s ease',
      transform: isVisible ? 'translateX(0)' : 'translateX(100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingLeft: '5rem',
      paddingRight: '3rem',
      zIndex: 10,
      color: 'white',
      fontFamily: "'Inter', sans-serif",
      border: 'none',
      maskImage: 'linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 25%)',
      WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 25%)'
    }}>
      {activeMenu && (
        <div style={{
          maxWidth: '550px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.8rem'
        }}>
          {/* Header Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '30px', height: '1px', background: '#ff4d00' }} />
              <span style={{ color: '#ff4d00', fontSize: '0.7rem', fontWeight: 900, letterSpacing: '4px' }}>
                {selectedProject ? 'TRACK DETAILS' : activeMenu.section || 'SECTION'}
              </span>
            </div>
            
            <h1 style={{ color: 'white', margin: '0', fontSize: '3.5rem', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-2px' }}>
              {selectedProject ? selectedProject.title : activeMenu.title}
            </h1>
            
            {(selectedProject?.subtitle || activeMenu.content?.tagline) && (
              <p style={{ color: '#ff4d00', marginTop: '0.2rem', fontSize: '1.1rem', fontWeight: 600, opacity: 0.9 }}>
                {selectedProject ? selectedProject.subtitle : activeMenu.content.tagline}
              </p>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxHeight: '60vh', overflowY: 'auto', paddingRight: '1rem' }} className="custom-scroll">
            
            {/* 1. PROJECT TRACK LIST VIEW */}
            {activeMenu.id === 'projects' && !selectedProject && activeMenu.content?.projectsList && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
                <p style={{ opacity: 0.6, fontSize: '0.7rem', color: 'white', letterSpacing: '2px', marginBottom: '1rem' }}>SELECT A TRACK TO INSPECT</p>
                {activeMenu.content.projectsList.map((project: any, i: number) => (
                  <div 
                    key={project.id}
                    onClick={() => setSelectedProject(project)}
                    className="track-item"
                    style={{
                      padding: '1.2rem',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1.5rem',
                      transition: 'all 0.3s ease',
                      pointerEvents: 'auto'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 77, 0, 0.2)';
                      e.currentTarget.style.borderColor = 'rgba(255, 77, 0, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                    }}
                  >
                    <span style={{ fontSize: '0.8rem', color: '#ff4d00', fontWeight: 900 }}>0{i + 1}</span>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>{project.title}</span>
                      <span style={{ fontSize: '0.7rem', color: 'white', opacity: 0.7, letterSpacing: '1px' }}>{project.subtitle}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 2. PROJECT DETAIL VIEW */}
            {selectedProject && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <p style={{ lineHeight: '1.8', fontSize: '1rem', color: '#ffffff', fontWeight: 300, margin: 0 }}>
                  {selectedProject.description}
                </p>

                {selectedProject.features && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    <h4 style={{ margin: 0, fontSize: '0.7rem', color: '#ff4d00', fontWeight: 900, letterSpacing: '2px' }}>KEY FEATURES</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                      {selectedProject.features.map((feature: any, i: number) => (
                        <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                          <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#ffffff' }}>• {feature.name}</span>
                          <span style={{ fontSize: '0.75rem', color: '#ffffff', opacity: 0.7, lineHeight: 1.4 }}>{feature.detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedProject.impact && (
                  <div style={{
                    background: 'rgba(255, 77, 0, 0.15)',
                    borderLeft: '4px solid #ff4d00',
                    padding: '1.2rem 1.8rem',
                    borderRadius: '2px'
                  }}>
                    <span style={{ fontSize: '0.65rem', color: '#ff4d00', fontWeight: 900, letterSpacing: '2px', display: 'block', marginBottom: '0.5rem' }}>CORE IMPACT</span>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#ffffff' }}>{selectedProject.impact}</p>
                  </div>
                )}

                <button 
                  onClick={() => setSelectedProject(null)}
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.4)',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    padding: '0.8rem 1.5rem',
                    borderRadius: '2px',
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    width: 'fit-content',
                    pointerEvents: 'auto'
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
                  <p style={{ lineHeight: '1.8', fontSize: '0.95rem', color: '#ffffff', fontWeight: 300, margin: 0 }}>
                    {activeMenu.content.bio}
                  </p>
                )}

                {activeMenu.content?.roles && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {activeMenu.content.roles.map((role: any, i: number) => (
                      <div key={i} style={{ borderLeft: '2px solid rgba(255, 77, 0, 0.4)', paddingLeft: '1.5rem', position: 'relative' }}>
                        <div style={{ position: 'absolute', left: '-5px', top: '0', width: '9px', height: '9px', borderRadius: '50%', background: '#ff4d00' }} />
                        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'white' }}>{role.title}</h3>
                        <p style={{ margin: '0.3rem 0', fontSize: '0.8rem', color: '#ff4d00', fontWeight: 600 }}>{role.company} • <span style={{ color: 'white', opacity: 0.8 }}>{role.period}</span></p>
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.8rem', flexWrap: 'wrap' }}>
                          {role.skills.map((skill: string, j: number) => (
                            <span key={j} style={{ fontSize: '0.65rem', background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.6rem', borderRadius: '2px', border: '1px solid rgba(255,255,255,0.2)', color: 'white' }}>{skill}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeMenu.id === 'about-me' && activeMenu.content && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', borderLeft: '1px solid rgba(255,255,255,0.2)', paddingLeft: '1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                      <span style={{ fontSize: '0.65rem', color: '#ff4d00', fontWeight: 900, letterSpacing: '1px' }}>EDUCATION</span>
                      <span style={{ fontSize: '0.9rem', color: 'white' }}>{activeMenu.content.education}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                      <span style={{ fontSize: '0.65rem', color: '#ff4d00', fontWeight: 900, letterSpacing: '1px' }}>TECHNICAL FOCUS</span>
                      <span style={{ fontSize: '0.9rem', color: 'white' }}>{activeMenu.content.focus}</span>
                    </div>

                    {/* Hobbies Section */}
                    {activeMenu.content.hobbies && (
                      <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <span style={{ fontSize: '0.65rem', color: '#ff4d00', fontWeight: 900, letterSpacing: '1px' }}>HOBBIES & PASSIONS</span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                          {activeMenu.content.hobbies.map((hobby: any, i: number) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                              <span style={{ fontSize: '1.2rem' }}>
                                {hobby.name === 'Audiophile' ? '🎵' : hobby.name === 'Poetry' ? '✍️' : '🎮'}
                              </span>
                              <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'white' }}>{hobby.name}</span>
                                <span style={{ fontSize: '0.7rem', color: 'white', opacity: 0.7 }}>{hobby.detail}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeMenu.content?.achievements && (
                  <div style={{
                    background: 'rgba(255, 77, 0, 0.15)',
                    border: '1px solid rgba(255, 77, 0, 0.4)',
                    padding: '1.2rem 1.8rem',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    color: '#ff4d00',
                    fontWeight: 900,
                    fontSize: '0.9rem',
                    letterSpacing: '1px'
                  }}>
                    <span style={{ fontSize: '1.5rem' }}>🏆</span>
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
                        style={{
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '1.5rem',
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '4px',
                          color: 'white',
                          transition: 'all 0.3s ease',
                          pointerEvents: 'auto'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(255, 77, 0, 0.15)';
                          e.currentTarget.style.borderColor = '#ff4d00';
                          e.currentTarget.style.transform = 'translateX(10px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                          e.currentTarget.style.transform = 'translateX(0)';
                        }}
                      >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                          <span style={{ fontSize: '0.7rem', color: '#ff4d00', fontWeight: 900, letterSpacing: '2px' }}>{link.name.toUpperCase()}</span>
                          <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>{link.type === 'email' ? 'Send a Message' : `Visit ${link.name}`}</span>
                        </div>
                        <span style={{ fontSize: '1.5rem' }}>→</span>
                      </a>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Tools Grid Displayed when Toggled */}
            {showTools && (
              <div style={{ 
                marginTop: '1rem', 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', 
                gap: '0.8rem',
                padding: '1.5rem',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '4px',
                border: '1px solid rgba(255,255,255,0.05)',
                animation: 'fadeIn 0.5s ease'
              }}>
                {allTools.map((tool, i) => (
                  <div key={i} style={{ 
                    fontSize: '0.7rem', 
                    color: 'white', 
                    opacity: 0.8, 
                    textAlign: 'center',
                    padding: '0.5rem',
                    background: 'rgba(255, 77, 0, 0.05)',
                    border: '1px solid rgba(255, 77, 0, 0.1)',
                    borderRadius: '2px'
                  }}>
                    {tool}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button 
              onClick={handleClose}
              className="stop-button"
              style={{
                background: 'white',
                border: 'none',
                color: '#050505',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: 800,
                padding: '1rem 2.5rem',
                borderRadius: '2px',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                transition: 'all 0.3s ease',
                pointerEvents: 'auto'
              }}
            >
              Stop Playing
            </button>
            
            {(activeMenu.id === 'experiences' || activeMenu.id === 'projects') && (
              <button 
                onClick={() => setShowTools(!showTools)}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  padding: '1rem 2rem',
                  borderRadius: '2px',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  transition: 'all 0.3s ease',
                  pointerEvents: 'auto'
                }}
              >
                {showTools ? 'Hide Tools' : 'View Tech Stack'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Display;