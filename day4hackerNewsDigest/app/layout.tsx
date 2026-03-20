import type { Metadata } from "next";
import { Instrument_Serif, DM_Sans } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "HN Digest — AI-Curated Hacker News for Builders",
  description:
    "The 10 Hacker News stories that matter for AI builders. Every morning.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${dmSans.variable} dark`}
    >
      <body className="min-h-dvh bg-background text-foreground antialiased">
        {children}
        <Toaster
          theme="dark"
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#111111",
              border: "1px solid #262626",
              color: "#F5F0E8",
            },
          }}
        />
      </body>
    </html>
  );
}
