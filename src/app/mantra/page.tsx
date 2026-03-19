"use client";

import { motion } from "motion/react";
import { MantraEditor } from "@/components/mantra/MantraEditor";
import { MantraPreview } from "@/components/mantra/MantraPreview";
import { UserNameInput } from "@/components/mantra/UserNameInput";
import { usePreferencesStore } from "@/stores/usePreferencesStore";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export default function MantraPage() {
  const reducedMotion = useReducedMotion();
  const userName = usePreferencesStore((s) => s.userName);

  return (
    <div className="relative flex min-h-screen flex-col items-center px-6 pb-28 pt-24 md:pb-12">
      {/* Step 1: Name entry */}
      {!userName && (
        <>
          <motion.h1
            className="mb-8 font-heading text-2xl font-medium tracking-wide text-[var(--color-text)] md:text-3xl"
            initial={reducedMotion ? undefined : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          >
            What is your name?
          </motion.h1>
          <motion.div
            className="w-full max-w-xs"
            initial={reducedMotion ? undefined : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <UserNameInput />
          </motion.div>
        </>
      )}

      {/* Step 2 & 3: Greeting + Editor + Preview */}
      {userName && (
        <>
          <motion.h1
            className="mb-2 font-heading text-2xl font-medium tracking-wide text-[var(--color-text)] md:text-3xl"
            initial={reducedMotion ? undefined : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          >
            Hello{" "}
            <span className="text-[var(--color-accent)]">{userName}</span>,
          </motion.h1>

          <motion.div
            className="mb-2 flex items-center gap-2"
            initial={reducedMotion ? undefined : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.15 }}
          >
            <UserNameInput compact />
          </motion.div>

          <motion.p
            className="mb-12 max-w-md text-center text-sm text-[var(--color-text-secondary)] md:text-base"
            initial={reducedMotion ? undefined : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Write words that ground you. Save them. Return to them.
          </motion.p>

          <motion.div
            className="w-full max-w-2xl space-y-12"
            initial={reducedMotion ? undefined : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <MantraEditor />
            <MantraPreview />
          </motion.div>
        </>
      )}
    </div>
  );
}
