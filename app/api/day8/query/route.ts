import { NextResponse } from "next/server";
import { createSupabaseServer, createServiceClient } from "@/lib/supabase/server";
import { querySchema } from "@/lib/day8/validations/query";
import { embedSingle } from "@/lib/day8/rag/embedder";
import { retrieveChunks } from "@/lib/day8/rag/retriever";
import { buildContext } from "@/lib/day8/rag/contextBuilder";
import { getAnswer } from "@/lib/day8/claude/answer";

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limit: 20 queries per day
    const serviceClient = createServiceClient();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { count } = await serviceClient
      .from("queries")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", today.toISOString());

    if (count !== null && count >= 20) {
      return NextResponse.json(
        { error: "Query limit reached (20 per day). Try again tomorrow." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = querySchema.safeParse(body);

    if (!parsed.success) {
      const issues = parsed.error.issues.map((i) => i.message).join(", ");
      return NextResponse.json({ error: issues }, { status: 400 });
    }

    const { question, documentId } = parsed.data;

    // Verify user owns the document
    const { data: doc } = await supabase
      .from("documents")
      .select("id, filename, status")
      .eq("id", documentId)
      .eq("user_id", user.id)
      .single();

    if (!doc) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    if (doc.status !== "ready") {
      return NextResponse.json(
        { error: "Document is still processing" },
        { status: 400 }
      );
    }

    const queryStart = Date.now();

    // Step 1: Embed the question
    const queryEmbedding = await embedSingle(question);

    // Step 2: Retrieve chunks (Fix 2: threshold-gated)
    const chunks = await retrieveChunks(queryEmbedding, documentId, supabase);

    // Step 3: Handle empty retrieval BEFORE calling Claude
    if (chunks.length === 0) {
      const queryMs = Date.now() - queryStart;

      // Save query record
      await serviceClient.from("queries").insert({
        user_id: user.id,
        document_id: documentId,
        question,
        answer: null,
        sources: [],
        no_relevant_content: true,
        query_ms: queryMs,
      });

      return NextResponse.json({
        answer: null,
        sources: [],
        noRelevantContent: true,
      });
    }

    // Step 4: Build context with budget management (Fix 3)
    const ragContext = buildContext(chunks);

    // Step 5: Get answer from Claude
    const answerResult = await getAnswer(ragContext.contextString, question);

    const queryMs = Date.now() - queryStart;

    // Save query record
    await serviceClient.from("queries").insert({
      user_id: user.id,
      document_id: documentId,
      question,
      answer: answerResult.answer,
      sources: ragContext.selectedChunks,
      no_relevant_content: answerResult.noRelevantContent,
      query_ms: queryMs,
    });

    return NextResponse.json({
      answer: answerResult.answer,
      sources: ragContext.selectedChunks,
      noRelevantContent: answerResult.noRelevantContent,
    });
  } catch (err) {
    console.error("[query] Error:", err);
    return NextResponse.json(
      { error: "Failed to process query" },
      { status: 500 }
    );
  }
}
