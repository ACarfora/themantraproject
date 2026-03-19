'use client';

import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * Full-viewport animated background for the quote page.
 * Uses CSS keyframes for a slow-shifting radial gradient with a
 * subtle grain/noise texture overlay.
 */
export function QuoteBackground() {
  const reducedMotion = useReducedMotion();

  return (
    <>
      <style jsx global>{`
        @keyframes quote-bg-shift {
          0% {
            background-position: 0% 50%;
          }
          25% {
            background-position: 50% 0%;
          }
          50% {
            background-position: 100% 50%;
          }
          75% {
            background-position: 50% 100%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>

      {/* Gradient layer */}
      <div
        className="fixed inset-0 -z-20"
        style={{
          background: `
            radial-gradient(
              ellipse 120% 100% at 30% 20%,
              var(--color-bg) 0%,
              var(--color-surface) 35%,
              var(--color-bg) 60%,
              var(--color-surface-alt) 80%,
              var(--color-bg) 100%
            )
          `,
          backgroundSize: '200% 200%',
          animation: reducedMotion ? 'none' : 'quote-bg-shift 65s ease-in-out infinite',
        }}
      />

      {/* Subtle accent colour wash */}
      <div
        className="fixed inset-0 -z-19 opacity-[0.04] pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at 70% 30%, var(--color-accent) 0%, transparent 50%),
            radial-gradient(circle at 30% 80%, var(--color-accent-secondary) 0%, transparent 50%)
          `,
          backgroundSize: '200% 200%',
          animation: reducedMotion ? 'none' : 'quote-bg-shift 80s ease-in-out infinite reverse',
        }}
      />

      {/* Grain/noise texture overlay */}
      <div
        className="fixed inset-0 -z-10 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px',
        }}
      />
    </>
  );
}
