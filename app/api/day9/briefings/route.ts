import { NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createSupabaseServer } from "@/lib/supabase/server";
import { BriefingInputSchema } from "@/lib/day9/validations/briefing";
import { buildSearchQueries } from "@/lib/day9/search/queries";
import {
  computeCacheKey,
  getCachedResults,
  setCachedResults,
} from "@/lib/day9/search/cache";
import { aggregateResults } from "@/lib/day9/search/aggregate";
import { synthesizeBriefing } from "@/lib/day9/claude/synthesize";
import type { SearchQuery, SearchResult } from "@/types/day9";

export const maxDuration = 60;

const DAILY_RATE_LIMIT = 10;
const SERPER_URL = "https://google.serper.dev/search";

interface SerperOrganic {
  title: string;
  link: string;
  snippet: string;
  date?: string;
}

/** Execute a single Serper query and update the briefing's step status */
async function executeAndTrack(
  query: SearchQuery,
  stepField: string,
  briefingId: string,
  supabase: SupabaseClient
): Promise<SearchResult[]> {
  try {
    const response = await fetch(SERPER_URL, {
      method: "POST",
      headers: {
        "X-API-KEY": process.env.SERPER_API_KEY!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ q: query.query, gl: "us", hl: "en", num: 5 }),
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      console.warn(`[briefings] Search "${query.label}" failed: ${response.status}`);
      await supabase.from("briefings").update({ [stepField]: true }).eq("id", briefingId);
      return [];
    }

    const data = (await response.json()) as { organic?: SerperOrganic[] };
    const results: SearchResult[] = (data.organic ?? []).map((item) => ({
      title: item.title,
      url: item.link,
      snippet: item.snippet,
      date: item.date ?? null,
      queryType: query.type,
    }));

    // Mark this search step complete (triggers Realtime)
    await supabase.from("briefings").update({ [stepField]: true }).eq("id", briefingId);
    return results;
  } catch (err) {
    console.warn(`[briefings] Search "${query.label}" error:`, err instanceof Error ? err.message : err);
    await supabase.from("briefings").update({ [stepField]: true }).eq("id", briefingId);
    return [];
  }
}

// POST: Generate a new briefing
export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = BriefingInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid request" },
        { status: 400 }
      );
    }

    const { personName, companyName, meetingContext } = parsed.data;

    // Rate limit: 10 briefings per day
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const { count: todayCount } = await supabase
      .from("briefings")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", todayStart.toISOString());

    if ((todayCount ?? 0) >= DAILY_RATE_LIMIT) {
      return NextResponse.json(
        { error: "Daily limit reached (10 briefings per day)" },
        { status: 429 }
      );
    }

    console.log(`[briefings] Generating for: ${personName} @ ${companyName}`);

    const cacheKey = await computeCacheKey(personName, companyName);

    // Create briefing record (queued)
    const { data: briefing, error: insertError } = await supabase
      .from("briefings")
      .insert({
        user_id: user.id,
        person_name: personName,
        company_name: companyName,
        meeting_context: meetingContext,
        cache_key: cacheKey,
        status: "queued",
      })
      .select("id")
      .single();

    if (insertError || !briefing) {
      console.error("[briefings] Insert error:", insertError?.message);
      return NextResponse.json({ error: "Failed to create briefing" }, { status: 500 });
    }

    const briefingId = briefing.id;

    // Check cache
    const cached = await getCachedResults(cacheKey, supabase);
    let searchResults = cached?.results ?? [];
    let queryCount = cached?.queryCount ?? 0;
    let wasCached = false;
    let searchMs = 0;

    if (cached) {
      wasCached = true;
      await supabase.from("briefings").update({
        status: "searching",
        was_cached: true,
        cache_hit_at: new Date().toISOString(),
        search_1_done: true,
        search_2_done: true,
        search_3_done: true,
      }).eq("id", briefingId);
    } else {
      await supabase.from("briefings").update({ status: "searching" }).eq("id", briefingId);

      const queries = buildSearchQueries(personName, companyName);
      const searchStart = Date.now();

      // Execute all 3 searches in parallel with individual Realtime updates
      const stepFields = ["search_1_done", "search_2_done", "search_3_done"];
      console.log(`[briefings] Executing ${queries.length} searches...`);
      const settled = await Promise.allSettled(
        queries.map((q, i) => executeAndTrack(q, stepFields[i], briefingId, supabase))
      );

      searchMs = Date.now() - searchStart;
      console.log(`[briefings] Searches done in ${searchMs}ms`);

      const resultSets = settled.map((r) => (r.status === "fulfilled" ? r.value : []));
      console.log(`[briefings] Results per query: ${resultSets.map(r => r.length).join(", ")}`);
      const partial = settled.some((r) => r.status === "rejected" || (r.status === "fulfilled" && r.value.length === 0));
      const aggregated = aggregateResults(resultSets, queries.length, partial);
      searchResults = aggregated.results;
      queryCount = aggregated.queryCount;
      console.log(`[briefings] Aggregated: ${searchResults.length} results, partial=${partial}`);

      // Store in cache (only if we have results)
      if (searchResults.length > 0) {
        await setCachedResults(cacheKey, personName, companyName, searchResults, queryCount, supabase);
      }
    }

    // No results at all
    if (searchResults.length === 0) {
      await supabase.from("briefings").update({
        status: "failed",
        error_message: "No search results found. Try a different name or company.",
        search_ms: searchMs,
      }).eq("id", briefingId);
      return NextResponse.json({ error: "No search results found", briefingId }, { status: 422 });
    }

    // Synthesize with Gemini
    console.log(`[briefings] Starting synthesis with ${searchResults.length} results...`);
    await supabase.from("briefings").update({ status: "synthesising" }).eq("id", briefingId);

    const synthesisStart = Date.now();
    const output = await synthesizeBriefing(personName, companyName, meetingContext, searchResults, wasCached);
    const synthesisMs = Date.now() - synthesisStart;
    console.log(`[briefings] Synthesis done in ${synthesisMs}ms, quality=${output.dataQuality}`);

    // Update briefing with complete results
    await supabase.from("briefings").update({
      status: "complete",
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
      search_ms: searchMs,
      synthesis_ms: synthesisMs,
    }).eq("id", briefingId);

    // Fetch and return the complete briefing
    const { data: completeBriefing } = await supabase
      .from("briefings")
      .select("*")
      .eq("id", briefingId)
      .single();

    return NextResponse.json(completeBriefing);
  } catch (error) {
    console.error("[briefings] Error:", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET: List user's briefings
export async function GET() {
  try {
    const supabase = await createSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json([]);
    }

    const { data, error } = await supabase
      .from("briefings")
      .select("id, person_name, company_name, meeting_context, created_at, was_cached, status")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
