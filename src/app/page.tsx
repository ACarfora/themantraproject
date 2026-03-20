"use client";

import { QuoteDisplay } from "@/components/quote/QuoteDisplay";
import { useDailyQuote } from "@/hooks/useDailyQuote";

export default function Home() {
  const quote = useDailyQuote();

  return (
    <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6">
      <QuoteDisplay quote={quote} />
    </div>
  );
}
