import { JetBrains_Mono, Space_Grotesk, IBM_Plex_Sans } from "next/font/google";
import { BackToHub } from "@/components/shared/BackToHub";
import { OnboardingWizardDashboard } from "@/components/day27/OnboardingWizardDashboard";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-day27-mono",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-day27-heading",
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-day27-body",
});

export const metadata = {
  title: "OnboardingWizard — Day 27",
  description: "4-step onboarding wizard with Zod validation",
};

export default function Day27Page() {
  return (
    <div
      data-day="27"
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
            fontFamily: "var(--font-day27-heading)",
            fontWeight: 600,
            color: "#eeeeee",
          }}
        >
          Onboarding<span style={{ color: "#00FF41" }}>Wizard</span>
        </h1>
      </header>
      <OnboardingWizardDashboard />
    </div>
  );
}
