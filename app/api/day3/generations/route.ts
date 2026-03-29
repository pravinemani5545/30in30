import { NextRequest, NextResponse } from "next/server";
import { getOptionalUser } from "@/lib/auth/guest";

export async function GET(request: NextRequest) {
  const { user, supabase, isGuest } = await getOptionalUser();
  if (isGuest || !supabase) {
    return NextResponse.json({ generations: [] });
  }

  const { searchParams } = new URL(request.url);
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "20", 10), 50);
  const offset = parseInt(searchParams.get("offset") ?? "0", 10);

  const { data: generations, error } = await supabase
    .from("generations")
    .select("id, article_url, article_title, article_domain, article_favicon_url, created_at, status")
    .eq("user_id", user.id)
    .eq("status", "completed")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    return NextResponse.json({ error: "Failed to fetch generations" }, { status: 500 });
  }

  // Get top hook scores for each generation
  const generationIds = (generations ?? []).map((g) => g.id);
  let topScores: Record<string, number> = {};

  if (generationIds.length > 0) {
    const { data: scores } = await supabase
      .from("tweet_variations")
      .select("generation_id, hook_score")
      .in("generation_id", generationIds);

    if (scores) {
      topScores = scores.reduce<Record<string, number>>((acc, s) => {
        if (!acc[s.generation_id] || s.hook_score > acc[s.generation_id]) {
          acc[s.generation_id] = s.hook_score;
        }
        return acc;
      }, {});
    }
  }

  const result = (generations ?? []).map((g) => ({
    ...g,
    top_hook_score: topScores[g.id] ?? null,
  }));

  return NextResponse.json({ generations: result });
}
