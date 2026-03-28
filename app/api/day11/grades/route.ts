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

    const { data: grades, error } = await supabase
      .from("email_grades")
      .select("id, overall_score, gate_passed, original_email, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      console.error("[day11/grades] list error:", error.message);
      return NextResponse.json(
        { error: "Failed to fetch grades" },
        { status: 500 }
      );
    }

    return NextResponse.json({ grades: grades ?? [] });
  } catch (error) {
    console.error(
      "[day11/grades] error:",
      error instanceof Error ? error.message : "Unknown"
    );
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
