import Link from "next/link";
import { DAYS, type DayConfig } from "@/lib/days-config";

function DayCard({ day }: { day: DayConfig }) {
  const isLive = day.status === "live";

  return isLive ? (
    <Link
      href={`/${day.slug}`}
      className="group block rounded-lg p-5 transition-colors"
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
      }}
      data-day={day.day}
    >
      <DayCardContent day={day} />
    </Link>
  ) : (
    <div
      className="rounded-lg p-5 opacity-50"
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
      }}
    >
      <DayCardContent day={day} />
    </div>
  );
}

function DayCardContent({ day }: { day: DayConfig }) {
  const isLive = day.status === "live";

  return (
    <>
      <div className="flex items-start justify-between mb-3">
        <span
          className="text-xs font-mono"
          style={{ color: "var(--text-tertiary)" }}
        >
          DAY {String(day.day).padStart(2, "0")}
        </span>
        <span
          className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full"
          style={{
            background: isLive ? "rgb(34 197 94 / 0.1)" : "rgb(107 114 128 / 0.1)",
            color: isLive ? "#22C55E" : "#6B7280",
          }}
        >
          {isLive ? "Live" : "Soon"}
        </span>
      </div>
      <h3
        className="text-lg mb-1"
        style={{ fontFamily: "var(--font-serif)", color: "var(--foreground)" }}
      >
        {day.name}
      </h3>
      <p
        className="text-sm mb-3"
        style={{ color: "var(--text-secondary)" }}
      >
        {day.tagline}
      </p>
      {day.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {day.tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] px-2 py-0.5 rounded"
              style={{
                background: "var(--surface-raised)",
                color: "var(--text-tertiary)",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </>
  );
}

export default function HomePage() {
  const liveDays = DAYS.filter((d) => d.status === "live");
  const comingSoon = DAYS.filter((d) => d.status === "coming-soon");

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      <header className="border-b" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-6xl mx-auto px-6 py-8">
          <h1
            className="text-4xl mb-2"
            style={{ fontFamily: "var(--font-serif)", color: "var(--foreground)" }}
          >
            30 in 30
          </h1>
          <p style={{ color: "var(--text-secondary)" }}>
            30 AI-powered apps built in 30 days. One stack, shipping daily.
          </p>
          <div className="flex gap-4 mt-4">
            <span className="text-sm" style={{ color: "var(--text-tertiary)" }}>
              <span style={{ color: "#22C55E" }}>{liveDays.length}</span> shipped
            </span>
            <span className="text-sm" style={{ color: "var(--text-tertiary)" }}>
              {comingSoon.length} remaining
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DAYS.map((day) => (
            <DayCard key={day.day} day={day} />
          ))}
        </div>
      </main>
    </div>
  );
}
