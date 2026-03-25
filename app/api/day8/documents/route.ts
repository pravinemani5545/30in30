import { NextResponse } from "next/server";
import { createSupabaseServer, createServiceClient } from "@/lib/supabase/server";
import { parsePdf } from "@/lib/day8/pdf/parse";
import { chunkDocument } from "@/lib/day8/rag/chunker";
import { embedBatch } from "@/lib/day8/rag/embedder";
import { validatePdfFile } from "@/lib/day8/validations/document";

export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limit: 5 uploads per day
    const serviceClient = createServiceClient();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { count } = await serviceClient
      .from("documents")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", today.toISOString());

    if (count !== null && count >= 5) {
      return NextResponse.json(
        { error: "Upload limit reached (5 per day). Try again tomorrow." },
        { status: 429 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("pdf") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const validation = validatePdfFile(file);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Create document record with status='uploading'
    const { data: doc, error: insertError } = await supabase
      .from("documents")
      .insert({
        user_id: user.id,
        filename: file.name,
        file_size_bytes: file.size,
        status: "uploading",
      })
      .select()
      .single();

    if (insertError || !doc) {
      console.error("[upload] Insert error:", insertError);
      return NextResponse.json(
        { error: "Failed to create document record" },
        { status: 500 }
      );
    }

    const docId = doc.id;

    try {
      // Upload to Supabase Storage
      const storagePath = `${user.id}/${docId}/document.pdf`;
      const buffer = Buffer.from(await file.arrayBuffer());

      const { error: storageError } = await serviceClient.storage
        .from("pdf-documents")
        .upload(storagePath, buffer, {
          contentType: "application/pdf",
          upsert: false,
        });

      if (storageError) {
        throw new Error(`Storage upload failed: ${storageError.message}`);
      }

      await serviceClient
        .from("documents")
        .update({ storage_path: storagePath, status: "parsing" })
        .eq("id", docId);

      // Phase 1: Parse PDF
      const parseStart = Date.now();
      const parseResult = await parsePdf(buffer);
      const parseMs = Date.now() - parseStart;

      await serviceClient
        .from("documents")
        .update({
          status: "chunking",
          page_count: parseResult.pageCount,
          word_count: parseResult.wordCount,
          title: parseResult.title,
          parse_ms: parseMs,
        })
        .eq("id", docId);

      // Phase 2: Chunk with overlap
      const chunks = chunkDocument(parseResult.pages);

      await serviceClient
        .from("documents")
        .update({ status: "embedding", chunk_count: chunks.length })
        .eq("id", docId);

      // Phase 3: Embed all chunks
      const embedStart = Date.now();
      const texts = chunks.map((c) => c.content);
      const embeddings = await embedBatch(texts);
      const embedMs = Date.now() - embedStart;

      // Phase 4: Insert chunks into database
      const chunkRows = chunks.map((chunk, i) => ({
        document_id: docId,
        user_id: user.id,
        chunk_index: chunk.chunkIndex,
        page_number: chunk.pageNumber,
        page_start: chunk.pageStart,
        page_end: chunk.pageEnd,
        char_start: chunk.charStart,
        char_end: chunk.charEnd,
        token_count: chunk.tokenCount,
        content: chunk.content,
        embedding: JSON.stringify(embeddings[i]),
      }));

      // Insert in batches of 50 to avoid payload limits
      for (let i = 0; i < chunkRows.length; i += 50) {
        const batch = chunkRows.slice(i, i + 50);
        const { error: chunkError } = await serviceClient
          .from("document_chunks")
          .insert(batch);

        if (chunkError) {
          throw new Error(`Chunk insert failed: ${chunkError.message}`);
        }
      }

      // Phase 5: Mark ready
      await serviceClient
        .from("documents")
        .update({
          status: "ready",
          chunk_count: chunks.length,
          embed_ms: embedMs,
        })
        .eq("id", docId);

      const { data: finalDoc } = await supabase
        .from("documents")
        .select()
        .eq("id", docId)
        .single();

      return NextResponse.json(finalDoc);
    } catch (pipelineError) {
      const message =
        pipelineError instanceof Error
          ? pipelineError.message
          : "Pipeline failed";

      console.error("[upload] Pipeline error:", message);

      await serviceClient
        .from("documents")
        .update({ status: "failed", error_message: message })
        .eq("id", docId);

      return NextResponse.json(
        { error: message },
        { status: 500 }
      );
    }
  } catch (err) {
    console.error("[upload] Unexpected error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

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
      .from("documents")
      .select("id, filename, page_count, chunk_count, status, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
