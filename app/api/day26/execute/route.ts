import { NextResponse } from "next/server";
import { workflowDefinitionSchema } from "@/lib/day26/validations";
import { executeWorkflow } from "@/lib/day26/orchestrator";
import { createSupabaseServer } from "@/lib/supabase/server";

export const maxDuration = 120;

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Please sign in to execute workflows." },
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

    const parsed = workflowDefinitionSchema.safeParse(body.definition);
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      return NextResponse.json(
        { error: firstIssue?.message ?? "Invalid workflow definition" },
        { status: 400 },
      );
    }

    let execution;
    try {
      execution = await executeWorkflow(parsed.data);
    } catch (err) {
      console.error(
        "[day26/execute] orchestration error:",
        err instanceof Error ? err.message : "Unknown",
      );
      return NextResponse.json(
        { error: "Workflow execution failed. Please try again." },
        { status: 500 },
      );
    }

    return NextResponse.json({ execution });
  } catch (error) {
    console.error(
      "[day26/execute] error:",
      error instanceof Error ? error.message : "Unknown",
    );
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
