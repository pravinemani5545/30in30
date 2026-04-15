import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";
import { progressBodySchema, onboardingDataSchema } from "@/lib/day27/validations";

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
      .from("day27_onboarding_progress")
      .select("id, user_id, current_step, data, completed_at, created_at")
      .eq("user_id", user.id)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 = no rows — that's fine for first visit
      console.error("[day27/progress] GET error:", error.message);
      return NextResponse.json(
        { error: "Failed to load progress" },
        { status: 500 },
      );
    }

    return NextResponse.json({ progress: data ?? null });
  } catch (error) {
    console.error(
      "[day27/progress] GET error:",
      error instanceof Error ? error.message : "Unknown",
    );
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Please sign in to save progress." },
        { status: 401 },
      );
    }

    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      );
    }

    const parsed = progressBodySchema.safeParse(body);
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      return NextResponse.json(
        { error: firstIssue?.message ?? "Invalid input" },
        { status: 400 },
      );
    }

    const { currentStep, data: progressData } = parsed.data;

    // Check if onboarding is complete (step 4 with all data present)
    let completedAt: string | null = null;
    if (currentStep === 4) {
      const fullValidation = onboardingDataSchema.safeParse(progressData);
      if (fullValidation.success) {
        completedAt = new Date().toISOString();
      }
    }

    const { data: saved, error: upsertErr } = await supabase
      .from("day27_onboarding_progress")
      .upsert(
        {
          user_id: user.id,
          current_step: currentStep,
          data: progressData,
          completed_at: completedAt,
        },
        { onConflict: "user_id" },
      )
      .select()
      .single();

    if (upsertErr || !saved) {
      console.error("[day27/progress] upsert error:", upsertErr?.message);
      return NextResponse.json(
        { error: "Failed to save progress" },
        { status: 500 },
      );
    }

    return NextResponse.json({ progress: saved });
  } catch (error) {
    console.error(
      "[day27/progress] POST error:",
      error instanceof Error ? error.message : "Unknown",
    );
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
