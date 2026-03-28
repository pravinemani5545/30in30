import { BackToHub } from "@/components/shared/BackToHub";
import { GradingDashboard } from "@/components/day11/GradingDashboard";

export default function Day11Page() {
  return (
    <div data-day="11" className="min-h-screen" style={{ background: "var(--background)" }}>
      <header
        className="flex items-center px-4 py-3 border-b"
        style={{ borderColor: "var(--border)" }}
      >
        <BackToHub label="Back to 30 in 30" />
      </header>
      <GradingDashboard />
    </div>
  );
}
