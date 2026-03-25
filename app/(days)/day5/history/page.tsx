import { createSupabaseServer } from "@/lib/supabase/server";
import { HistoryList } from "@/components/day5/history-list";
import { ArrowLeft } from "lucide-react";

export default async function Day5HistoryPage() {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // proxy.ts should redirect unauthenticated users, but double-check
  if (!user) {
    return null;
  }

  const { data: analyses } = await supabase
    .from("pitch_analyses")
    .select("id, original_pitch, score, verdict, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <main className="min-h-screen px-4 py-16">
      <div className="w-full max-w-lg mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <a
            href="/day5"
            className="text-text-muted hover:text-text-secondary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </a>
          <div>
            <h1 className="font-[family-name:var(--font-display)] text-3xl text-text-primary">
              History
            </h1>
            <p className="font-[family-name:var(--font-mono)] text-xs text-text-muted">
              Your past pitch analyses
            </p>
          </div>
        </div>

        <HistoryList items={analyses ?? []} />
      </div>
    </main>
  );
}
