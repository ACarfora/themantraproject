'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import type { useBreathing } from '@/hooks/useBreathing';

/** Phase durations in seconds — mirrors useBreathing 4-7-8 technique */
const PHASE_DURATIONS: Record<string, number> = {
  'inhale': 4,
  'hold-in': 7,
  'exhale': 8,
};

interface BreathingControlsProps {
  breathing: ReturnType<typeof useBreathing>;
}

export function BreathingControls({ breathing }: BreathingControlsProps) {
  const { phase, isActive, progress } = breathing;
  const reducedMotion = useReducedMotion();

  // Track completed breathing cycles
  const [cycles, setCycles] = useState(0);
  const prevPhaseRef = useRef(phase);

  useEffect(() => {
    // A full cycle completes when we transition from exhale back to inhale
    if (prevPhaseRef.current === 'exhale' && phase === 'inhale' && isActive) {
      setCycles((c) => c + 1);
    }
    prevPhaseRef.current = phase;
  }, [phase, isActive]);

  // Reset cycles when stopped
  useEffect(() => {
    if (!isActive) {
      setCycles(0);
    }
  }, [isActive]);

  // Seconds remaining in current phase
  const phaseDuration = PHASE_DURATIONS[phase] ?? 4;
  const secondsRemaining = Math.max(0, Math.ceil(phaseDuration * (1 - progress)));

  if (!isActive) return null;

  return (
    <motion.div
      className="flex items-center gap-6 text-sm text-[var(--color-text-secondary)]"
      initial={reducedMotion ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Timer */}
      <div className="flex items-center gap-2">
        <span className="tabular-nums text-[var(--color-text)] text-lg font-light">
          {secondsRemaining}
        </span>
        <span className="text-xs tracking-wide uppercase">sec</span>
      </div>

      {/* Separator */}
      <div className="w-px h-4 bg-[var(--color-border)]" />

      {/* Cycle count */}
      <div className="flex items-center gap-2">
        <span className="tabular-nums text-[var(--color-text)] text-lg font-light">
          {cycles}
        </span>
        <span className="text-xs tracking-wide uppercase">
          {cycles === 1 ? 'cycle' : 'cycles'}
        </span>
      </div>
    </motion.div>
  );
}
