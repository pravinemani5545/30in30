"use client";

import type { Platform, Frequency, PlatformFrequency as PlatformFrequencyType } from "@/types/day19";
import { PLATFORM_LABELS, FREQUENCY_LABELS } from "@/types/day19";
import { PLATFORMS, FREQUENCIES } from "@/lib/day19/calendar/arc";

interface Props {
  platforms: PlatformFrequencyType[];
  onChange: (platforms: PlatformFrequencyType[]) => void;
  error?: string;
}

export function PlatformFrequency({ platforms, onChange, error }: Props) {
  function togglePlatform(platform: Platform) {
    const exists = platforms.find((p) => p.platform === platform);
    if (exists) {
      onChange(platforms.filter((p) => p.platform !== platform));
    } else {
      onChange([...platforms, { platform, frequency: "weekly" as Frequency }]);
    }
  }

  function setFrequency(platform: Platform, frequency: Frequency) {
    onChange(
      platforms.map((p) =>
        p.platform === platform ? { ...p, frequency } : p,
      ),
    );
  }

  return (
    <div>
      <label
        className="block text-xs font-bold uppercase tracking-wider mb-2"
        style={{ color: "var(--text-secondary)", fontFamily: "var(--font-sans)" }}
      >
        Platforms & Frequency
      </label>
      <div className="space-y-2">
        {PLATFORMS.map((platform) => {
          const active = platforms.find((p) => p.platform === platform);
          return (
            <div
              key={platform}
              className="flex items-center gap-3 p-3 rounded-lg border transition-colors"
              style={{
                borderColor: active ? "var(--accent)" : "var(--border)",
                backgroundColor: active ? "var(--accent-subtle)" : "var(--surface)",
              }}
            >
              <button
                type="button"
                onClick={() => togglePlatform(platform)}
                className="flex items-center gap-2 flex-1 text-left cursor-pointer"
              >
                <div
                  className="w-4 h-4 rounded border flex items-center justify-center"
                  style={{
                    borderColor: active ? "var(--accent)" : "var(--border)",
                    backgroundColor: active ? "var(--accent)" : "transparent",
                  }}
                >
                  {active && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path
                        d="M1 4L3.5 6.5L9 1"
                        stroke="var(--background)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
                <span
                  className="text-sm font-medium"
                  style={{ color: "var(--foreground)" }}
                >
                  {PLATFORM_LABELS[platform]}
                </span>
              </button>
              {active && (
                <select
                  value={active.frequency}
                  onChange={(e) =>
                    setFrequency(platform, e.target.value as Frequency)
                  }
                  className="text-xs rounded px-2 py-1 border outline-none cursor-pointer"
                  style={{
                    backgroundColor: "var(--surface)",
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                  }}
                >
                  {FREQUENCIES.map((f) => (
                    <option key={f} value={f}>
                      {FREQUENCY_LABELS[f]}
                    </option>
                  ))}
                </select>
              )}
            </div>
          );
        })}
      </div>
      {error && (
        <p className="mt-1 text-xs" style={{ color: "var(--error)" }}>
          {error}
        </p>
      )}
    </div>
  );
}
