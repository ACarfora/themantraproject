// ─────────────────────────────────────────────────
// The Mantra Project — Colour Tokens
// JS-accessible mirror of the CSS custom properties
// ─────────────────────────────────────────────────

export const colors = {
  dark: {
    bg: '#0C0E0D',              // Deep Earth
    surface: '#1A1C1B',         // Warm Stone
    surfaceAlt: '#222725',      // Moss Shadow
    text: '#E8E4DC',            // Moonlight
    textSecondary: '#9A9B93',   // Sage Grey
    accent: '#C9A96E',          // Candle Gold
    accentSecondary: '#7D9B82', // Muted Sage
    accentTertiary: '#A89AB5',  // Soft Lavender
    border: '#2E3230',          // Bark
  },
  light: {
    bg: '#F7F5F0',              // Rice Paper
    surface: '#EDEBE5',         // Warm Linen
    surfaceAlt: '#E3E1DB',
    text: '#2A2A28',            // Charcoal Earth
    textSecondary: '#6B6B66',
    accent: '#B8943F',          // Deepened Candle Gold
    accentSecondary: '#5C7E5E', // Forest Sage
    accentTertiary: '#8B7A9E',
    border: '#D4D2CC',
  },
} as const;
