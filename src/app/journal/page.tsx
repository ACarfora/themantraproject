'use client';

import { useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { JournalEditor } from '@/components/journal/JournalEditor';
import { JournalCalendar } from '@/components/journal/JournalCalendar';
import { useJournalStore } from '@/stores/useJournalStore';
import { useReducedMotion } from '@/hooks/useReducedMotion';

function todayDate(): string {
  return new Date().toLocaleDateString('en-CA');
}

export default function JournalPage() {
  const reducedMotion = useReducedMotion();
  const entries = useJournalStore((s) => s.entries);
  const hasTodayEntry = entries.some((e) => e.date === todayDate());
  const [view, setView] = useState<'write' | 'browse'>(hasTodayEntry ? 'browse' : 'write');
  const [selectedDate, setSelectedDate] = useState(todayDate());
  const [viewMonth, setViewMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const handlePrevMonth = useCallback(() => {
    setViewMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1));
  }, []);

  const handleNextMonth = useCallback(() => {
    const now = new Date();
    setViewMonth((m) => {
      const next = new Date(m.getFullYear(), m.getMonth() + 1, 1);
      // Don't navigate past current month
      if (next > new Date(now.getFullYear(), now.getMonth(), 1)) return m;
      return next;
    });
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col items-center px-6 pb-28 pt-24 md:pb-12">
      <motion.div
        className="w-full max-w-2xl"
        initial={reducedMotion ? undefined : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {view === 'write' ? (
          <JournalEditor onBrowse={() => setView('browse')} onSaved={() => setView('browse')} />
        ) : (
          <JournalCalendar
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            viewMonth={viewMonth}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            onWrite={() => setView('write')}
          />
        )}
      </motion.div>
    </div>
  );
}
