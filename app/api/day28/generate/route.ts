import { NextResponse } from "next/server";
import { gitLogInputSchema } from "@/lib/day28/validations";
import { generateChangelog } from "@/lib/day28/generate";

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

    const parsed = gitLogInputSchema.safeParse(body);
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      return NextResponse.json(
        { error: firstIssue?.message ?? "Invalid input" },
        { status: 400 },
      );
    }

    const { gitLog } = parsed.data;

    let changelog;
    try {
      changelog = await generateChangelog(gitLog);
    } catch (err) {
      console.error(
        "[day28/generate] generation error:",
        err instanceof Error ? err.message : "Unknown",
      );
      return NextResponse.json(
        { error: "Changelog generation failed. Please try again." },
        { status: 500 },
      );
    }

    return NextResponse.json({ changelog });
  } catch (error) {
    console.error(
      "[day28/generate] error:",
      error instanceof Error ? error.message : "Unknown",
    );
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
