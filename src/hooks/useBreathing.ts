'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import type { BreathingPhase } from '@/types';

const PHASES: BreathingPhase[] = [
  { phase: 'inhale', duration: 4 },
  { phase: 'hold-in', duration: 7 },
  { phase: 'exhale', duration: 8 },
];

interface BreathingState {
  phase: BreathingPhase['phase'];
  isActive: boolean;
  progress: number;
  start: () => void;
  stop: () => void;
  toggle: () => void;
}

export function useBreathing(): BreathingState {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [progress, setProgress] = useState(0);

  const startTimeRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);
  const phaseIndexRef = useRef(0);

  const currentPhase = PHASES[phaseIndex];

  const tick = useCallback((timestamp: number) => {
    const elapsed = (timestamp - startTimeRef.current) / 1000;
    const phaseDuration = PHASES[phaseIndexRef.current].duration;

    if (elapsed >= phaseDuration) {
      // Move to next phase
      const nextIndex = (phaseIndexRef.current + 1) % PHASES.length;
      phaseIndexRef.current = nextIndex;
      setPhaseIndex(nextIndex);
      setProgress(0);
      startTimeRef.current = timestamp;
    } else {
      setProgress(elapsed / phaseDuration);
    }

    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const start = useCallback(() => {
    setIsActive(true);
    setPhaseIndex(0);
    setProgress(0);
    phaseIndexRef.current = 0;
    startTimeRef.current = performance.now();
    rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  const stop = useCallback(() => {
    setIsActive(false);
    setPhaseIndex(0);
    setProgress(0);
    phaseIndexRef.current = 0;
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const toggle = useCallback(() => {
    if (isActive) {
      stop();
    } else {
      start();
    }
  }, [isActive, start, stop]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return {
    phase: currentPhase.phase,
    isActive,
    progress,
    start,
    stop,
    toggle,
  };
}
