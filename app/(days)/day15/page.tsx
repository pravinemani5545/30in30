import { BackToHub } from "@/components/shared/BackToHub";
import { EmailSequenceDashboard } from "@/components/day15/EmailSequenceDashboard";

export default function Day15Page() {
  return (
    <div
      data-day="15"
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
          EmailSequenceWriter
        </h1>
        <div className="w-[120px]" />
      </header>
      <EmailSequenceDashboard />
    </div>
  );
}
