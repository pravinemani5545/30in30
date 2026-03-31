"use client";

import type { ChannelEntry } from "@/types/day13";
import { ICPSection } from "./ICPSection";

interface Props {
  data: ChannelEntry[];
}

export function OutreachChannels({ data }: Props) {
  return (
    <ICPSection
      title="Recommended Outreach Channels"
      borderColor="var(--section-channels)"
    >
      <div className="space-y-4">
        {data.map((entry, i) => (
          <div
            key={i}
            className="space-y-1 pb-4 last:pb-0 border-b last:border-b-0"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="flex items-center gap-2">
              <p
                className="text-sm font-medium"
                style={{ color: "var(--foreground)" }}
              >
                {entry.channel}
              </p>
              {entry.isInferred && (
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded"
                  style={{
                    backgroundColor: "rgb(139 92 246 / 0.12)",
                    color: "#8B5CF6",
                  }}
                >
                  inferred
                </span>
              )}
            </div>
            <p
              className="text-sm"
              style={{ color: "var(--text-secondary)", lineHeight: "1.65" }}
            >
              {entry.reasoning}
            </p>
            <p
              className="text-sm"
              style={{ color: "var(--foreground)", lineHeight: "1.65" }}
            >
              → {entry.tacticalSuggestion}
            </p>
          </div>
        ))}
      </div>
    </ICPSection>
  );
}
