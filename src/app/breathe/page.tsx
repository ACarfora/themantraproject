"use client";

import { motion } from "motion/react";
import { BreathingOrb } from "@/components/breathing/BreathingOrb";
import { BreathingControls } from "@/components/breathing/BreathingControls";
import { SoundscapePlayer } from "@/components/soundscape/SoundscapePlayer";
import { useBreathing } from "@/hooks/useBreathing";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export default function BreathePage() {
  const breathing = useBreathing();
  const reducedMotion = useReducedMotion();

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-6">
      <motion.h1
        className="mb-4 font-heading text-2xl font-medium tracking-wide text-[var(--color-text-secondary)] md:text-3xl"
        initial={reducedMotion ? undefined : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      >
        Breathe
      </motion.h1>
      <motion.p
        className="mb-12 max-w-md text-center text-sm text-[var(--color-text-secondary)] md:text-base"
        initial={reducedMotion ? undefined : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        4-7-8 technique. Inhale 4s, hold 7s, exhale 8s. Tap to begin.
      </motion.p>

      <BreathingOrb breathing={breathing} />

      {/* Fixed height so stats appearing don't shift the orb */}
      <div className="mt-10 h-10">
        <BreathingControls breathing={breathing} />
      </div>

      <div className="fixed bottom-24 right-6 z-20 md:bottom-6">
        <SoundscapePlayer />
      </div>
    </div>
  );
}
