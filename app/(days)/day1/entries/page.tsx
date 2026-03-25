import { Suspense } from "react";

export const dynamic = "force-dynamic";
import { createSupabaseServer } from "@/lib/supabase/server";
import { EntryCard } from "@/components/day1/EntryCard";
import { Skeleton } from "@/components/ui/skeleton";
import type { JournalEntry } from "@/types/day1";

async function EntriesList() {
  const supabase = await createSupabaseServer();
  const { data: entries, error } = await supabase
    .from("journal_entries")
    .select(
      "id, entry_title, mood, mood_intensity, reflections, word_count, created_at"
    )
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    return (
      <p className="text-sm text-muted-foreground text-center py-12">
        Could not load entries. Please refresh.
      </p>
    );
  }

  if (!entries || entries.length === 0) {
    return (
      <div className="text-center py-16 space-y-2">
        <p className="text-muted-foreground text-sm">No entries yet.</p>
        <p className="text-muted-foreground/60 text-xs">
          Head to Journal to record your first entry.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {(entries as JournalEntry[]).map((entry) => (
        <EntryCard key={entry.id} entry={entry} />
      ))}
    </div>
  );
}

function EntriesSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-lg border border-border p-4 space-y-3">
          <div className="flex justify-between">
            <div className="space-y-1.5">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-5 w-48" />
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-3/4" />
        </div>
      ))}
    </div>
  );
}

export default function EntriesPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-foreground">Your Entries</h1>
        <p className="text-sm text-muted-foreground mt-1">Your journal, organized.</p>
      </div>
      <Suspense fallback={<EntriesSkeleton />}>
        <EntriesList />
      </Suspense>
    </div>
  );
}
