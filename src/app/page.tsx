"use client";

import { QuoteDisplay } from "@/components/quote/QuoteDisplay";
import { QuoteBackground } from "@/components/quote/QuoteBackground";
import { SoundscapePlayer } from "@/components/soundscape/SoundscapePlayer";
import { useDailyQuote } from "@/hooks/useDailyQuote";

export default function Home() {
  const quote = useDailyQuote();

  return (
    <>
      <QuoteBackground />
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6">
        <QuoteDisplay quote={quote} />
        <div className="fixed bottom-24 right-6 z-20 md:bottom-6">
          <SoundscapePlayer />
        </div>
      </div>
    </>
  );
}
