"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { VoiceCalibration as VoiceCal } from "@/types/day20";

interface VoiceCalibrationProps {
  calibration: VoiceCal;
  onUpdate: (partial: Partial<VoiceCal>) => void;
  hasCalibration: boolean;
}

export function VoiceCalibration({
  calibration,
  onUpdate,
  hasCalibration,
}: VoiceCalibrationProps) {
  const [open, setOpen] = useState(false);

  const isActive = open || hasCalibration;

  return (
    <div
      style={{
        border: "1px solid #2a2a2a",
        background: "#111111",
      }}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 transition-colors"
        style={{
          fontFamily: "var(--font-day20-mono)",
          fontSize: "13px",
          color: "#999",
          background: "transparent",
          border: "none",
          cursor: "pointer",
        }}
      >
        <span className="flex items-center gap-2">
          {open ? (
            <ChevronDown className="w-4 h-4" style={{ color: "#00FF41" }} />
          ) : (
            <ChevronRight className="w-4 h-4" style={{ color: "#555" }} />
          )}
          [ VOICE CALIBRATION ]
        </span>
        <span
          className="px-2 py-0.5 text-xs"
          style={{
            fontFamily: "var(--font-day20-mono)",
            fontSize: "10px",
            letterSpacing: "1px",
            border: isActive
              ? "1px solid rgba(0,255,65,0.2)"
              : "1px solid rgba(255,68,68,0.15)",
            color: isActive ? "#00FF41" : "#ff4444",
            background: isActive
              ? "rgba(0,255,65,0.05)"
              : "rgba(255,68,68,0.05)",
          }}
        >
          {isActive ? "CALIBRATION: ON" : "CALIBRATION: OFF"}
        </span>
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-4">
          <div>
            <label
              className="block mb-1.5"
              style={{
                fontFamily: "var(--font-day20-mono)",
                fontSize: "11px",
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: "#555",
              }}
            >
              EXAMPLE POST
            </label>
            <textarea
              rows={3}
              value={calibration.examplePost}
              onChange={(e) => onUpdate({ examplePost: e.target.value })}
              placeholder="Paste your best-performing post..."
              style={{
                width: "100%",
                padding: "10px 12px",
                background: "#060606",
                border: "1px solid #2a2a2a",
                color: "#eeeeee",
                fontFamily: "var(--font-day20-body)",
                fontSize: "14px",
                resize: "vertical",
                outline: "none",
                borderRadius: 0,
              }}
              className="placeholder:text-[#555]"
            />
          </div>

          <div>
            <label
              className="block mb-1.5"
              style={{
                fontFamily: "var(--font-day20-mono)",
                fontSize: "11px",
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: "#555",
              }}
            >
              TONE
            </label>
            <input
              type="text"
              value={calibration.tone}
              onChange={(e) => onUpdate({ tone: e.target.value })}
              placeholder="direct, no fluff, founder lens"
              style={{
                width: "100%",
                padding: "10px 12px",
                background: "#060606",
                border: "1px solid #2a2a2a",
                color: "#eeeeee",
                fontFamily: "var(--font-day20-mono)",
                fontSize: "13px",
                outline: "none",
                borderRadius: 0,
              }}
              className="placeholder:text-[#555]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                className="block mb-1.5"
                style={{
                  fontFamily: "var(--font-day20-mono)",
                  fontSize: "11px",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  color: "#555",
                }}
              >
                USE VOCAB
              </label>
              <input
                type="text"
                value={calibration.vocabUse}
                onChange={(e) => onUpdate({ vocabUse: e.target.value })}
                placeholder="ship, build, iterate, compound"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  background: "#060606",
                  border: "1px solid #2a2a2a",
                  color: "#eeeeee",
                  fontFamily: "var(--font-day20-mono)",
                  fontSize: "13px",
                  outline: "none",
                  borderRadius: 0,
                }}
                className="placeholder:text-[#555]"
              />
            </div>
            <div>
              <label
                className="block mb-1.5"
                style={{
                  fontFamily: "var(--font-day20-mono)",
                  fontSize: "11px",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  color: "#555",
                }}
              >
                AVOID VOCAB
              </label>
              <input
                type="text"
                value={calibration.vocabAvoid}
                onChange={(e) => onUpdate({ vocabAvoid: e.target.value })}
                placeholder="leverage, synergy, journey, amazing"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  background: "#060606",
                  border: "1px solid #2a2a2a",
                  color: "#eeeeee",
                  fontFamily: "var(--font-day20-mono)",
                  fontSize: "13px",
                  outline: "none",
                  borderRadius: 0,
                }}
                className="placeholder:text-[#555]"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
