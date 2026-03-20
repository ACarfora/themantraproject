"use client";

import { QuoteDisplay } from "@/components/quote/QuoteDisplay";
import { useDailyQuote } from "@/hooks/useDailyQuote";

export default function Home() {
  const quote = useDailyQuote();

  return (
    <div className="relative z-10 flex h-dvh flex-col items-center justify-center px-6 overflow-hidden">
      <QuoteDisplay quote={quote} />
    </div>
  );
}
