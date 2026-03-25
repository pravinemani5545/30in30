import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
import { createSupabaseServer } from "@/lib/supabase/server";
import { EntryResult } from "@/components/day1/EntryResult";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { JournalEntry } from "@/types/day1";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EntryDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createSupabaseServer();

  const { data: entry, error } = await supabase
    .from("journal_entries")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !entry) notFound();

  const typedEntry = entry as JournalEntry;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <Link
          href="/day1/entries"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground -ml-2 px-2 py-1 rounded-md hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          All entries
        </Link>
        <span className="text-xs text-muted-foreground/50">
          {new Date(typedEntry.created_at).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      </div>

      {/* Raw transcript */}
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium">What you said</p>
        <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
          {typedEntry.raw_transcript}
        </p>
      </div>

      <div className="border-t border-border" />

      <EntryResult entry={typedEntry} />
    </div>
  );
}
