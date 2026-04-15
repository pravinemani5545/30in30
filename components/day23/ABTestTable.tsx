"use client";

import type { ABTestResult } from "@/types/day23";

interface ABTestTableProps {
  data: ABTestResult[];
}

export function ABTestTable({ data }: ABTestTableProps) {
  if (data.length === 0) {
    return (
      <div
        className="p-6 text-center"
        style={{
          background: "#111111",
          border: "1px solid #2a2a2a",
          borderRadius: 0,
          fontFamily: "var(--font-day23-mono)",
          fontSize: "13px",
          color: "#555555",
        }}
      >
        {">"} no A/B test data available
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#111111",
        border: "1px solid #2a2a2a",
        borderRadius: 0,
      }}
    >
      <div className="p-4 pb-2">
        <span
          className="block"
          style={{
            fontFamily: "var(--font-day23-mono)",
            fontSize: "11px",
            letterSpacing: "3px",
            textTransform: "uppercase",
            color: "#00FF41",
            opacity: 0.75,
          }}
        >
          A/B TEST RESULTS
        </span>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table className="w-full" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #2a2a2a" }}>
              {["Stage", "Variant A", "Variant B", "Z-Score", "P-Value", "Sig?"].map(
                (header) => (
                  <th
                    key={header}
                    className="px-4 py-2 text-left"
                    style={{
                      fontFamily: "var(--font-day23-mono)",
                      fontSize: "11px",
                      fontWeight: 500,
                      color: "#555555",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                    }}
                  >
                    {header}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr
                key={row.stage}
                style={{ borderBottom: "1px solid #1a1a1a" }}
              >
                <td
                  className="px-4 py-3"
                  style={{
                    fontFamily: "var(--font-day23-mono)",
                    fontSize: "13px",
                    color: "#eeeeee",
                  }}
                >
                  {row.stage}
                </td>
                <td
                  className="px-4 py-3"
                  style={{
                    fontFamily: "var(--font-day23-mono)",
                    fontSize: "13px",
                    color: "#eeeeee",
                  }}
                >
                  {row.variantA.rate}%
                  <span
                    style={{
                      fontSize: "11px",
                      color: "#555555",
                      marginLeft: "4px",
                    }}
                  >
                    ({row.variantA.count}/{row.variantA.total})
                  </span>
                </td>
                <td
                  className="px-4 py-3"
                  style={{
                    fontFamily: "var(--font-day23-mono)",
                    fontSize: "13px",
                    color: "#eeeeee",
                  }}
                >
                  {row.variantB.rate}%
                  <span
                    style={{
                      fontSize: "11px",
                      color: "#555555",
                      marginLeft: "4px",
                    }}
                  >
                    ({row.variantB.count}/{row.variantB.total})
                  </span>
                </td>
                <td
                  className="px-4 py-3"
                  style={{
                    fontFamily: "var(--font-day23-mono)",
                    fontSize: "13px",
                    color: row.significant ? "#00FF41" : "#999999",
                  }}
                >
                  {row.zScore.toFixed(3)}
                </td>
                <td
                  className="px-4 py-3"
                  style={{
                    fontFamily: "var(--font-day23-mono)",
                    fontSize: "13px",
                    color: row.significant ? "#00FF41" : "#999999",
                  }}
                >
                  {row.pValue.toFixed(4)}
                </td>
                <td
                  className="px-4 py-3"
                  style={{
                    fontFamily: "var(--font-day23-mono)",
                    fontSize: "13px",
                    fontWeight: row.significant ? 700 : 400,
                    color: row.significant ? "#00FF41" : "#555555",
                  }}
                >
                  {row.significant ? "YES" : "NO"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
