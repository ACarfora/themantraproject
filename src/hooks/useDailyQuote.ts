'use client';

import { useMemo } from 'react';
import { quotes } from '@/lib/quotes';
import { getDailyIndex } from '@/lib/date-seed';
import type { Quote } from '@/types';

export function useDailyQuote(): Quote {
  return useMemo(() => {
    const index = getDailyIndex(quotes.length);
    return quotes[index];
  }, []);
}
