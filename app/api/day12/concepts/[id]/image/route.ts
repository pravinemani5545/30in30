import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";
import { generateThumbnailImage } from "@/lib/day12/ai/image-gen";
import { z } from "zod";
import type { ThumbConcept } from "@/types/day12";

const RequestSchema = z.object({
  conceptIndex: z.number().int().min(0).max(2),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      );
    }

    const parsed = RequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid concept index" },
        { status: 400 },
      );
    }

    const { conceptIndex } = parsed.data;

    const supabase = await createSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: conceptSet, error } = await supabase
      .from("thumbnail_concepts")
      .select("video_title, concepts")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (error || !conceptSet) {
      return NextResponse.json(
        { error: "Concept set not found" },
        { status: 404 },
      );
    }

    const concepts = conceptSet.concepts as ThumbConcept[];
    const concept = concepts[conceptIndex];
    if (!concept) {
      return NextResponse.json(
        { error: "Concept not found at index" },
        { status: 400 },
      );
    }

    const paletteDesc = concept.colourPalette
      .map((c) => `${c.hex} (${c.role})`)
      .join(", ") + ". " + concept.paletteRationale;

    const start = Date.now();
    const base64Image = await generateThumbnailImage(
      concept.conceptName,
      concept.textOverlay,
      concept.compositionSteps,
      paletteDesc,
      conceptSet.video_title,
    );
    const elapsedMs = Date.now() - start;

    console.log(
      `[day12/image] Generated in ${elapsedMs}ms, conceptIndex=${conceptIndex}, userId=${user.id}`,
    );

    return NextResponse.json({
      image: `data:image/png;base64,${base64Image}`,
      conceptIndex,
    });
  } catch (err) {
    console.error(
      "[day12/image] error:",
      err instanceof Error ? err.message : "Unknown",
    );
    return NextResponse.json(
      { error: "Image generation failed. Please try again." },
      { status: 500 },
    );
  }
}
