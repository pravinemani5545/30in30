import { BackToHub } from "@/components/shared/BackToHub";
import { DeliverabilityDashboard } from "@/components/day17/DeliverabilityDashboard";

export default function Day17Page() {
  return (
    <div
      data-day="17"
      className="min-h-screen"
      style={{ background: "var(--background)" }}
    >
      <header
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{ borderColor: "var(--border)" }}
      >
        <BackToHub label="Back to 30 in 30" />
        <h1
          className="text-lg"
          style={{
            fontFamily: "var(--font-serif)",
            color: "var(--foreground)",
          }}
        >
          DeliverabilityTester
        </h1>
        <div className="w-[120px]" />
      </header>
      <DeliverabilityDashboard />
    </div>
  );
}
