import { BackToHub } from "@/components/shared/BackToHub";
import { ThumbnailDashboard } from "@/components/day12/ThumbnailDashboard";

export default function Day12Page() {
  return (
    <div
      data-day="12"
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
          style={{ fontFamily: "var(--font-serif)", color: "var(--foreground)" }}
        >
          ThumbnailForge
        </h1>
        <div className="w-[120px]" />
      </header>
      <ThumbnailDashboard />
    </div>
  );
}
