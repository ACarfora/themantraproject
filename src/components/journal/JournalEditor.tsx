'use client';

import { useState, useEffect, useCallback } from 'react';
import { useJournalStore } from '@/stores/useJournalStore';
import { GlassPanel } from '@/components/ui/GlassPanel';

// ─────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────

function todayDate(): string {
  return new Date().toLocaleDateString('en-CA'); // "YYYY-MM-DD"
}

function ordinalSuffix(day: number): string {
  if (day >= 11 && day <= 13) return 'th';
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}

function formatJournalDate(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00'); // noon to avoid timezone shifts
  const weekday = new Intl.DateTimeFormat('en-GB', { weekday: 'long' }).format(date);
  const month = new Intl.DateTimeFormat('en-GB', { month: 'long' }).format(date);
  const day = date.getDate();
  const year = date.getFullYear();
  return `${weekday} ${day}${ordinalSuffix(day)} ${month} ${year}`;
}

function calculateStreak(entries: { date: string }[]): number {
  const entryDates = new Set(entries.map((e) => e.date));
  const today = todayDate();
  if (!entryDates.has(today)) return 0;

  let streak = 1;
  const current = new Date(today + 'T12:00:00');
  while (true) {
    current.setDate(current.getDate() - 1);
    const prev = current.toLocaleDateString('en-CA');
    if (!entryDates.has(prev)) break;
    streak++;
  }
  return streak;
}

// ─────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────

export function JournalEditor({ onBrowse, onSaved }: { onBrowse: () => void; onSaved: () => void }) {
  const entries = useJournalStore((s) => s.entries);
  const saveEntry = useJournalStore((s) => s.saveEntry);

  const today = todayDate();
  const todayEntry = entries.find((e) => e.date === today);

  const [text, setText] = useState(todayEntry?.content ?? '');

  // Sync text when store hydrates (persist is async)
  useEffect(() => {
    if (todayEntry) setText(todayEntry.content);
  }, [todayEntry?.content]); // eslint-disable-line react-hooks/exhaustive-deps

  const streak = calculateStreak(entries);

  const handleSave = useCallback(() => {
    if (!text.trim()) return;
    saveEntry(today, text.trim());
    onSaved();
  }, [text, today, saveEntry, onSaved]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && text.trim()) {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Date heading */}
      <div className="flex items-center justify-between mb-1">
        <h1 className="font-heading text-2xl font-medium tracking-wide text-[var(--color-text)]">
          {formatJournalDate(today)}
        </h1>
        <button
          onClick={onBrowse}
          className="p-1.5 rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors duration-300"
          aria-label="Browse past entries"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </button>
      </div>

      {/* Streak */}
      {streak >= 2 && (
        <p className="text-sm text-[var(--color-accent)] mb-6">Day {streak}</p>
      )}
      {streak < 2 && <div className="mb-6" />}

      {/* Editor panel */}
      <GlassPanel padding="lg" className="w-full">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="How are you feeling today?"
          rows={8}
          className="w-full bg-transparent border-0 rounded-lg
                     px-4 py-3 text-[var(--color-text)] placeholder:text-[var(--color-text-secondary)]/50
                     focus:outline-none
                     transition-colors duration-300 resize-none
                     font-heading"
        />

        <button
          onClick={handleSave}
          disabled={!text.trim()}
          className="w-full mt-4 py-2.5 rounded-lg text-sm font-medium
                     bg-[var(--color-accent)] text-[var(--color-bg)]
                     transition-all duration-300
                     hover:brightness-110 active:scale-[0.98]
                     disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Save Entry
        </button>
      </GlassPanel>

    </div>
  );
}
