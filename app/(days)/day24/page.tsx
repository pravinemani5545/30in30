import { JetBrains_Mono, Space_Grotesk, IBM_Plex_Sans } from "next/font/google";
import { BackToHub } from "@/components/shared/BackToHub";
import { VideoIdeaEngineDashboard } from "@/components/day24/VideoIdeaEngineDashboard";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-day24-mono",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-day24-heading",
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-day24-body",
});

export const metadata = {
  title: "VideoIdeaEngine — Day 24",
  description: "AI-powered video idea generation from niche keywords",
};

export default function Day24Page() {
  return (
    <div
      data-day="24"
      className={`min-h-screen ${jetbrainsMono.variable} ${spaceGrotesk.variable} ${ibmPlexSans.variable}`}
      style={{ background: "#0a0a0a" }}
    >
      <header
        className="relative flex items-center justify-center px-4 py-3"
        style={{ borderBottom: "1px solid #2a2a2a" }}
      >
        <div className="absolute left-4">
          <BackToHub label="Back to 30 in 30" />
        </div>
        <h1
          className="text-lg"
          style={{
            fontFamily: "var(--font-day24-heading)",
            fontWeight: 600,
            color: "#eeeeee",
          }}
        >
          Video<span style={{ color: "#00FF41" }}>IdeaEngine</span>
        </h1>
      </header>
      <VideoIdeaEngineDashboard />
    </div>
  );
}
