import { NextResponse } from "next/server";
import { getOptionalUser } from "@/lib/auth/guest";

export async function GET() {
  try {
    const { user, supabase, isGuest } = await getOptionalUser();

    if (isGuest || !supabase) {
      return NextResponse.json({ reviews: [] });
    }

    const { data: reviews, error } = await supabase
      .from("code_reviews")
      .select(
        "id, detected_language, confirmed_language, status, critical_count, high_count, medium_count, low_count, summary, created_at"
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      console.error("[day10/reviews] list error:", error.message);
      return NextResponse.json(
        { error: "Failed to load reviews" },
        { status: 500 }
      );
    }

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error(
      "[day10/reviews] error:",
      error instanceof Error ? error.message : "Unknown"
    );
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
