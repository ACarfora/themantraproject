'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { JournalEntry } from '@/types';

interface JournalState {
  entries: JournalEntry[];
  saveEntry: (date: string, content: string) => void;
  removeEntry: (id: string) => void;
}

export const useJournalStore = create<JournalState>()(
  persist(
    (set) => ({
      entries: [],

      saveEntry: (date, content) =>
        set((state) => {
          const existing = state.entries.find((e) => e.date === date);
          const now = new Date().toISOString();

          if (existing) {
            return {
              entries: state.entries.map((e) =>
                e.date === date
                  ? { ...e, content, updatedAt: now }
                  : e
              ),
            };
          }

          return {
            entries: [
              ...state.entries,
              {
                id: crypto.randomUUID(),
                date,
                content,
                createdAt: now,
                updatedAt: now,
              },
            ],
          };
        }),

      removeEntry: (id) =>
        set((state) => ({
          entries: state.entries.filter((e) => e.id !== id),
        })),
    }),
    {
      name: 'journal-store',
    }
  )
);
