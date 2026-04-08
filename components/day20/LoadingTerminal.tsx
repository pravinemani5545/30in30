"use client";

import { useLoadingTerminal } from "@/hooks/day20/useLoadingTerminal";

interface LoadingTerminalProps {
  active: boolean;
}

export function LoadingTerminal({ active }: LoadingTerminalProps) {
  const { lines } = useLoadingTerminal(active);

  if (!active && lines.length === 0) return null;

  return (
    <div
      style={{
        background: "#161616",
        border: "1px solid #2a2a2a",
      }}
    >
      {/* Top bar */}
      <div
        className="flex items-center gap-2 px-4 py-3"
        style={{
          background: "#1a1a1a",
          borderBottom: "1px solid #2a2a2a",
        }}
      >
        <span
          className="w-3 h-3 inline-block"
          style={{ background: "#ff4444", borderRadius: "50%" }}
        />
        <span
          className="w-3 h-3 inline-block"
          style={{ background: "#FFB800", borderRadius: "50%" }}
        />
        <span
          className="w-3 h-3 inline-block"
          style={{ background: "#22C55E", borderRadius: "50%" }}
        />
        <span
          className="ml-3 text-xs"
          style={{
            fontFamily: "var(--font-day20-mono)",
            color: "#555",
          }}
        >
          pipeline — running
        </span>
      </div>

      {/* Terminal body */}
      <div
        className="p-5 space-y-1 min-h-[200px]"
        style={{
          fontFamily: "var(--font-day20-mono)",
          fontSize: "13px",
          lineHeight: 1.8,
          background: "#060606",
        }}
      >
        {lines.map((line, i) => (
          <div
            key={`${i}-${line.text}`}
            className="transition-opacity duration-200"
            style={{ opacity: 1, color: "#999" }}
          >
            {line.highlight ? (
              <>
                {line.text.replace(line.highlight, "")}
                <span style={{ color: "#00FF41" }}>{line.highlight}</span>
              </>
            ) : (
              line.text
            )}
          </div>
        ))}
        {active && (
          <div>
            <span
              className="inline-block w-2 h-4 align-middle"
              style={{
                background: "#00FF41",
                animation: "cursor-blink 1s infinite",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
