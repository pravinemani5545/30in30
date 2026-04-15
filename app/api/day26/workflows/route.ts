import { NextResponse } from "next/server";
import { saveWorkflowSchema } from "@/lib/day26/validations";
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
      .from("day26_workflows")
      .select("id, name, definition, last_result, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      return NextResponse.json(
        { error: "Failed to load workflows" },
        { status: 500 },
      );
    }

    return NextResponse.json({ workflows: data ?? [] });
  } catch (error) {
    console.error(
      "[day26/workflows] GET error:",
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
        { error: "Please sign in to save workflows." },
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

    const parsed = saveWorkflowSchema.safeParse(body);
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      return NextResponse.json(
        { error: firstIssue?.message ?? "Invalid input" },
        { status: 400 },
      );
    }

    const { name, definition } = parsed.data;

    const { data: saved, error: insertErr } = await supabase
      .from("day26_workflows")
      .insert({
        user_id: user.id,
        name,
        definition,
      })
      .select()
      .single();

    if (insertErr || !saved) {
      console.error("[day26/workflows] insert error:", insertErr?.message);
      return NextResponse.json(
        { error: "Failed to save workflow" },
        { status: 500 },
      );
    }

    return NextResponse.json({ workflow: saved });
  } catch (error) {
    console.error(
      "[day26/workflows] POST error:",
      error instanceof Error ? error.message : "Unknown",
    );
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
