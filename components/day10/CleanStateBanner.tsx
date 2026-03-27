"use client";

import { ShieldCheck } from "lucide-react";

export function CleanStateBanner() {
  return (
    <div
      className="flex items-center gap-3 p-4"
      style={{
        background: "rgb(34 197 94 / 0.08)",
        border: "1px solid rgb(34 197 94 / 0.2)",
        borderRadius: 6,
        color: "var(--success)",
      }}
    >
      <ShieldCheck className="w-5 h-5 shrink-0" />
      <div>
        <p className="text-[14px] font-semibold">No critical or high findings</p>
        <p className="text-[13px] opacity-80">
          No immediate security concerns detected in this snippet.
        </p>
      </div>
    </div>
  );
}
