'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Mantra } from '@/types';

interface MantraState {
  mantras: Mantra[];
  addMantra: (mantra: Omit<Mantra, 'id' | 'createdAt'>) => void;
  removeMantra: (id: string) => void;
}

export const useMantraStore = create<MantraState>()(
  persist(
    (set) => ({
      mantras: [],

      addMantra: (mantra) =>
        set((state) => ({
          mantras: [
            ...state.mantras,
            {
              ...mantra,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      removeMantra: (id) =>
        set((state) => ({
          mantras: state.mantras.filter((m) => m.id !== id),
        })),
    }),
    {
      name: 'mantra-store',
    }
  )
);
