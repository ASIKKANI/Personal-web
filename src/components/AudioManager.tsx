import React, { useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';

const AudioManager: React.FC = () => {
  const activeMenu = useStore((state) => state.activeMenu);
  const isPlaying = useStore((state) => state.isPlaying);
  
  const crackleAudioRef = useRef<HTMLAudioElement | null>(null);
  const trackAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio elements if they don't exist
    if (!crackleAudioRef.current) {
      crackleAudioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/1770/1770-preview.mp3'); // Example crackle
      crackleAudioRef.current.loop = true;
      crackleAudioRef.current.volume = 0.2;
    }
    
    if (!trackAudioRef.current) {
      trackAudioRef.current = new Audio();
      trackAudioRef.current.loop = true;
      trackAudioRef.current.volume = 0.5;
    }

    return () => {
      crackleAudioRef.current?.pause();
      trackAudioRef.current?.pause();
    };
  }, []);

  useEffect(() => {
    if (activeMenu && trackAudioRef.current) {
      // In a real app we would load the activeMenu.audioSrc
      // For now, using a placeholder jazz loop from a public source or similar
      trackAudioRef.current.src = 'https://assets.mixkit.co/active_storage/sfx/135/135-preview.mp3'; 
    }
  }, [activeMenu]);

  useEffect(() => {
    if (isPlaying) {
      crackleAudioRef.current?.play().catch(e => console.log("Audio play blocked", e));
      // Delay track start for needle drop
      setTimeout(() => {
        trackAudioRef.current?.play().catch(e => console.log("Audio play blocked", e));
      }, 1000);
    } else {
      crackleAudioRef.current?.pause();
      trackAudioRef.current?.pause();
    }
  }, [isPlaying]);

  return null; // This component handles side-effects only
};

export default AudioManager;
