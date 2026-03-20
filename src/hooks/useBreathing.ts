'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import type { BreathingPhase } from '@/types';

const PHASES: BreathingPhase[] = [
  { phase: 'inhale', duration: 4 },
  { phase: 'hold-in', duration: 7 },
  { phase: 'exhale', duration: 8 },
];

const COUNTDOWN_DURATION = 3;

interface BreathingState {
  phase: BreathingPhase['phase'];
  isActive: boolean;
  progress: number;
  countdown: number | null;
  start: () => void;
  stop: () => void;
  toggle: () => void;
}

export function useBreathing(): BreathingState {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [countdown, setCountdown] = useState<number | null>(null);

  const startTimeRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);
  const phaseIndexRef = useRef(0);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentPhase = PHASES[phaseIndex];

  const tick = useCallback((timestamp: number) => {
    const elapsed = (timestamp - startTimeRef.current) / 1000;
    const phaseDuration = PHASES[phaseIndexRef.current].duration;

    if (elapsed >= phaseDuration) {
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

  const startBreathing = useCallback(() => {
    setIsActive(true);
    setCountdown(null);
    setPhaseIndex(0);
    setProgress(0);
    phaseIndexRef.current = 0;
    startTimeRef.current = performance.now();
    rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  const start = useCallback(() => {
    // Begin countdown
    setCountdown(COUNTDOWN_DURATION);
    let remaining = COUNTDOWN_DURATION;

    countdownRef.current = setInterval(() => {
      remaining -= 1;
      if (remaining <= 0) {
        if (countdownRef.current) clearInterval(countdownRef.current);
        countdownRef.current = null;
        startBreathing();
      } else {
        setCountdown(remaining);
      }
    }, 1000);
  }, [startBreathing]);

  const stop = useCallback(() => {
    setIsActive(false);
    setCountdown(null);
    setPhaseIndex(0);
    setProgress(0);
    phaseIndexRef.current = 0;
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
  }, []);

  const toggle = useCallback(() => {
    if (isActive || countdown !== null) {
      stop();
    } else {
      start();
    }
  }, [isActive, countdown, start, stop]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, []);

  return {
    phase: currentPhase.phase,
    isActive,
    progress,
    countdown,
    start,
    stop,
    toggle,
  };
}
