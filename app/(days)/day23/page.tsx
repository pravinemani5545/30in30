import { JetBrains_Mono, Space_Grotesk, IBM_Plex_Sans } from "next/font/google";
import { BackToHub } from "@/components/shared/BackToHub";
import { CampaignDashboardMain } from "@/components/day23/CampaignDashboardMain";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-day23-mono",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-day23-heading",
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-day23-body",
});

export const metadata = {
  title: "CampaignDashboard — Day 23",
  description: "Campaign analytics with funnel charts and A/B tests",
};

export default function Day23Page() {
  return (
    <div
      data-day="23"
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
            fontFamily: "var(--font-day23-heading)",
            fontWeight: 600,
            color: "#eeeeee",
          }}
        >
          Campaign<span style={{ color: "#00FF41" }}>Dashboard</span>
        </h1>
      </header>
      <CampaignDashboardMain />
    </div>
  );
}
