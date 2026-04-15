import { NextResponse } from "next/server";
import { nicheInputSchema } from "@/lib/day24/validations";
import { analyzeNiche } from "@/lib/day24/analyze";

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

    const parsed = nicheInputSchema.safeParse(body);
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      return NextResponse.json(
        { error: firstIssue?.message ?? "Invalid input" },
        { status: 400 },
      );
    }

    const { niche } = parsed.data;

    let analysis;
    try {
      analysis = await analyzeNiche(niche);
    } catch (err) {
      console.error(
        "[day24/analyze] generation error:",
        err instanceof Error ? err.message : "Unknown",
      );
      return NextResponse.json(
        { error: "Niche analysis failed. Please try again." },
        { status: 500 },
      );
    }

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error(
      "[day24/analyze] error:",
      error instanceof Error ? error.message : "Unknown",
    );
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
