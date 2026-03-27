"use client";

import { AlertTriangle } from "lucide-react";

export function VerifyWarningBadge() {
  return (
    <span
      className="verify-badge inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[12px] font-medium bg-[#E8A02018] text-[#E8A020] border border-[#E8A02040] cursor-help"
      title="AI research can be outdated or incorrect. Verify key facts before the meeting."
    >
      <AlertTriangle className="w-3.5 h-3.5" />
      Verify before use
    </span>
  );
}
