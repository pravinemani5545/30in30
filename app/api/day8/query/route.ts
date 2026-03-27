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
    console.log(`[query] question="${question}" doc=${documentId}`);

    // Verify user owns the document
    const { data: doc } = await supabase
      .from("documents")
      .select("id, filename, status")
      .eq("id", documentId)
      .eq("user_id", user.id)
      .single();

    if (!doc) {
      console.log("[query] Document not found or not owned by user");
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    if (doc.status !== "ready") {
      console.log(`[query] Document not ready: status=${doc.status}`);
      return NextResponse.json(
        { error: "Document is still processing" },
        { status: 400 }
      );
    }

    const queryStart = Date.now();

    // Step 1: Embed the question
    console.log("[query] Step 1: Embedding question...");
    const queryEmbedding = await embedSingle(question);
    console.log(`[query] Embedding done. Vector length: ${queryEmbedding.length}`);

    // Step 2: Retrieve chunks
    console.log("[query] Step 2: Retrieving chunks...");
    const chunks = await retrieveChunks(queryEmbedding, documentId, supabase);
    console.log(`[query] Retrieved ${chunks.length} chunks`);

    // Step 3: Handle empty retrieval
    if (chunks.length === 0) {
      console.log("[query] No chunks passed threshold — returning noRelevantContent");
      const queryMs = Date.now() - queryStart;

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

    // Step 4: Build context
    console.log("[query] Step 4: Building context...");
    const ragContext = buildContext(chunks);
    console.log(`[query] Context built: ${ragContext.selectedChunks.length} chunks, ${ragContext.contextString.length} chars`);

    // Step 5: Get answer from Gemini
    console.log("[query] Step 5: Getting answer from Gemini...");
    const answerResult = await getAnswer(ragContext.contextString, question);
    console.log(`[query] Answer received: noRelevant=${answerResult.noRelevantContent} len=${answerResult.answer?.length ?? 0}`);

    const queryMs = Date.now() - queryStart;
    console.log(`[query] Total time: ${queryMs}ms`);

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
