'use client';

import { useMemo } from 'react';
import { useJournalStore } from '@/stores/useJournalStore';
import { GlassPanel } from '@/components/ui/GlassPanel';

// ─────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────

function todayDate(): string {
  return new Date().toLocaleDateString('en-CA');
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
  const date = new Date(dateStr + 'T12:00:00');
  const weekday = new Intl.DateTimeFormat('en-GB', { weekday: 'long' }).format(date);
  const month = new Intl.DateTimeFormat('en-GB', { month: 'long' }).format(date);
  const day = date.getDate();
  const year = date.getFullYear();
  return `${weekday} ${day}${ordinalSuffix(day)} ${month} ${year}`;
}

const DAY_LABELS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

interface JournalCalendarProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  viewMonth: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onWrite: () => void;
}

// ─────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────

export function JournalCalendar({
  selectedDate,
  onSelectDate,
  viewMonth,
  onPrevMonth,
  onNextMonth,
  onWrite,
}: JournalCalendarProps) {
  const entries = useJournalStore((s) => s.entries);
  const today = todayDate();

  const entryDates = useMemo(
    () => new Set(entries.map((e) => e.date)),
    [entries]
  );

  const recentEntries = useMemo(
    () => [...entries].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 7),
    [entries]
  );

  // Build calendar grid
  const { days, monthLabel } = useMemo(() => {
    const year = viewMonth.getFullYear();
    const month = viewMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Monday = 0, Sunday = 6  (JS getDay(): 0=Sun, 1=Mon...)
    const startDow = (firstDay.getDay() + 6) % 7;
    const totalDays = lastDay.getDate();

    const cells: (string | null)[] = [];
    // Leading blanks
    for (let i = 0; i < startDow; i++) cells.push(null);
    // Day cells
    for (let d = 1; d <= totalDays; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      cells.push(dateStr);
    }

    const label = new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric' }).format(firstDay);

    return { days: cells, monthLabel: label };
  }, [viewMonth]);

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Month header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-medium tracking-wide text-[var(--color-text)]">
          {monthLabel}
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={onPrevMonth}
            className="w-8 h-8 flex items-center justify-center rounded-full
                       text-[var(--color-text-secondary)] hover:text-[var(--color-text)]
                       hover:bg-[var(--color-surface)] transition-colors duration-300"
            aria-label="Previous month"
          >
            &lt;
          </button>
          <button
            onClick={onNextMonth}
            className="w-8 h-8 flex items-center justify-center rounded-full
                       text-[var(--color-text-secondary)] hover:text-[var(--color-text)]
                       hover:bg-[var(--color-surface)] transition-colors duration-300"
            aria-label="Next month"
          >
            &gt;
          </button>
        </div>
      </div>

      {/* Calendar grid */}
      <GlassPanel padding="md" className="w-full">
        {/* Day labels */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAY_LABELS.map((d) => (
            <div key={d} className="text-center text-xs text-[var(--color-text-secondary)]">
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((dateStr, i) => {
            if (!dateStr) {
              return <div key={`blank-${i}`} className="w-9 h-9" />;
            }

            const dayNum = parseInt(dateStr.split('-')[2], 10);
            const isToday = dateStr === today;
            const isSelected = dateStr === selectedDate;
            const hasEntry = entryDates.has(dateStr);
            const isFuture = dateStr > today;

            return (
              <button
                key={dateStr}
                onClick={() => !isFuture && onSelectDate(dateStr)}
                disabled={isFuture}
                className={`
                  relative w-9 h-9 flex flex-col items-center justify-center rounded-lg
                  text-sm transition-all duration-200
                  ${isFuture ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
                  ${isSelected ? 'ring-1 ring-[var(--color-accent)]' : ''}
                  ${isToday && !isSelected ? 'bg-[var(--color-surface)]' : ''}
                  ${!isFuture && !isSelected ? 'hover:bg-[var(--color-surface)]/60' : ''}
                  text-[var(--color-text)]
                `}
              >
                <span className="leading-none">{dayNum}</span>
                {hasEntry && (
                  <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-[var(--color-accent)]" />
                )}
              </button>
            );
          })}
        </div>
      </GlassPanel>

      {/* Recent entries — weekly journal */}
      {recentEntries.length > 0 && (
        <div className="mt-4 space-y-3">
          {recentEntries.map((entry) => (
            <GlassPanel key={entry.id} padding="md" className="w-full">
              <p className="text-xs text-[var(--color-text-secondary)] mb-2">
                {formatJournalDate(entry.date)}
              </p>
              <p className="text-sm text-[var(--color-text)] font-heading whitespace-pre-wrap">
                {entry.content}
              </p>
            </GlassPanel>
          ))}
        </div>
      )}

      {/* Write link */}
      <p className="mt-8 text-center">
        <button
          onClick={onWrite}
          className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent)]
                     transition-colors duration-300"
        >
          write today&apos;s entry
        </button>
      </p>
    </div>
  );
}
