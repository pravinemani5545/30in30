"use client";

import type { ClassifiedReply } from "@/types/day21";
import { CategoryBadge } from "./CategoryBadge";

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max) + "...";
}

export function ReplyHistoryTable({ items }: { items: ClassifiedReply[] }) {
  if (items.length === 0) {
    return (
      <div
        className="p-6 text-center"
        style={{
          fontFamily: "var(--font-day21-mono)",
          fontSize: "13px",
          color: "#555555",
        }}
      >
        {">"} no classifications yet
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr
            style={{
              borderBottom: "1px solid #2a2a2a",
            }}
          >
            <th
              className="px-4 py-3 text-left"
              style={{
                fontFamily: "var(--font-day21-mono)",
                fontSize: "11px",
                fontWeight: 500,
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: "#555555",
              }}
            >
              Sender
            </th>
            <th
              className="px-4 py-3 text-left"
              style={{
                fontFamily: "var(--font-day21-mono)",
                fontSize: "11px",
                fontWeight: 500,
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: "#555555",
              }}
            >
              Category
            </th>
            <th
              className="px-4 py-3 text-left"
              style={{
                fontFamily: "var(--font-day21-mono)",
                fontSize: "11px",
                fontWeight: 500,
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: "#555555",
              }}
            >
              Confidence
            </th>
            <th
              className="px-4 py-3 text-left"
              style={{
                fontFamily: "var(--font-day21-mono)",
                fontSize: "11px",
                fontWeight: 500,
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: "#555555",
              }}
            >
              Date
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr
              key={item.id}
              style={{ borderBottom: "1px solid #1a1a1a" }}
            >
              <td
                className="px-4 py-3"
                style={{
                  fontFamily: "var(--font-day21-body)",
                  fontSize: "13px",
                  color: "#eeeeee",
                }}
                title={item.sender || undefined}
              >
                {item.sender ? truncate(item.sender, 30) : (
                  <span style={{ color: "#555555" }}>--</span>
                )}
              </td>
              <td className="px-4 py-3">
                <CategoryBadge category={item.category} />
              </td>
              <td
                className="px-4 py-3"
                style={{
                  fontFamily: "var(--font-day21-mono)",
                  fontSize: "13px",
                  color: "#eeeeee",
                }}
              >
                {Math.round(item.confidence * 100)}%
              </td>
              <td
                className="px-4 py-3"
                style={{
                  fontFamily: "var(--font-day21-mono)",
                  fontSize: "12px",
                  color: "#999999",
                }}
              >
                {formatDate(item.created_at)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
