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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col paper-texture">
        {children}
      </body>
    </html>
  );
}
