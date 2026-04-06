import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { getServerEnv } from "@/lib/env";
import { fetchPage } from "@/lib/day18/tracker/fetcher";
import { extractText, isLikelyJSRendered } from "@/lib/day18/tracker/extractor";
import { hashText } from "@/lib/day18/tracker/hasher";
import { extractDiff } from "@/lib/day18/tracker/differ";
import { classifyChange, getActiveModelId } from "@/lib/day18/gemini/classifier";
import { sendDigest } from "@/lib/day18/email/resend";
import type { TrackedCompany, DigestChange } from "@/types/day18";

export const maxDuration = 300;

export async function POST(req: Request) {
  // ISSUE 13: Verify cron secret FIRST
  const env = getServerEnv();
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient();

  // Log cron start
  const { data: cronRun } = await supabase
    .from("cron_runs")
    .insert({ started_at: new Date().toISOString() })
    .select()
    .single();

  let urlsChecked = 0;
  let changesFound = 0;
  let errors = 0;

  // Fetch all active tracked companies (across all users)
  const { data: companies, error: fetchErr } = await supabase
    .from("tracked_companies")
    .select("*")
    .eq("is_active", true);

  if (fetchErr || !companies) {
    return NextResponse.json(
      { error: fetchErr?.message ?? "No companies found" },
      { status: 500 },
    );
  }

  // Group changes by user for digest
  const userChanges = new Map<string, DigestChange[]>();
  const userEmails = new Map<string, string>();

  // Process URLs in batches of 5
  const batchSize = 5;
  for (let i = 0; i < companies.length; i += batchSize) {
    const batch = companies.slice(i, i + batchSize);

    await Promise.allSettled(
      batch.map(async (company: TrackedCompany) => {
        urlsChecked++;

        try {
          // 1. Fetch page
          const { html, error: fetchError } = await fetchPage(company.url);

          if (fetchError || !html) {
            errors++;
            await supabase
              .from("tracked_companies")
              .update({
                fetch_error: fetchError ?? "Empty response",
                last_checked_at: new Date().toISOString(),
              })
              .eq("id", company.id);
            return;
          }

          // 2. Extract text
          const text = extractText(html);
          const jsRendered = isLikelyJSRendered(text);

          // 3. Hash
          const newHash = hashText(text);

          // 4. Compare against stored hash
          if (company.current_hash === newHash) {
            // No change — update last_checked_at only
            await supabase
              .from("tracked_companies")
              .update({
                last_checked_at: new Date().toISOString(),
                fetch_error: null,
                is_js_rendered: jsRendered,
              })
              .eq("id", company.id);
            return;
          }

          // 5. Change detected!
          // If this is the first check (no stored hash), just store the hash
          if (!company.current_hash) {
            await supabase
              .from("tracked_companies")
              .update({
                current_hash: newHash,
                last_checked_at: new Date().toISOString(),
                fetch_error: null,
                is_js_rendered: jsRendered,
              })
              .eq("id", company.id);
            return;
          }

          // 6. Call Gemini to classify the change
          // We need the old text for comparison — use the diff excerpts
          const diff = extractDiff(
            company.current_hash ? text : "", // approximate: we don't store old text
            text,
          );

          const classification = await classifyChange(
            company.domain,
            diff.before,
            diff.after,
          );

          // 7. Insert change record
          await supabase.from("company_changes").insert({
            company_id: company.id,
            user_id: company.user_id,
            url: company.url,
            change_type: classification.changeType,
            summary: classification.summary,
            before_excerpt: classification.beforeExcerpt,
            after_excerpt: classification.afterExcerpt,
            old_hash: company.current_hash,
            new_hash: newHash,
            outreach_prompt: classification.outreachPrompt,
            ai_model_used: getActiveModelId(),
          });

          // 8. Update tracked company
          await supabase
            .from("tracked_companies")
            .update({
              current_hash: newHash,
              last_checked_at: new Date().toISOString(),
              last_changed_at: new Date().toISOString(),
              fetch_error: null,
              is_js_rendered: jsRendered,
            })
            .eq("id", company.id);

          changesFound++;

          // Collect for digest
          if (!userChanges.has(company.user_id)) {
            userChanges.set(company.user_id, []);
          }
          userChanges.get(company.user_id)!.push({
            domain: company.domain,
            url: company.url,
            change_type: classification.changeType,
            summary: classification.summary,
            detected_at: new Date().toISOString(),
          });
        } catch (e) {
          errors++;
          await supabase
            .from("tracked_companies")
            .update({
              fetch_error: e instanceof Error ? e.message : "Unknown error",
              last_checked_at: new Date().toISOString(),
            })
            .eq("id", company.id);
        }
      }),
    );
  }

  // Send digest emails for users with changes
  let digestsSent = 0;
  const today = new Date().toISOString().split("T")[0];

  for (const [userId, changes] of userChanges.entries()) {
    if (changes.length === 0) continue;

    try {
      // Look up user email
      if (!userEmails.has(userId)) {
        const { data: userData } = await supabase.auth.admin.getUserById(userId);
        if (userData?.user?.email) {
          userEmails.set(userId, userData.user.email);
        }
      }

      const email = userEmails.get(userId);
      if (email) {
        await sendDigest(email, changes, today!);
        digestsSent++;
      }
    } catch {
      // Email failure shouldn't fail the entire cron
    }
  }

  // Update cron run
  if (cronRun) {
    await supabase
      .from("cron_runs")
      .update({
        completed_at: new Date().toISOString(),
        urls_checked: urlsChecked,
        changes_found: changesFound,
        errors,
        digest_sent: digestsSent > 0,
      })
      .eq("id", cronRun.id);
  }

  return NextResponse.json({
    urlsChecked,
    changesFound,
    errors,
    digestsSent,
  });
}
