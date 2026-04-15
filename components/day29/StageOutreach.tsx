"use client";

import type { OutreachDraft } from "@/types/day29";

interface StageOutreachProps {
  data: OutreachDraft;
}

export function StageOutreach({ data }: StageOutreachProps) {
  return (
    <div className="space-y-5">
      {/* Subject line */}
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
          SUBJECT LINE
        </label>
        <div
          className="px-4 py-3"
          style={{
            fontFamily: "var(--font-day29-mono)",
            fontSize: "14px",
            fontWeight: 500,
            color: "#eeeeee",
            background: "#111111",
            border: "1px solid #2a2a2a",
            borderRadius: 0,
          }}
        >
          {data.subject}
        </div>
      </div>

      {/* Email body — terminal-style preview */}
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
          EMAIL BODY
        </label>
        <div
          style={{
            background: "#060606",
            border: "1px solid #2a2a2a",
            borderRadius: 0,
          }}
        >
          {/* Terminal header */}
          <div
            className="flex items-center gap-2 px-4 py-2"
            style={{
              background: "#111111",
              borderBottom: "1px solid #2a2a2a",
            }}
          >
            <span
              className="w-2.5 h-2.5 inline-block"
              style={{ background: "#ff4444", borderRadius: "50%" }}
            />
            <span
              className="w-2.5 h-2.5 inline-block"
              style={{ background: "#FFB800", borderRadius: "50%" }}
            />
            <span
              className="w-2.5 h-2.5 inline-block"
              style={{ background: "#22C55E", borderRadius: "50%" }}
            />
            <span
              className="ml-2 text-xs"
              style={{
                fontFamily: "var(--font-day29-mono)",
                color: "#555",
              }}
            >
              email-preview
            </span>
          </div>
          {/* Email content */}
          <div
            className="p-5"
            style={{
              fontFamily: "var(--font-day29-body)",
              fontSize: "14px",
              lineHeight: 1.8,
              color: "#cccccc",
              whiteSpace: "pre-wrap",
            }}
          >
            {data.body}
          </div>
        </div>
      </div>

      {/* Personalization hooks */}
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
          PERSONALIZATION HOOKS
        </label>
        <div className="space-y-1">
          {data.personalization.map((hook, i) => (
            <div
              key={i}
              className="flex items-start gap-2"
              style={{
                fontFamily: "var(--font-day29-body)",
                fontSize: "13px",
                color: "#999",
              }}
            >
              <span style={{ color: "#00FF41", marginTop: "2px" }}>&#8250;</span>
              <span>{hook}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
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
          CALL TO ACTION
        </label>
        <div
          className="px-4 py-3"
          style={{
            fontFamily: "var(--font-day29-body)",
            fontSize: "14px",
            color: "#00FF41",
            background: "rgba(0,255,65,0.05)",
            border: "1px solid rgba(0,255,65,0.15)",
            borderRadius: 0,
          }}
        >
          {data.callToAction}
        </div>
      </div>
    </div>
  );
}
