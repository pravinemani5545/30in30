"use client";

import type { ContactStatus } from "@/types";

const statusConfig: Record<ContactStatus, { label: string; color: string; bg: string }> = {
  new: { label: "New", color: "#3B82F6", bg: "rgba(59, 130, 246, 0.12)" },
  contacted: { label: "Contacted", color: "#E8A020", bg: "rgba(232, 160, 32, 0.12)" },
  replied: { label: "Replied", color: "#22C55E", bg: "rgba(34, 197, 94, 0.12)" },
  closed: { label: "Closed", color: "#6B7280", bg: "rgba(107, 114, 128, 0.12)" },
};

interface StatusSelectorProps {
  status: ContactStatus;
  onChange: (status: ContactStatus) => void;
  size?: "sm" | "md";
}

export function StatusSelector({ status, onChange, size = "md" }: StatusSelectorProps) {
  const current = statusConfig[status];
  const isSmall = size === "sm";

  return (
    <select
      value={status}
      onChange={(e) => onChange(e.target.value as ContactStatus)}
      style={{
        padding: isSmall ? "3px 8px" : "6px 10px",
        background: current.bg,
        border: `1px solid ${current.color}30`,
        borderRadius: "99px",
        color: current.color,
        fontSize: isSmall ? "11px" : "12px",
        fontWeight: 500,
        cursor: "pointer",
        outline: "none",
        WebkitAppearance: "none",
        MozAppearance: "none",
        appearance: "none",
        paddingRight: isSmall ? "20px" : "24px",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath fill='${encodeURIComponent(current.color)}' d='M0 0l5 6 5-6z'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: `right ${isSmall ? "6px" : "8px"} center`,
      }}
    >
      <option value="new">New</option>
      <option value="contacted">Contacted</option>
      <option value="replied">Replied</option>
      <option value="closed">Closed</option>
    </select>
  );
}

export function StatusBadge({ status }: { status: ContactStatus }) {
  const config = statusConfig[status];
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 8px",
        borderRadius: "99px",
        fontSize: "11px",
        fontWeight: 500,
        color: config.color,
        background: config.bg,
      }}
    >
      {config.label}
    </span>
  );
}
