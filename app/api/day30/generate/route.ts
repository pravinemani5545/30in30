import { NextResponse } from "next/server";
import { topicInputSchema } from "@/lib/day30/validations";
import { generateYouTubePackage } from "@/lib/day30/package";

export const maxDuration = 120;

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      );
    }

    const parsed = topicInputSchema.safeParse(body);
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      return NextResponse.json(
        { error: firstIssue?.message ?? "Invalid input" },
        { status: 400 },
      );
    }

    const { topic } = parsed.data;

    let result;
    try {
      result = await generateYouTubePackage(topic);
    } catch (err) {
      console.error(
        "[day30/generate] generation error:",
        err instanceof Error ? err.message : "Unknown",
      );
      return NextResponse.json(
        { error: "Package generation failed. Please try again." },
        { status: 500 },
      );
    }

    return NextResponse.json({ package: result });
  } catch (error) {
    console.error(
      "[day30/generate] error:",
      error instanceof Error ? error.message : "Unknown",
    );
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
