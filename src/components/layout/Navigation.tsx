'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { siteConfig } from '@/config/site';

// ─────────────────────────────────────────────────
// Inline SVG icons keyed to siteConfig icon names
// ─────────────────────────────────────────────────

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function WindIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M9.59 4.59A2 2 0 1 1 11 8H2" />
      <path d="M12.59 19.41A2 2 0 1 0 14 16H2" />
      <path d="M17.73 7.73A2.5 2.5 0 1 1 19.5 12H2" />
    </svg>
  );
}

function PenIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 19l7-7 3 3-7 7-3-3z" />
      <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
      <path d="M2 2l7.586 7.586" />
      <circle cx="11" cy="11" r="2" />
    </svg>
  );
}

function BookIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  home: HomeIcon,
  wind: WindIcon,
  pen: PenIcon,
  book: BookIcon,
};

// ─────────────────────────────────────────────────
// Navigation Component
// ─────────────────────────────────────────────────

export function Navigation() {
  const pathname = usePathname();

  return (
    <>
      {/* ── Desktop: top nav links (shown md+) ── */}
      <nav
        className="hidden md:flex fixed top-4 left-1/2 -translate-x-1/2 z-50
                   items-center gap-1 px-2 py-1 rounded-full
                   bg-[var(--color-surface)]/60 backdrop-blur-lg
                   border border-[var(--color-border)]"
        aria-label="Main navigation"
      >
        {siteConfig.navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = iconMap[item.icon] ?? HomeIcon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm
                         transition-colors duration-300
                         ${
                           isActive
                             ? 'text-[var(--color-accent)] bg-[var(--color-accent)]/10'
                             : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
                         }`}
            >
              <Icon className="shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* ── Mobile: bottom bar (shown below md) ── */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50
                   flex items-center justify-around
                   px-6 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]
                   bg-[var(--color-surface)]/70 backdrop-blur-xl
                   border-t border-[var(--color-border)]"
        aria-label="Main navigation"
      >
        {siteConfig.navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = iconMap[item.icon] ?? HomeIcon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 text-xs
                         transition-colors duration-300
                         ${
                           isActive
                             ? 'text-[var(--color-accent)]'
                             : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
                         }`}
            >
              <Icon className="shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
