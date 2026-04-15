import { NextResponse } from "next/server";
import { analyzeScriptInputSchema } from "@/lib/day22/validations";
import { analyzeScript } from "@/lib/day22/analyze";

export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      );
    }

    const parsed = analyzeScriptInputSchema.safeParse(body);
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      return NextResponse.json(
        { error: firstIssue?.message ?? "Invalid input" },
        { status: 400 },
      );
    }

    const { script } = parsed.data;

    let analysis;
    try {
      analysis = await analyzeScript(script);
    } catch (err) {
      console.error(
        "[day22/analyze] generation error:",
        err instanceof Error ? err.message : "Unknown",
      );
      return NextResponse.json(
        { error: "Script analysis failed. Please try again." },
        { status: 500 },
      );
    }

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error(
      "[day22/analyze] error:",
      error instanceof Error ? error.message : "Unknown",
    );
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
