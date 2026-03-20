import type { Metadata } from "next";
import { Cormorant_Garamond, Lora, Inter } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Navigation } from "@/components/layout/Navigation";
import { QuoteBackground } from "@/components/quote/QuoteBackground";
import "./globals.css";

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Mantra Project",
  description:
    "A mindful space for daily wisdom, breathing, and inner peace.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorantGaramond.variable} ${lora.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <body className="font-body antialiased">
        <QuoteBackground />
        <Header />
        <main className="min-h-screen">{children}</main>
        <Navigation />
      </body>
    </html>
  );
}
