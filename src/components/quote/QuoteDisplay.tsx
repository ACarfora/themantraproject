'use client';

import { useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import type { Quote } from '@/types';

interface QuoteDisplayProps {
  quote: Quote;
}

export function QuoteDisplay({ quote }: QuoteDisplayProps) {
  const reducedMotion = useReducedMotion();
  const words = quote.text.split(/\s+/);
  const quoteRef = useRef<HTMLDivElement>(null);

  const totalWordsDuration = words.length * 0.08;
  const authorDelay = totalWordsDuration + 0.4;

  const saveAsImage = useCallback(async () => {
    const html2canvas = (await import('html2canvas')).default;

    // Create an off-screen container styled for export
    const container = document.createElement('div');
    const isDark = !document.documentElement.classList.contains('light');

    Object.assign(container.style, {
      position: 'fixed',
      left: '-9999px',
      top: '0',
      width: '1080px',
      height: '1080px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px',
      background: isDark
        ? 'linear-gradient(170deg, #0C0E0D 0%, #1A1C1B 40%, #0C0E0D 60%, #141513 100%)'
        : 'linear-gradient(170deg, #F7F5F0 0%, #EDEBE5 40%, #F7F5F0 60%, #F2F0EB 100%)',
      fontFamily: '"Georgia", serif',
      boxSizing: 'border-box',
    });

    const accentColor = isDark ? '#C9A96E' : '#B8943F';
    const textColor = isDark ? '#E8E4DC' : '#2A2A28';
    const secondaryColor = isDark ? '#9A9B93' : '#6B6B66';

    container.innerHTML = `
      <div style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;">
        <div style="width: 60px; height: 1px; background: ${accentColor}; margin-bottom: 48px;"></div>
        <p style="font-size: 42px; line-height: 1.5; color: ${textColor}; margin: 0; max-width: 900px; font-style: italic;">&ldquo;${quote.text}&rdquo;</p>
        <p style="margin-top: 40px; font-size: 22px; color: ${secondaryColor}; letter-spacing: 0.05em;">
          <span style="color: ${accentColor};">&mdash;</span> ${quote.author}
        </p>
      </div>
      <p style="margin: 0; font-size: 16px; color: ${secondaryColor}; letter-spacing: 0.1em; opacity: 0.6;">themantraproject.com</p>
    `;

    document.body.appendChild(container);

    const canvas = await html2canvas(container, {
      width: 1080,
      height: 1080,
      scale: 1,
      backgroundColor: null,
      useCORS: true,
    });

    document.body.removeChild(container);

    const link = document.createElement('a');
    link.download = `mantra-${quote.author.toLowerCase().replace(/\s+/g, '-')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, [quote]);

  return (
    <div ref={quoteRef} className="flex flex-col items-center justify-center text-center max-w-[680px] mx-auto px-6">
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

      {/* Save as image button */}
      <motion.button
        onClick={saveAsImage}
        className="mt-10 flex items-center gap-2 px-4 py-2 rounded-full
                   text-sm text-[var(--color-text-secondary)] tracking-wide
                   bg-[var(--color-surface)]/50 backdrop-blur-sm
                   border border-[var(--color-border)]/50
                   hover:text-[var(--color-accent)] hover:border-[var(--color-accent)]/30
                   transition-all duration-300"
        initial={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: authorDelay + 0.3 }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        Save as image
      </motion.button>
    </div>
  );
}
