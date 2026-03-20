import type { SupabaseClient } from "@supabase/supabase-js";
import type { DigestResult, SummarizedStory, Subscriber } from "@/types";
import { fetchTopStories } from "@/lib/hn/api";
import { summarizeAllStories } from "@/lib/claude/summarize";
import { sendDigestEmail } from "@/lib/email/send";

export async function runDigest(
  userId: string,
  supabase: SupabaseClient
): Promise<DigestResult> {
  // 1. Idempotency check
  const today = new Date().toISOString().split("T")[0];
  const scheduledFor = `${today}T07:00:00.000Z`;

  const { data: existing } = await supabase
    .from("digest_runs")
    .select("id")
    .eq("user_id", userId)
    .eq("scheduled_for", scheduledFor)
    .limit(1)
    .single();

  if (existing) {
    return {
      success: true,
      skipped: true,
      reason: "already_ran_today",
      storiesCount: 0,
      sentCount: 0,
      failedCount: 0,
      generationMs: 0,
      runId: existing.id,
    };
  }

  // 2. Create pending run record
  const { data: run, error: runError } = await supabase
    .from("digest_runs")
    .insert({
      user_id: userId,
      status: "pending",
      scheduled_for: scheduledFor,
      subscriber_count: 0,
    })
    .select("id")
    .single();

  if (runError || !run) {
    throw new Error(`Failed to create digest run: ${runError?.message}`);
  }

  const runId = run.id;

  try {
    // 3. Fetch active subscribers
    const { data: subscribers } = await supabase
      .from("subscribers")
      .select("id, user_id, email, name, is_active, created_at, unsubscribe_token")
      .eq("user_id", userId)
      .eq("is_active", true);

    if (!subscribers || subscribers.length === 0) {
      await supabase
        .from("digest_runs")
        .update({ status: "failed", error_message: "No active subscribers" })
        .eq("id", runId);

      return {
        success: false,
        reason: "no_subscribers",
        storiesCount: 0,
        sentCount: 0,
        failedCount: 0,
        generationMs: 0,
        runId,
      };
    }

    await supabase
      .from("digest_runs")
      .update({ subscriber_count: subscribers.length })
      .eq("id", runId);

    // 4. Fetch HN stories
    const stories = await fetchTopStories();

    // 5. Summarize with Claude Haiku
    const start = Date.now();
    const summarized: SummarizedStory[] = await summarizeAllStories(stories);
    const generationMs = Date.now() - start;

    console.log(
      `Digest ${runId}: ${summarized.length} stories summarized in ${generationMs}ms`
    );

    // 6. Store stories in digest run
    await supabase
      .from("digest_runs")
      .update({
        stories_json: summarized,
        status: "sending",
        generation_ms: generationMs,
      })
      .eq("id", runId);

    // 7. Send emails (sequential for Resend rate limit)
    const dateString = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    let sentCount = 0;
    let failedCount = 0;

    for (const subscriber of subscribers as (Subscriber & { unsubscribe_token: string })[]) {
      const result = await sendDigestEmail(subscriber, summarized, dateString);
      if (result.success) {
        sentCount++;
      } else {
        failedCount++;
      }
    }

    // 8. Finalize
    const finalStatus = sentCount === 0 && failedCount > 0 ? "failed" : "sent";

    await supabase
      .from("digest_runs")
      .update({
        status: finalStatus,
        sent_count: sentCount,
        sent_at: new Date().toISOString(),
      })
      .eq("id", runId);

    return {
      success: finalStatus === "sent",
      storiesCount: summarized.length,
      sentCount,
      failedCount,
      generationMs,
      runId,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    await supabase
      .from("digest_runs")
      .update({ status: "failed", error_message: message })
      .eq("id", runId);

    return {
      success: false,
      reason: message,
      storiesCount: 0,
      sentCount: 0,
      failedCount: 0,
      generationMs: 0,
      runId,
    };
  }
}
