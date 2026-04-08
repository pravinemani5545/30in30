import { JetBrains_Mono, Space_Grotesk, IBM_Plex_Sans } from "next/font/google";
import { BackToHub } from "@/components/shared/BackToHub";
import { ContentRepurposingDashboard } from "@/components/day20/ContentRepurposingDashboard";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-day20-mono",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-day20-heading",
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-day20-body",
});

export const metadata = {
  title: "ContentRepurposingPipeline — Day 20",
  description:
    "One source. Seven formats. Zero rewrites. Transform long-form content into platform-optimised pieces.",
};

export default function Day20Page() {
  return (
    <div
      data-day="20"
      className={`min-h-screen ${jetbrainsMono.variable} ${spaceGrotesk.variable} ${ibmPlexSans.variable}`}
      style={{ background: "#0a0a0a" }}
    >
      <header
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: "1px solid #2a2a2a" }}
      >
        <BackToHub label="Back to 30 in 30" />
        <h1
          className="text-lg"
          style={{
            fontFamily: "var(--font-day20-heading)",
            fontWeight: 600,
            color: "#eeeeee",
          }}
        >
          Content<span style={{ color: "#00FF41" }}>Repurpose</span>
        </h1>
        <div className="w-[120px]" />
      </header>
      <ContentRepurposingDashboard />
    </div>
  );
}
