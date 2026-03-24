/** Today's date as "YYYY-MM-DD". */
export function todayDate(): string {
  return new Date().toLocaleDateString('en-CA');
}

export function ordinalSuffix(day: number): string {
  if (day >= 11 && day <= 13) return 'th';
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}

/** Format "YYYY-MM-DD" → "Wednesday 23rd March 2026". */
export function formatJournalDate(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00');
  const weekday = new Intl.DateTimeFormat('en-GB', { weekday: 'long' }).format(date);
  const month = new Intl.DateTimeFormat('en-GB', { month: 'long' }).format(date);
  const day = date.getDate();
  const year = date.getFullYear();
  return `${weekday} ${day}${ordinalSuffix(day)} ${month} ${year}`;
}
