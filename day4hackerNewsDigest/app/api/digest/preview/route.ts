import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { runDigest } from "@/lib/cron/digest";

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Rate limit: 3 manual triggers per day
  const today = new Date().toISOString().split("T")[0];
  const { count } = await supabase
    .from("digest_runs")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", `${today}T00:00:00.000Z`);

  if (count !== null && count >= 3) {
    return NextResponse.json(
      { error: "You've already triggered 3 manual digests today" },
      { status: 429 }
    );
  }

  try {
    // Use service client for the digest run (needs to read all subscriber tokens)
    const serviceClient = createServiceClient();
    const result = await runDigest(user.id, serviceClient);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Manual digest error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
