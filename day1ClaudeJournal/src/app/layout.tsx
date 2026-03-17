import type { Metadata, Viewport } from "next";
import { DM_Serif_Display, Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const dmSerifDisplay = DM_Serif_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "ClaudeJournal — Voice-to-Structured Journal",
  description:
    "Speak your thoughts. Claude organizes them into mood, events, and reflections.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${dmSerifDisplay.variable} ${plusJakartaSans.variable} font-sans antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  );
}
