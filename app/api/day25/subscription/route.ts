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
      return NextResponse.json(
        { error: "Please sign in to view your subscription." },
        { status: 401 },
      );
    }

    const { data: subscription, error } = await supabase
      .from("day25_subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      console.error("[day25/subscription] fetch error:", error.message);
      return NextResponse.json(
        { error: "Failed to fetch subscription" },
        { status: 500 },
      );
    }

    return NextResponse.json({ subscription });
  } catch (error) {
    console.error(
      "[day25/subscription] error:",
      error instanceof Error ? error.message : "Unknown",
    );
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 },
    );
  }
}
