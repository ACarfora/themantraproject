'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PreferencesState {
  theme: 'dark' | 'light';
  soundEnabled: boolean;
  volume: number;
  activeSound: string | null;
  userName: string;
  setTheme: (theme: 'dark' | 'light') => void;
  toggleTheme: () => void;
  setSoundEnabled: (enabled: boolean) => void;
  setVolume: (volume: number) => void;
  setActiveSound: (sound: string | null) => void;
  setUserName: (name: string) => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      theme: 'dark',
      soundEnabled: true,
      volume: 0.5,
      activeSound: null,
      userName: '',

      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
      setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
      setVolume: (volume) => set({ volume: Math.max(0, Math.min(1, volume)) }),
      setActiveSound: (sound) => set({ activeSound: sound }),
      setUserName: (name) => set({ userName: name }),
    }),
    {
      name: 'mantra-preferences',
    }
  )
);
