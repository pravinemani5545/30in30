import type { TweetType } from "@/types";

const TYPE_STYLES: Record<TweetType, { bg: string; color: string; label: string }> = {
  hook:       { bg: "rgba(139,92,246,0.15)", color: "#8B5CF6", label: "Hook" },
  story:      { bg: "rgba(6,182,212,0.15)",  color: "#06B6D4", label: "Story" },
  stat:       { bg: "rgba(232,160,32,0.15)", color: "#E8A020", label: "Stat" },
  contrarian: { bg: "rgba(239,68,68,0.15)",  color: "#EF4444", label: "Contrarian" },
  listicle:   { bg: "rgba(34,197,94,0.15)",  color: "#22C55E", label: "Listicle" },
};

export function TweetTypeBadge({ type }: { type: TweetType }) {
  const { bg, color, label } = TYPE_STYLES[type];
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ background: bg, color }}
    >
      {label}
    </span>
  );
}
