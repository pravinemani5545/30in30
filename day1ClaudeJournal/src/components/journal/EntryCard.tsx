import Link from "next/link";
import { MoodBadge } from "./MoodBadge";
import type { JournalEntry, Mood } from "@/types/journal";

interface EntryCardProps {
  entry: Pick<
    JournalEntry,
    "id" | "entry_title" | "mood" | "mood_intensity" | "reflections" | "word_count" | "created_at"
  >;
}

export function EntryCard({ entry }: EntryCardProps) {
  const date = new Date(entry.created_at);
  const firstReflection = entry.reflections?.[0];

  return (
    <Link href={`/entries/${entry.id}`} className="block group">
      <div className="rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-0.5 min-w-0">
            <p className="text-xs text-muted-foreground">
              {date.toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </p>
            <h3 className="font-serif text-lg text-foreground group-hover:text-foreground/90 leading-tight truncate">
              {entry.entry_title ?? "Untitled entry"}
            </h3>
          </div>
          {entry.mood && <MoodBadge mood={entry.mood as Mood} size="sm" />}
        </div>

        {firstReflection && (
          <p className="text-xs text-muted-foreground italic line-clamp-2">
            &ldquo;{firstReflection.insight}&rdquo;
          </p>
        )}

        {entry.word_count && (
          <p className="text-xs text-muted-foreground/50">
            {entry.word_count} words
          </p>
        )}
      </div>
    </Link>
  );
}
