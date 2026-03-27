import { BackToHub } from "@/components/shared/BackToHub";
import { ReviewDashboard } from "@/components/day10/ReviewDashboard";

export default function Day10Page() {
  return (
    <div data-day="10" className="min-h-screen" style={{ background: "var(--background)" }}>
      <header
        className="flex items-center px-4 py-3 border-b"
        style={{ borderColor: "var(--border)" }}
      >
        <BackToHub label="Back to 30 in 30" />
      </header>
      <ReviewDashboard />
    </div>
  );
}
