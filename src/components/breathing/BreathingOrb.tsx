'use client';

import { motion, AnimatePresence } from 'motion/react';
import { useBreathing } from '@/hooks/useBreathing';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const PHASE_LABELS: Record<string, string> = {
  'inhale': 'Inhale',
  'hold-in': 'Hold',
  'exhale': 'Exhale',
};

const PHASE_DURATIONS: Record<string, number> = {
  'inhale': 4,
  'hold-in': 7,
  'exhale': 8,
};
const TOTAL_CYCLE = 4 + 7 + 8;

const PHASE_OFFSETS: Record<string, number> = {
  'inhale': 0,
  'hold-in': 4,
  'exhale': 11,
};

function getOrbScale(phase: string, progress: number): number {
  switch (phase) {
    case 'inhale':
      return 1.0 + 0.3 * progress;
    case 'hold-in':
      return 1.3;
    case 'exhale':
      return 1.3 - 0.3 * progress;
    default:
      return 1.0;
  }
}

function getGlowIntensity(phase: string, progress: number): number {
  switch (phase) {
    case 'inhale':
      return 0.15 + 0.35 * progress;
    case 'hold-in':
      return 0.5;
    case 'exhale':
      return 0.5 - 0.35 * progress;
    default:
      return 0.15;
  }
}

interface BreathingOrbProps {
  breathing: ReturnType<typeof useBreathing>;
}

export function BreathingOrb({ breathing }: BreathingOrbProps) {
  const { phase, isActive, progress, countdown, toggle } = breathing;
  const reducedMotion = useReducedMotion();

  const scale = reducedMotion ? 1 : getOrbScale(phase, progress);
  const glow = getGlowIntensity(phase, progress);

  const isCountingDown = countdown !== null;
  const label = isCountingDown
    ? String(countdown)
    : isActive
      ? PHASE_LABELS[phase]
      : 'Tap to begin';

  const phaseProgress = isActive ? progress : 0;

  const ringSize = 320;
  const ringRadius = 148;
  const circumference = 2 * Math.PI * ringRadius;
  const dashOffset = circumference * (1 - phaseProgress);

  return (
    <div className="relative flex items-center justify-center w-[240px] h-[240px] md:w-[320px] md:h-[320px]">
      {/* Timer ring */}
      <svg
        className="absolute inset-0 pointer-events-none"
        width="100%"
        height="100%"
        viewBox={`0 0 ${ringSize} ${ringSize}`}
      >
        <circle
          cx={ringSize / 2}
          cy={ringSize / 2}
          r={ringRadius}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth="2"
          opacity={isActive ? 0.5 : 0.2}
        />
        {isActive && (
          <circle
            cx={ringSize / 2}
            cy={ringSize / 2}
            r={ringRadius}
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            opacity={0.9}
            transform={`rotate(-90 ${ringSize / 2} ${ringSize / 2})`}
          />
        )}
      </svg>

      {/* Orb */}
      <motion.button
        type="button"
        onClick={toggle}
        className="absolute inset-0 m-auto w-[200px] h-[200px] md:w-[280px] md:h-[280px] rounded-full
          cursor-pointer select-none focus:outline-none focus-visible:ring-2
          focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2
          focus-visible:ring-offset-[var(--color-bg)]"
        style={{
          background: 'linear-gradient(135deg, #7D9B82 0%, #C9A96E 100%)',
          transform: `scale(${scale})`,
          boxShadow: `
            0 0 ${40 * glow}px ${20 * glow}px rgba(201, 169, 110, ${glow * 0.4}),
            0 0 ${80 * glow}px ${40 * glow}px rgba(125, 155, 130, ${glow * 0.2})
          `,
          transition: reducedMotion ? 'none' : 'transform 0.15s ease-out, box-shadow 0.15s ease-out',
        }}
        whileTap={{ scale: scale * 0.97 }}
        aria-label={isActive ? `Breathing exercise: ${PHASE_LABELS[phase]}` : isCountingDown ? `Starting in ${countdown}` : 'Start breathing exercise'}
      >
        {/* Inner glow overlay */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle at 40% 35%, rgba(255,255,255,${0.08 + glow * 0.12}) 0%, transparent 60%)`,
          }}
        />

        {/* Phase label / Countdown */}
        <AnimatePresence mode="wait">
          <motion.span
            key={label}
            className={`relative z-10 flex items-center justify-center w-full h-full
              font-medium tracking-widest uppercase
              text-white/90 select-none
              ${isCountingDown ? 'text-4xl md:text-5xl' : 'text-lg md:text-xl'}`}
            initial={reducedMotion ? false : { opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reducedMotion ? undefined : { opacity: 0, scale: 1.2 }}
            transition={{ duration: 0.3 }}
          >
            {label}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
