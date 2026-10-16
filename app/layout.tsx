import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Instrument_Serif } from "next/font/google";
import { Nav } from "@/components/ui/Nav";
import { Footer } from "@/components/ui/Footer";
import { ScrollSetup } from "@/components/ui/ScrollSetup";
import "./globals.css";

// Used only inside the app mockups Juno builds (brand typography), not for site headings.
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-instrument", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://runjuno.ai"),
  title: "Juno: your AI chief of staff",
  description:
    "Juno learns how your company works, then handles the busywork across Slack, Gmail, Notion, Linear, and more. Nothing goes out without your yes.",
  openGraph: {
    title: "Juno runs the work. You run the company.",
    description: "An AI chief of staff that learns your company and does real work across your apps, always asking for a yes first.",
    url: "https://runjuno.ai",
    siteName: "Juno",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#07090D",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} ${serif.variable}`} suppressHydrationWarning>
      <head>
        <Script id="js-flag" strategy="beforeInteractive">{`document.documentElement.classList.add('js')`}</Script>
      </head>
      <body id="top">
        <ScrollSetup />
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
