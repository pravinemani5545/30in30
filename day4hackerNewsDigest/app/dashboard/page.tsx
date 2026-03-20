import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { DigestRun } from "@/types";
import DashboardClient from "./client";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch last digest run
  const { data: runs } = await supabase
    .from("digest_runs")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  // Fetch subscribers
  const { data: subscribers } = await supabase
    .from("subscribers")
    .select("id, email, name, is_active, created_at")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  return (
    <DashboardClient
      initialRuns={(runs as DigestRun[]) || []}
      initialSubscribers={subscribers || []}
    />
  );
}
