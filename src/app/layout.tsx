import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "What Would Paul Weller Do?",
  description:
    "A stylish creative tribute — ask a question, get fictional advice in the spirit of mod culture, sharp tailoring, and British music heritage.",
  openGraph: {
    title: "What Would Paul Weller Do?",
    description:
      "Ask a question, get fictional advice inspired by mod culture and British music heritage.",
    type: "website",
  },
};

// ── Floating tattoo-flash icons ──────────────────────────────────────────────
// Each references a different piece of Weller/mod/Jam cultural iconography.
// Old-school tattoo flash: bold outlines, solid fills, small and scattered.
const TattooIcons = () => (
  <div aria-hidden="true">

    {/* 1. Mod target — top left */}
    <div className="floater" style={{ top: "7%", left: "3%", animation: "floatA 28s ease-in-out infinite", "--r": "-8deg" } as React.CSSProperties}>
      <svg width="48" height="48" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r="23" fill="#6E2C2C" stroke="#1C1C1C" strokeWidth="1.5"/>
        <circle cx="24" cy="24" r="15" fill="#F4F1EA" stroke="#1C1C1C" strokeWidth="1.5"/>
        <circle cx="24" cy="24" r="8" fill="#0E1A2B" stroke="#1C1C1C" strokeWidth="1.5"/>
      </svg>
    </div>

    {/* 2. Vinyl record — top right */}
    <div className="floater" style={{ top: "10%", right: "4%", animation: "floatB 34s ease-in-out infinite 3s", "--r": "12deg" } as React.CSSProperties}>
      <svg width="44" height="44" viewBox="0 0 44 44">
        <circle cx="22" cy="22" r="21" fill="#1C1C1C" stroke="#1C1C1C" strokeWidth="1"/>
        <circle cx="22" cy="22" r="15" fill="#242424" stroke="#333" strokeWidth="0.5"/>
        <circle cx="22" cy="22" r="10" fill="#2E2E2E" stroke="#333" strokeWidth="0.5"/>
        <circle cx="22" cy="22" r="6" fill="#6E2C2C" stroke="#1C1C1C" strokeWidth="1"/>
        <circle cx="22" cy="22" r="2" fill="#1C1C1C"/>
      </svg>
    </div>

    {/* 3. Musical note — left mid */}
    <div className="floater" style={{ top: "33%", left: "2%", animation: "floatC 22s ease-in-out infinite 6s", "--r": "-15deg" } as React.CSSProperties}>
      <svg width="32" height="44" viewBox="0 0 32 44">
        <ellipse cx="10" cy="37" rx="9" ry="6" fill="#0E1A2B" stroke="#1C1C1C" strokeWidth="1.5" transform="rotate(-15 10 37)"/>
        <rect x="18" y="5" width="3.5" height="32" fill="#0E1A2B" stroke="#1C1C1C" strokeWidth="0.5"/>
        <path d="M21.5 5 Q32 1 32 13 Q32 20 21.5 19 Z" fill="#0E1A2B" stroke="#1C1C1C" strokeWidth="1"/>
      </svg>
    </div>

    {/* 4. Rose — right mid */}
    <div className="floater" style={{ top: "42%", right: "3%", animation: "floatA 26s ease-in-out infinite 8s", "--r": "10deg" } as React.CSSProperties}>
      <svg width="40" height="48" viewBox="0 0 40 48">
        {/* stem */}
        <line x1="20" y1="28" x2="20" y2="47" stroke="#2D5016" strokeWidth="2.5"/>
        {/* left leaf */}
        <path d="M20 38 Q8 32 10 42 Q14 42 20 38Z" fill="#3A6B1A" stroke="#1C1C1C" strokeWidth="1"/>
        {/* petals outer */}
        <circle cx="20" cy="18" r="17" fill="#A62020" stroke="#1C1C1C" strokeWidth="1.5"/>
        {/* petals mid */}
        <circle cx="20" cy="14" r="11" fill="#C53030" stroke="#1C1C1C" strokeWidth="1"/>
        {/* petals inner */}
        <circle cx="20" cy="11" r="6" fill="#E04545" stroke="#1C1C1C" strokeWidth="1"/>
        {/* petal center */}
        <circle cx="20" cy="9" r="3" fill="#C53030"/>
      </svg>
    </div>

    {/* 5. Lightning bolt — top right area */}
    <div className="floater" style={{ top: "22%", right: "2%", animation: "floatB 19s ease-in-out infinite 2s", "--r": "5deg" } as React.CSSProperties}>
      <svg width="28" height="46" viewBox="0 0 28 46">
        <polygon points="18,0 4,26 13,23 10,46 24,20 15,23" fill="#D4A017" stroke="#1C1C1C" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    </div>

    {/* 6. Union Jack — bottom left */}
    <div className="floater" style={{ top: "68%", left: "2%", animation: "floatC 31s ease-in-out infinite 11s", "--r": "-6deg" } as React.CSSProperties}>
      <svg width="46" height="30" viewBox="0 0 46 30">
        <rect width="46" height="30" fill="#0E1A2B" rx="2"/>
        {/* White diagonals */}
        <line x1="0" y1="0" x2="46" y2="30" stroke="white" strokeWidth="9"/>
        <line x1="46" y1="0" x2="0" y2="30" stroke="white" strokeWidth="9"/>
        {/* Red diagonals */}
        <line x1="0" y1="0" x2="46" y2="30" stroke="#6E2C2C" strokeWidth="5"/>
        <line x1="46" y1="0" x2="0" y2="30" stroke="#6E2C2C" strokeWidth="5"/>
        {/* White cross */}
        <rect x="19" y="0" width="8" height="30" fill="white"/>
        <rect x="0" y="11" width="46" height="8" fill="white"/>
        {/* Red cross */}
        <rect x="21" y="0" width="4" height="30" fill="#6E2C2C"/>
        <rect x="0" y="13" width="46" height="4" fill="#6E2C2C"/>
        <rect width="46" height="30" fill="none" stroke="#1C1C1C" strokeWidth="1.5" rx="2"/>
      </svg>
    </div>

    {/* 7. Anchor — bottom right */}
    <div className="floater" style={{ top: "74%", right: "3%", animation: "floatA 24s ease-in-out infinite 5s", "--r": "8deg" } as React.CSSProperties}>
      <svg width="38" height="48" viewBox="0 0 38 48">
        {/* ring at top */}
        <circle cx="19" cy="6" r="5" fill="none" stroke="#0E1A2B" strokeWidth="3"/>
        {/* vertical bar */}
        <line x1="19" y1="11" x2="19" y2="44" stroke="#0E1A2B" strokeWidth="3"/>
        {/* crossbar */}
        <line x1="6" y1="20" x2="32" y2="20" stroke="#0E1A2B" strokeWidth="3" strokeLinecap="round"/>
        {/* bottom curve */}
        <path d="M6 38 Q2 30 2 36 Q2 48 19 48 Q36 48 36 36 Q36 30 32 38" fill="none" stroke="#0E1A2B" strokeWidth="3" strokeLinecap="round"/>
        {/* anchor fill */}
        <circle cx="19" cy="6" r="5" fill="none" stroke="#6B705C" strokeWidth="1.5"/>
        <line x1="19" y1="11" x2="19" y2="44" stroke="#6B705C" strokeWidth="1.5"/>
        <line x1="6" y1="20" x2="32" y2="20" stroke="#6B705C" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M6 38 Q2 30 2 36 Q2 48 19 48 Q36 48 36 36 Q36 30 32 38" fill="none" stroke="#6B705C" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    </div>

    {/* 8. Star — left lower */}
    <div className="floater" style={{ top: "55%", left: "3%", animation: "floatB 20s ease-in-out infinite 14s", "--r": "18deg" } as React.CSSProperties}>
      <svg width="36" height="36" viewBox="0 0 36 36">
        <polygon points="18,2 22,13 34,13 24,21 28,33 18,25 8,33 12,21 2,13 14,13" fill="#6B705C" stroke="#1C1C1C" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    </div>

    {/* 9. Scissors — right upper-mid */}
    <div className="floater" style={{ top: "30%", right: "2.5%", animation: "floatC 27s ease-in-out infinite 9s", "--r": "-20deg" } as React.CSSProperties}>
      <svg width="36" height="44" viewBox="0 0 36 44">
        {/* handles */}
        <circle cx="9" cy="34" r="8" fill="none" stroke="#1C1C1C" strokeWidth="2.5"/>
        <circle cx="27" cy="34" r="8" fill="none" stroke="#1C1C1C" strokeWidth="2.5"/>
        <circle cx="9" cy="34" r="8" fill="none" stroke="#9A948A" strokeWidth="1.5"/>
        <circle cx="27" cy="34" r="8" fill="none" stroke="#9A948A" strokeWidth="1.5"/>
        {/* blades */}
        <line x1="9" y1="26" x2="18" y2="8" stroke="#1C1C1C" strokeWidth="3" strokeLinecap="round"/>
        <line x1="27" y1="26" x2="18" y2="8" stroke="#1C1C1C" strokeWidth="3" strokeLinecap="round"/>
        <line x1="9" y1="26" x2="18" y2="8" stroke="#9A948A" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="27" y1="26" x2="18" y2="8" stroke="#9A948A" strokeWidth="1.5" strokeLinecap="round"/>
        {/* pivot */}
        <circle cx="18" cy="17" r="2.5" fill="#1C1C1C"/>
      </svg>
    </div>

    {/* 10. Coffee cup — Style Council café culture, bottom left area */}
    <div className="floater" style={{ top: "84%", left: "5%", animation: "floatA 23s ease-in-out infinite 7s", "--r": "-5deg" } as React.CSSProperties}>
      <svg width="38" height="42" viewBox="0 0 38 42">
        {/* saucer */}
        <ellipse cx="19" cy="38" rx="18" ry="4" fill="#D6CFC4" stroke="#1C1C1C" strokeWidth="1.5"/>
        {/* cup body */}
        <path d="M6 14 L9 34 H29 L32 14 Z" fill="#D6CFC4" stroke="#1C1C1C" strokeWidth="1.5"/>
        {/* handle */}
        <path d="M32 18 Q42 18 42 25 Q42 32 32 30" fill="none" stroke="#1C1C1C" strokeWidth="2.5" strokeLinecap="round"/>
        {/* steam */}
        <path d="M14 10 Q12 6 14 2" fill="none" stroke="#9A948A" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M19 10 Q17 5 19 1" fill="none" stroke="#9A948A" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M24 10 Q22 6 24 2" fill="none" stroke="#9A948A" strokeWidth="1.5" strokeLinecap="round"/>
        {/* rim */}
        <ellipse cx="19" cy="14" rx="13" ry="3" fill="#C8BFB3" stroke="#1C1C1C" strokeWidth="1.5"/>
      </svg>
    </div>

  </div>
);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col">
        {/* Mod roundel — slowly rotating bullseye, barely visible */}
        <div className="mod-roundel" aria-hidden="true" />
        <div className="fluid-wave" aria-hidden="true" />
        <div className="fluid-wave-upper" aria-hidden="true" />
        {/* Floating tattoo icons */}
        <TattooIcons />
        <div className="relative z-10 flex flex-col min-h-screen">
          {children}
        </div>
        {/* Scanlines — op-art / vintage print texture, above all content */}
        <div className="scanlines" aria-hidden="true" />
      </body>
    </html>
  );
}
