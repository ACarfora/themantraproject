// ─────────────────────────────────────────────────
// The Mantra Project — Site Configuration
// ─────────────────────────────────────────────────

export const siteConfig = {
  name: 'The Mantra Project',
  description: 'A mindful space for daily wisdom, breathing, and inner peace.',
  navItems: [
    { label: 'Home', href: '/', icon: 'home' },
    { label: 'Breathe', href: '/breathe', icon: 'wind' },
    { label: 'Mantra', href: '/mantra', icon: 'pen' },
  ],
} as const;
