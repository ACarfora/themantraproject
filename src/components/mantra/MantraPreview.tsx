'use client';

import { motion } from 'motion/react';
import { useMantraStore } from '@/stores/useMantraStore';

export function MantraPreview() {
  const mantras = useMantraStore((s) => s.mantras);
  const removeMantra = useMantraStore((s) => s.removeMantra);

  if (mantras.length === 0) {
    return (
      <p className="text-center text-sm text-[var(--color-text-secondary)] mt-8">
        No mantras yet. Create one above.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-lg mx-auto mt-8">
      {mantras.map((mantra) => (
        <motion.div
          key={mantra.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative group"
        >
          {/* Decorative frame */}
          <div
            className="relative px-8 py-10 rounded-xl
                       border border-[var(--color-border)]
                       bg-[var(--color-surface)]/30"
          >
            {/* Top-left corner accent */}
            <span
              className="absolute top-3 left-3 w-6 h-6
                         border-t border-l border-[var(--color-accent)]/40 rounded-tl-sm"
              aria-hidden="true"
            />
            {/* Bottom-right corner accent */}
            <span
              className="absolute bottom-3 right-3 w-6 h-6
                         border-b border-r border-[var(--color-accent)]/40 rounded-br-sm"
              aria-hidden="true"
            />

            {/* Mantra text */}
            <p
              className="text-center text-lg leading-relaxed
                         text-[var(--color-text)] font-heading"
            >
              {mantra.text}
            </p>
          </div>

          {/* Delete button */}
          <button
            onClick={() => removeMantra(mantra.id)}
            aria-label="Delete mantra"
            className="absolute -top-2 -right-2 w-7 h-7
                       flex items-center justify-center rounded-full
                       bg-[var(--color-surface)] border border-[var(--color-border)]
                       text-[var(--color-text-secondary)]
                       opacity-0 group-hover:opacity-100
                       transition-opacity duration-300
                       hover:text-red-400 hover:border-red-400/50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </motion.div>
      ))}
    </div>
  );
}
