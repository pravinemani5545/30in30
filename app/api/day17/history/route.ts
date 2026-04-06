import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("deliverability_checks")
      .select("id, domain, overall_grade, overall_score, all_checks_passed, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      return NextResponse.json(
        { error: "Failed to load history" },
        { status: 500 },
      );
    }

    return NextResponse.json({ checks: data ?? [] });
  } catch (error) {
    console.error(
      "[day17/history] GET error:",
      error instanceof Error ? error.message : "Unknown",
    );
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
