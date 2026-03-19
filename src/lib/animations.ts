// ─────────────────────────────────────────────────
// The Mantra Project — Shared Motion Variants
// Zen-inspired timing: slow, smooth, meditative
// ─────────────────────────────────────────────────

import type { Variants } from 'motion/react';

/** Smooth ease-out curve used throughout the app. */
const zenEase = [0.25, 0.1, 0.25, 1] as const;

// ── Fade In ───────────────────────────────────────

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.8, ease: zenEase },
  },
};

// ── Fade Up ───────────────────────────────────────

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: zenEase },
  },
};

// ── Stagger Container ─────────────────────────────

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

// ── Stagger Child (for word-by-word reveal) ───────

export const staggerChild: Variants = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: zenEase },
  },
};

// ── Breathe Scale (breathing circle pulse) ────────

export const breatheScale: Variants = {
  idle: {
    scale: 1.0,
  },
  breathe: {
    scale: [1.0, 1.3, 1.0],
    transition: {
      duration: 4,
      ease: 'easeInOut',
      repeat: Infinity,
      repeatType: 'loop' as const,
    },
  },
};

// ── Page Transition (cross-fade) ──────────────────

export const pageTransition: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.8, ease: zenEase },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.5, ease: zenEase },
  },
};

// ── Gentle Float (idle element oscillation) ───────

export const gentleFloat: Variants = {
  idle: {
    y: [0, -4, 0],
    transition: {
      duration: 3,
      ease: 'easeInOut',
      repeat: Infinity,
      repeatType: 'loop' as const,
    },
  },
};
