'use client';

import { useEffect } from 'react';
import { usePreferencesStore } from '@/stores/usePreferencesStore';

export function useTheme() {
  const theme = usePreferencesStore((s) => s.theme);
  const setTheme = usePreferencesStore((s) => s.setTheme);
  const toggleTheme = usePreferencesStore((s) => s.toggleTheme);

  // On first load, check system preference if no stored preference exists
  useEffect(() => {
    const stored = localStorage.getItem('mantra-preferences');
    if (!stored) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
  }, [setTheme]);

  // Apply theme class to <html> whenever theme changes
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
    } else {
      root.classList.remove('light');
    }
  }, [theme]);

  return { theme, toggleTheme, setTheme };
}
