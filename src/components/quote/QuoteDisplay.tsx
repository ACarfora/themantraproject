'use client';

import { motion } from 'motion/react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import type { Quote } from '@/types';

interface QuoteDisplayProps {
  quote: Quote;
}

export function QuoteDisplay({ quote }: QuoteDisplayProps) {
  const reducedMotion = useReducedMotion();
  const words = quote.text.split(/\s+/);

  // Total time for all words to finish animating in
  const totalWordsDuration = words.length * 0.08;
  const authorDelay = totalWordsDuration + 0.4;

  return (
    <div className="flex flex-col items-center justify-center text-center max-w-[680px] mx-auto px-6">
      {/* Decorative golden line */}
      <motion.div
        className="w-12 h-px bg-[var(--color-accent)] mb-8"
        initial={reducedMotion ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      />

      {/* Quote text — word by word stagger */}
      <blockquote className="font-serif text-3xl md:text-4xl lg:text-5xl leading-relaxed text-[var(--color-text)]">
        {words.map((word, i) => (
          <motion.span
            key={`${word}-${i}`}
            className="inline-block mr-[0.3em] last:mr-0"
            initial={
              reducedMotion
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 6 }
            }
            animate={{ opacity: 1, y: 0 }}
            transition={
              reducedMotion
                ? { duration: 0 }
                : {
                    duration: 0.4,
                    delay: i * 0.08,
                    ease: [0.25, 0.1, 0.25, 1],
                  }
            }
          >
            {word}
          </motion.span>
        ))}
      </blockquote>

      {/* Author attribution */}
      <motion.p
        className="mt-8 text-base md:text-lg text-[var(--color-text-secondary)] tracking-wide"
        initial={
          reducedMotion
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: 4 }
        }
        animate={{ opacity: 1, y: 0 }}
        transition={
          reducedMotion
            ? { duration: 0 }
            : {
                duration: 0.5,
                delay: authorDelay,
                ease: 'easeOut',
              }
        }
      >
        <span className="text-[var(--color-accent)]">&mdash;</span>{' '}
        <em>{quote.author}</em>
      </motion.p>
    </div>
  );
}
