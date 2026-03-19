// ─────────────────────────────────────────────────
// The Mantra Project — Core Type Definitions
// ─────────────────────────────────────────────────

export interface Quote {
  text: string;
  author: string;
  category?: 'wisdom' | 'nature' | 'mindfulness' | 'courage' | 'gratitude' | 'peace';
}

export interface MoodEntry {
  date: string; // ISO date
  value: 1 | 2 | 3 | 4 | 5;
}

export interface JournalEntry {
  id: string;
  date: string;
  entries: [string, string, string]; // 3 gratitude items
}

export interface Mantra {
  id: string;
  text: string;
  font: 'serif' | 'heading' | 'body';
  createdAt: string;
}

export interface BreathingPhase {
  phase: 'inhale' | 'hold-in' | 'exhale' | 'hold-out';
  duration: number; // seconds
}

export interface SoundscapeOption {
  id: string;
  name: string;
  icon: string;
  file: string;
}

export interface DailyChallenge {
  id: number;
  text: string;
  category: string;
}
