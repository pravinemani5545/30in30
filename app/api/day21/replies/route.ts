import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

export const maxDuration = 60;

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
      .from("day21_classified_replies")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      return NextResponse.json(
        { error: "Failed to load history" },
        { status: 500 },
      );
    }

    return NextResponse.json({ items: data ?? [] });
  } catch (error) {
    console.error(
      "[day21/replies] GET error:",
      error instanceof Error ? error.message : "Unknown",
    );
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
