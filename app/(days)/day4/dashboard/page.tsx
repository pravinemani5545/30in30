import { createSupabaseServer } from "@/lib/supabase/server";
import type { DigestRun } from "@/types/day4";
import { BackToHub } from "@/components/shared/BackToHub";
import DashboardClient from "./client";

export default async function DashboardPage() {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch last digest run
  const { data: runs } = await supabase
    .from("digest_runs")
    .select("*")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false })
    .limit(20);

  // Fetch subscribers
  const { data: subscribers } = await supabase
    .from("subscribers")
    .select("id, email, name, is_active, created_at")
    .eq("user_id", user!.id)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  return (
    <div data-day="4">
      <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)" }}>
        <BackToHub label="Back to 30 in 30" />
      </div>
      <DashboardClient
        initialRuns={(runs as DigestRun[]) || []}
        initialSubscribers={subscribers || []}
      />
    </div>
  );
}
