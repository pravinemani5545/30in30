"use client";

import type { CampaignPreview } from "@/types/day29";

interface StageCampaignProps {
  data: CampaignPreview;
}

export function StageCampaign({ data }: StageCampaignProps) {
  return (
    <div className="space-y-5">
      {/* Campaign name */}
      <div>
        <label
          className="block mb-2"
          style={{
            fontFamily: "var(--font-day29-mono)",
            fontSize: "10px",
            letterSpacing: "3px",
            textTransform: "uppercase",
            color: "#555",
          }}
        >
          CAMPAIGN NAME
        </label>
        <h3
          style={{
            fontFamily: "var(--font-day29-heading)",
            fontSize: "22px",
            fontWeight: 700,
            color: "#00FF41",
          }}
        >
          {data.campaignName}
        </h3>
      </div>

      {/* Target persona */}
      <div>
        <label
          className="block mb-2"
          style={{
            fontFamily: "var(--font-day29-mono)",
            fontSize: "10px",
            letterSpacing: "3px",
            textTransform: "uppercase",
            color: "#555",
          }}
        >
          TARGET PERSONA
        </label>
        <div
          className="px-4 py-3"
          style={{
            fontFamily: "var(--font-day29-body)",
            fontSize: "14px",
            color: "#eeeeee",
            background: "#111111",
            border: "1px solid #2a2a2a",
            borderRadius: 0,
          }}
        >
          {data.targetPersona}
        </div>
      </div>

      {/* Stats row */}
      <div className="flex gap-4">
        <div
          className="flex-1 px-4 py-3"
          style={{
            background: "#111111",
            border: "1px solid #2a2a2a",
            borderRadius: 0,
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-day29-mono)",
              fontSize: "10px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: "#555",
              marginBottom: "4px",
            }}
          >
            TOTAL EMAILS
          </div>
          <div
            style={{
              fontFamily: "var(--font-day29-heading)",
              fontSize: "24px",
              fontWeight: 700,
              color: "#00FF41",
            }}
          >
            {data.totalEmails}
          </div>
        </div>
        <div
          className="flex-1 px-4 py-3"
          style={{
            background: "#111111",
            border: "1px solid #2a2a2a",
            borderRadius: 0,
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-day29-mono)",
              fontSize: "10px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: "#555",
              marginBottom: "4px",
            }}
          >
            DURATION
          </div>
          <div
            style={{
              fontFamily: "var(--font-day29-heading)",
              fontSize: "24px",
              fontWeight: 700,
              color: "#00FF41",
            }}
          >
            {data.estimatedDuration}
          </div>
        </div>
      </div>

      {/* Key metrics */}
      <div>
        <label
          className="block mb-2"
          style={{
            fontFamily: "var(--font-day29-mono)",
            fontSize: "10px",
            letterSpacing: "3px",
            textTransform: "uppercase",
            color: "#555",
          }}
        >
          KEY METRICS
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {data.keyMetrics.map((metric, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-3 py-2"
              style={{
                fontFamily: "var(--font-day29-mono)",
                fontSize: "12px",
                color: "#999",
                background: "#111111",
                border: "1px solid #2a2a2a",
                borderRadius: 0,
              }}
            >
              <span style={{ color: "#00FF41" }}>&#9632;</span>
              <span>{metric}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div>
        <label
          className="block mb-2"
          style={{
            fontFamily: "var(--font-day29-mono)",
            fontSize: "10px",
            letterSpacing: "3px",
            textTransform: "uppercase",
            color: "#555",
          }}
        >
          CAMPAIGN SUMMARY
        </label>
        <p
          style={{
            fontFamily: "var(--font-day29-body)",
            fontSize: "14px",
            lineHeight: 1.7,
            color: "#999",
          }}
        >
          {data.summary}
        </p>
      </div>
    </div>
  );
}
