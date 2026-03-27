import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { AutoBriefingInputSchema } from "@/lib/day9/validations/briefing";
import { buildSearchQueries } from "@/lib/day9/search/queries";
import { searchAll } from "@/lib/day9/search/serper";
import {
  computeCacheKey,
  getCachedResults,
  setCachedResults,
} from "@/lib/day9/search/cache";
import { synthesizeBriefing } from "@/lib/day9/claude/synthesize";

export const maxDuration = 60;

// POST: Auto-generate briefing via webhook (Day 29 integration)
export async function POST(request: Request) {
  // Verify webhook secret
  const secret = request.headers.get("x-webhook-secret");
  if (!secret || secret !== process.env.WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = AutoBriefingInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid request" },
        { status: 400 }
      );
    }

    const { personName, companyName, meetingContext, bookingId } = parsed.data;
    const supabase = createServiceClient();

    // We need a user_id for the briefing. For webhook, use service role.
    // The booking webhook should include the user_id of the sales rep.
    const userId = (body.userId as string) || null;
    if (!userId) {
      return NextResponse.json(
        { error: "userId is required for auto-generation" },
        { status: 400 }
      );
    }

    const cacheKey = await computeCacheKey(personName, companyName);

    // Create briefing record
    const { data: briefing, error: insertError } = await supabase
      .from("briefings")
      .insert({
        user_id: userId,
        person_name: personName,
        company_name: companyName,
        meeting_context: meetingContext,
        cache_key: cacheKey,
        status: "queued",
        booking_id: bookingId ?? null,
      })
      .select("id")
      .single();

    if (insertError || !briefing) {
      return NextResponse.json(
        { error: "Failed to create briefing" },
        { status: 500 }
      );
    }

    // Check cache
    const cached = await getCachedResults(cacheKey, supabase);
    let searchResults = cached?.results ?? [];
    let queryCount = cached?.queryCount ?? 0;
    const wasCached = !!cached;

    if (!cached) {
      const queries = buildSearchQueries(personName, companyName);
      const aggregated = await searchAll(queries);
      searchResults = aggregated.results;
      queryCount = aggregated.queryCount;

      if (searchResults.length > 0) {
        await setCachedResults(
          cacheKey,
          personName,
          companyName,
          searchResults,
          queryCount,
          supabase
        );
      }
    }

    if (searchResults.length === 0) {
      await supabase
        .from("briefings")
        .update({
          status: "failed",
          error_message: "No search results found",
        })
        .eq("id", briefing.id);

      return NextResponse.json(
        { briefingId: briefing.id, status: "failed" },
        { status: 422 }
      );
    }

    // Synthesize
    const output = await synthesizeBriefing(
      personName,
      companyName,
      meetingContext,
      searchResults,
      wasCached
    );

    await supabase
      .from("briefings")
      .update({
        status: "complete",
        was_cached: wasCached,
        search_1_done: true,
        search_2_done: true,
        search_3_done: true,
        synthesis_done: true,
        background: output.background.text,
        background_confidence: output.background.confidence,
        company_context: output.companyContext.text,
        company_confidence: output.companyContext.confidence,
        talking_points: output.talkingPoints,
        objections: output.objections,
        conversation_starters: output.conversationStarters,
        sources: output.sources,
        data_quality: output.dataQuality,
        data_quality_note: output.dataQualityNote,
      })
      .eq("id", briefing.id);

    return NextResponse.json({ briefingId: briefing.id, status: "complete" });
  } catch (error) {
    console.error(
      "[auto-briefing] Error:",
      error instanceof Error ? error.message : error
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
