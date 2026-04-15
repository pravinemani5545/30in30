"use client";

import type { OutlierVideo } from "@/types/day24";

interface OutlierTableProps {
  videos: OutlierVideo[];
}

function formatViews(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

export function OutlierTable({ videos }: OutlierTableProps) {
  return (
    <div
      style={{
        background: "#111111",
        border: "1px solid #2a2a2a",
        overflowX: "auto",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2 px-4 py-3"
        style={{
          background: "#161616",
          borderBottom: "1px solid #2a2a2a",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-day24-mono)",
            fontSize: "11px",
            letterSpacing: "3px",
            textTransform: "uppercase",
            color: "#00FF41",
            opacity: 0.75,
          }}
        >
          OUTLIER VIDEOS ({videos.length})
        </span>
      </div>

      {/* Table */}
      <table
        className="w-full"
        style={{
          fontFamily: "var(--font-day24-body)",
          fontSize: "13px",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr
            style={{
              borderBottom: "1px solid #2a2a2a",
            }}
          >
            <th
              className="text-left px-4 py-3"
              style={{
                fontFamily: "var(--font-day24-mono)",
                fontSize: "10px",
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: "#555",
                fontWeight: 500,
              }}
            >
              Title
            </th>
            <th
              className="text-right px-4 py-3"
              style={{
                fontFamily: "var(--font-day24-mono)",
                fontSize: "10px",
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: "#555",
                fontWeight: 500,
                whiteSpace: "nowrap",
              }}
            >
              Views
            </th>
            <th
              className="text-right px-4 py-3"
              style={{
                fontFamily: "var(--font-day24-mono)",
                fontSize: "10px",
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: "#555",
                fontWeight: 500,
                whiteSpace: "nowrap",
              }}
            >
              Ratio
            </th>
            <th
              className="text-left px-4 py-3 hidden md:table-cell"
              style={{
                fontFamily: "var(--font-day24-mono)",
                fontSize: "10px",
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: "#555",
                fontWeight: 500,
              }}
            >
              Why Outlier
            </th>
          </tr>
        </thead>
        <tbody>
          {videos.map((video, i) => (
            <tr
              key={`${video.title}-${i}`}
              style={{
                borderBottom:
                  i < videos.length - 1 ? "1px solid #1a1a1a" : "none",
              }}
            >
              <td
                className="px-4 py-3"
                style={{
                  color: "#eeeeee",
                  maxWidth: "280px",
                }}
              >
                <span
                  className="block"
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {video.title}
                </span>
              </td>
              <td
                className="text-right px-4 py-3"
                style={{
                  fontFamily: "var(--font-day24-mono)",
                  fontSize: "12px",
                  color: "#999",
                  whiteSpace: "nowrap",
                }}
              >
                {formatViews(video.views)}
              </td>
              <td className="text-right px-4 py-3">
                <span
                  className="inline-block px-2 py-0.5"
                  style={{
                    fontFamily: "var(--font-day24-mono)",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: video.ratio >= 10 ? "#00FF41" : "#E8A020",
                    background:
                      video.ratio >= 10
                        ? "rgba(0,255,65,0.08)"
                        : "rgba(232,160,32,0.08)",
                    border: `1px solid ${
                      video.ratio >= 10
                        ? "rgba(0,255,65,0.2)"
                        : "rgba(232,160,32,0.2)"
                    }`,
                    borderRadius: 0,
                    whiteSpace: "nowrap",
                  }}
                >
                  {video.ratio.toFixed(1)}x
                </span>
              </td>
              <td
                className="px-4 py-3 hidden md:table-cell"
                style={{
                  color: "#999",
                  fontSize: "12px",
                  maxWidth: "300px",
                }}
              >
                <span
                  className="block"
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {video.whyOutlier}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
