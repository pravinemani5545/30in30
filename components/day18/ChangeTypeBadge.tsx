import type { ChangeType } from "@/types/day18";
import { CHANGE_TYPE_LABELS, CHANGE_TYPE_COLORS } from "@/types/day18";

interface ChangeTypeBadgeProps {
  type: ChangeType;
}

export function ChangeTypeBadge({ type }: ChangeTypeBadgeProps) {
  return (
    <span
      className="text-[10px] font-bold uppercase tracking-[0.12em] px-2 py-0.5 rounded"
      style={{
        color: CHANGE_TYPE_COLORS[type],
        background: `color-mix(in srgb, ${CHANGE_TYPE_COLORS[type]} 12%, transparent)`,
      }}
    >
      {CHANGE_TYPE_LABELS[type]}
    </span>
  );
}
