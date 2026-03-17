import type { Mood } from "@/types/journal";

const MOOD_CONFIG: Record<
  Mood,
  { emoji: string; label: string; colorClass: string; bgClass: string }
> = {
  happy: {
    emoji: "☀️",
    label: "Happy",
    colorClass: "text-amber-300",
    bgClass: "bg-amber-500/15 border-amber-500/30",
  },
  sad: {
    emoji: "🌧️",
    label: "Sad",
    colorClass: "text-slate-300",
    bgClass: "bg-slate-500/15 border-slate-500/30",
  },
  anxious: {
    emoji: "🌀",
    label: "Anxious",
    colorClass: "text-rose-300",
    bgClass: "bg-rose-500/15 border-rose-500/30",
  },
  reflective: {
    emoji: "🌊",
    label: "Reflective",
    colorClass: "text-teal-300",
    bgClass: "bg-teal-500/15 border-teal-500/30",
  },
  energized: {
    emoji: "⚡",
    label: "Energized",
    colorClass: "text-yellow-300",
    bgClass: "bg-yellow-500/15 border-yellow-500/30",
  },
  grateful: {
    emoji: "🌿",
    label: "Grateful",
    colorClass: "text-green-300",
    bgClass: "bg-green-500/15 border-green-500/30",
  },
  frustrated: {
    emoji: "🔥",
    label: "Frustrated",
    colorClass: "text-orange-300",
    bgClass: "bg-orange-500/15 border-orange-500/30",
  },
  neutral: {
    emoji: "🌫️",
    label: "Neutral",
    colorClass: "text-zinc-300",
    bgClass: "bg-zinc-500/15 border-zinc-500/30",
  },
};

interface MoodBadgeProps {
  mood: Mood;
  size?: "sm" | "md" | "lg";
}

export function MoodBadge({ mood, size = "md" }: MoodBadgeProps) {
  const config = MOOD_CONFIG[mood];

  const sizeClass = {
    sm: "text-xs px-2 py-0.5 gap-1",
    md: "text-sm px-2.5 py-1 gap-1.5",
    lg: "text-base px-3 py-1.5 gap-2",
  }[size];

  return (
    <span
      className={[
        "inline-flex items-center rounded-full border font-medium",
        sizeClass,
        config.colorClass,
        config.bgClass,
      ].join(" ")}
    >
      <span>{config.emoji}</span>
      <span>{config.label}</span>
    </span>
  );
}

export { MOOD_CONFIG };
