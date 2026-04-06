import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";
import { CalendarInputSchema } from "@/lib/day19/validations/calendars";
import { generateCalendar } from "@/lib/day19/gemini/calendar";

export const maxDuration = 60;

const MAX_CALENDARS_PER_DAY = 5;

export async function POST(req: Request) {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = CalendarInputSchema.safeParse(body);

  if (!parsed.success) {
    const issues = parsed.error.issues;
    return NextResponse.json(
      { error: issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  // Rate limit: 5 calendars/day/user
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const { count } = await supabase
    .from("content_calendars")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", todayStart.toISOString());

  if ((count ?? 0) >= MAX_CALENDARS_PER_DAY) {
    return NextResponse.json(
      { error: "You've generated 5 calendars today. Come back tomorrow." },
      { status: 429 },
    );
  }

  try {
    const report = await generateCalendar(parsed.data);

    // Single INSERT — complete record, no pending row (ISSUE 3)
    const { data, error } = await supabase
      .from("content_calendars")
      .insert({
        user_id: user.id,
        pillars: parsed.data.pillars,
        platforms: parsed.data.platforms,
        audience_persona: parsed.data.audiencePersona,
        unique_perspective: parsed.data.uniquePerspective,
        style_example: parsed.data.styleExample ?? null,
        month_label: parsed.data.monthLabel,
        posts: report.posts,
        calendar_summary: report.calendarSummary,
        constraint_violations: report.constraintViolations,
        generic_output_warning: report.genericOutputWarning,
        generation_ms: report.generationMs,
        ai_model_used: report.modelUsed,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      ...data,
      generic_count: report.genericCount,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Generation failed";
    if (message.includes("truncated")) {
      return NextResponse.json({ error: message }, { status: 504 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("content_calendars")
    .select(
      "id, month_label, pillars, constraint_violations, generic_output_warning, created_at, posts",
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Return list items with post_count instead of full posts array
  const items = (data ?? []).map((row) => ({
    id: row.id,
    month_label: row.month_label,
    pillars: row.pillars,
    constraint_violations: row.constraint_violations,
    generic_output_warning: row.generic_output_warning,
    created_at: row.created_at,
    post_count: Array.isArray(row.posts) ? row.posts.length : 0,
  }));

  return NextResponse.json(items);
}
