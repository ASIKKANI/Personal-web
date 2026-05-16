import { create } from 'zustand';
import * as THREE from 'three';

interface MenuState {
  id: string;
  title: string;
  audioSrc: string;
  color: string;
  image?: string;
  section?: string;
  content?: any;
}

interface AppState {
  hasStarted: boolean;
  activeMenu: MenuState | null;
  isPlaying: boolean;
  viewMode: 'player' | 'shelf';
  cameraPosition: THREE.Vector3;
  setHasStarted: (hasStarted: boolean) => void;
  setActiveMenu: (menu: MenuState | null) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setViewMode: (mode: 'player' | 'shelf') => void;
  setCameraPosition: (position: THREE.Vector3) => void;
}

export const useStore = create<AppState>((set) => ({
  hasStarted: false,
  activeMenu: null,
  isPlaying: false,
  viewMode: 'player',
  cameraPosition: new THREE.Vector3(0, 2, 5),
  setHasStarted: (hasStarted) => set({ hasStarted }),
  setActiveMenu: (menu) => set({ activeMenu: menu }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setCameraPosition: (position) => set({ cameraPosition: position }),
}));
