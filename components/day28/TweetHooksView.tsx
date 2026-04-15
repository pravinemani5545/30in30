"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
import type { TweetHook } from "@/types/day28";

interface TweetHooksViewProps {
  hooks: TweetHook[];
}

const ANGLE_COLORS: Record<string, string> = {
  achievement: "#00FF41",
  "behind-the-scenes": "#8B5CF6",
  "hot-take": "#EF4444",
  tip: "#E8A020",
  question: "#06B6D4",
};

function getAngleColor(angle: string): string {
  const lower = angle.toLowerCase();
  return ANGLE_COLORS[lower] ?? "#00FF41";
}

function CopyTweetButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast("> copied to clipboard [OK]", {
        style: {
          background: "#161616",
          border: "1px solid #2a2a2a",
          color: "#00FF41",
          fontFamily: "var(--font-day28-mono)",
          fontSize: "13px",
          borderRadius: 0,
        },
      });
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // silent
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="flex items-center gap-1.5 transition-colors"
      style={{
        fontFamily: "var(--font-day28-mono)",
        fontSize: "11px",
        color: copied ? "#00FF41" : "#555",
        background: "transparent",
        border: "none",
        cursor: "pointer",
        padding: "4px 8px",
      }}
    >
      {copied ? (
        <Check className="w-3.5 h-3.5" style={{ color: "#00FF41" }} />
      ) : (
        <Copy className="w-3.5 h-3.5" />
      )}
      <span>{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}

export function TweetHooksView({ hooks }: TweetHooksViewProps) {
  return (
    <div className="space-y-4">
      {hooks.map((hook, i) => {
        const color = getAngleColor(hook.angle);
        return (
          <div
            key={i}
            style={{
              background: "#111111",
              border: "1px solid #2a2a2a",
              borderRadius: 0,
            }}
          >
            {/* Tweet header */}
            <div
              className="px-4 py-3 flex items-center justify-between"
              style={{
                borderBottom: "1px solid #2a2a2a",
                background: "#161616",
              }}
            >
              <div className="flex items-center gap-3">
                <span
                  style={{
                    fontFamily: "var(--font-day28-mono)",
                    fontSize: "11px",
                    color: "#555",
                  }}
                >
                  #{i + 1}
                </span>
                {/* Angle badge */}
                <span
                  className="px-2 py-0.5"
                  style={{
                    fontFamily: "var(--font-day28-mono)",
                    fontSize: "10px",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    color,
                    background: `${color}10`,
                    border: `1px solid ${color}30`,
                    borderRadius: 0,
                  }}
                >
                  {hook.angle}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span
                  style={{
                    fontFamily: "var(--font-day28-mono)",
                    fontSize: "11px",
                    color: hook.charCount > 280 ? "#EF4444" : "#555",
                  }}
                >
                  {hook.charCount}/280
                </span>
                <CopyTweetButton text={hook.text} />
              </div>
            </div>

            {/* Tweet body */}
            <div className="p-4">
              <p
                style={{
                  fontFamily: "var(--font-day28-body)",
                  fontSize: "14px",
                  lineHeight: 1.7,
                  color: "#eeeeee",
                }}
              >
                {hook.text}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
