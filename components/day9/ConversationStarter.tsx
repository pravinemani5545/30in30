"use client";

import type { ConversationStarter as StarterType } from "@/types/day9";
import { MessageCircle } from "lucide-react";

export function ConversationStarter({ starter }: { starter: StarterType }) {
  const isInsufficient = starter.starter.includes("[INSUFFICIENT_DATA");

  if (isInsufficient) {
    return (
      <div className="mb-3 last:mb-0 px-3 py-2.5 rounded border border-[#E8A02040] bg-[#E8A02010]">
        <p className="text-sm text-[#E8A020]">
          Could not generate a specific conversation starter — limited research
          data available. Consider opening with a question about their recent
          work.
        </p>
      </div>
    );
  }

  return (
    <div className="mb-3 last:mb-0">
      <div className="flex gap-2">
        <MessageCircle className="w-4 h-4 text-[#22C55E] mt-0.5 shrink-0" />
        <div>
          <p className="text-[15px] font-medium text-[var(--foreground)] leading-[1.65]">
            &ldquo;{starter.starter}&rdquo;
          </p>
          <p className="text-[11px] text-[var(--text-tertiary)] mt-1">
            Seeded by: {starter.seededBy}
          </p>
        </div>
      </div>
    </div>
  );
}
