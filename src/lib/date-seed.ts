// ─────────────────────────────────────────────────
// The Mantra Project — Deterministic Daily Rotation
// ─────────────────────────────────────────────────

/**
 * Generate a deterministic numeric hash from a date.
 * The same calendar day always produces the same seed,
 * so every user sees the same quote on a given day.
 */
export function getDateSeed(date: Date = new Date()): number {
  const dateStr = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    const char = dateStr.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Return an index into a collection of `total` items
 * that is stable for the entire calendar day.
 */
export function getDailyIndex(total: number, date?: Date): number {
  return getDateSeed(date) % total;
}
