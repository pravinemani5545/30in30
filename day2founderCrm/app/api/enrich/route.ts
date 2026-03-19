import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";
import { EnrichRequestSchema, extractLinkedInUsername } from "@/lib/validations/enrich";
import { enrichProfile } from "@/lib/enrichment/provider";
import { enrichContact } from "@/lib/claude/enrichContact";
import {
  getCreditsUsed,
  getCreditsRemaining,
  incrementCreditsUsed,
  MONTHLY_CREDIT_LIMIT,
} from "@/lib/enrichment/credits";
import type { EnrichResponse, EnrichRequiresManualPaste, RawProfileData } from "@/types";

const HOURLY_RATE_LIMIT = 10;

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer();

    // Auth
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    // Validate input
    const body = await request.json();
    const parsed = EnrichRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid request" },
        { status: 400 }
      );
    }

    const { linkedinUrl, manualPasteText } = parsed.data;
    const linkedinUsername = extractLinkedInUsername(linkedinUrl);

    // Rate limit: 10 enrichments/user/hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count: recentCount } = await supabase
      .from("enrichment_jobs")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", oneHourAgo);

    if ((recentCount ?? 0) >= HOURLY_RATE_LIMIT) {
      return NextResponse.json(
        { error: "Too many requests. Try again in an hour.", code: "RATE_LIMITED" },
        { status: 429 }
      );
    }

    // Check for cached contact (enriched within last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { data: existingContact } = await supabase
      .from("contacts")
      .select("*, follow_up_suggestions(*)")
      .eq("user_id", user.id)
      .eq("linkedin_url", linkedinUrl)
      .maybeSingle();

    if (existingContact && existingContact.enriched_at > sevenDaysAgo) {
      return NextResponse.json({
        contact: existingContact,
        cached: true,
      } satisfies EnrichResponse);
    }

    // Create enrichment job record
    const { data: job } = await supabase
      .from("enrichment_jobs")
      .insert({
        user_id: user.id,
        contact_id: existingContact?.id ?? null,
        linkedin_url: linkedinUrl,
        status: "running",
        started_at: new Date().toISOString(),
      })
      .select()
      .single();

    const creditsRemaining = await getCreditsRemaining(user.id, supabase);
    const provider = (process.env.ENRICHMENT_PROVIDER ?? "apollo") as "apollo" | "mock";
    const apolloKey = process.env.APOLLO_API_KEY;

    let rawProfile: RawProfileData;

    // If manual paste provided, skip Apollo
    if (manualPasteText) {
      rawProfile = {
        source: "manual_paste",
        fullName: null,
        headline: null,
        location: null,
        photoUrl: null,
        currentTitle: null,
        currentCompany: null,
        companyDomain: null,
        companyIndustry: null,
        companySize: null,
        employmentHistory: [],
        skills: [],
        education: [],
        rawText: manualPasteText.slice(0, 10000),
      };
    } else {
      // Try Apollo / mock
      const providerResult = await enrichProfile(
        linkedinUrl,
        creditsRemaining,
        apolloKey,
        provider
      );

      if ("requiresManualPaste" in providerResult) {
        return NextResponse.json({
          requiresManualPaste: true,
          creditsRemaining: providerResult.creditsRemaining,
        } satisfies EnrichRequiresManualPaste);
      }

      rawProfile = providerResult.data;

      // Increment credits if Apollo consumed one
      if (providerResult.creditsConsumed) {
        await incrementCreditsUsed(user.id, supabase);
      }
    }

    // Call Claude
    let enrichmentResult;
    try {
      enrichmentResult = await enrichContact(rawProfile, existingContact?.id);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      if (msg.includes("timed out") || msg.includes("abort")) {
        await supabase
          .from("enrichment_jobs")
          .update({ status: "failed", error_message: "timeout", completed_at: new Date().toISOString() })
          .eq("id", job?.id);
        return NextResponse.json(
          { error: "Analysis timed out. Please try again.", code: "TIMEOUT" },
          { status: 504 }
        );
      }
      throw err;
    }

    // Upsert contact
    const contactPayload = {
      user_id: user.id,
      linkedin_url: linkedinUrl,
      linkedin_username: linkedinUsername,
      full_name: enrichmentResult.person.fullName || rawProfile.fullName,
      headline: enrichmentResult.person.headline || rawProfile.headline,
      current_title: rawProfile.currentTitle,
      location: enrichmentResult.person.location || rawProfile.location,
      avatar_url: rawProfile.photoUrl,
      company_name: enrichmentResult.company.name || rawProfile.currentCompany,
      company_domain: enrichmentResult.company.domain || rawProfile.companyDomain,
      company_industry: enrichmentResult.company.industry || rawProfile.companyIndustry,
      company_size: enrichmentResult.company.estimatedSize || rawProfile.companySize,
      company_description: enrichmentResult.company.description,
      key_talking_points: enrichmentResult.person.keyTalkingPoints,
      recent_signals: enrichmentResult.company.recentSignals,
      enrichment_source: rawProfile.source,
      enrichment_confidence: enrichmentResult.enrichmentConfidence,
      enrichment_notes: enrichmentResult.enrichmentNotes,
      enriched_at: new Date().toISOString(),
      raw_provider_data: null, // Never store raw Apollo response
      status: existingContact?.status ?? "new",
    };

    const { data: savedContact, error: contactError } = await supabase
      .from("contacts")
      .upsert(contactPayload, { onConflict: "user_id,linkedin_url" })
      .select()
      .single();

    if (contactError || !savedContact) {
      throw new Error(contactError?.message ?? "Failed to save contact");
    }

    // Delete old suggestions, insert new ones
    await supabase
      .from("follow_up_suggestions")
      .delete()
      .eq("contact_id", savedContact.id);

    const { data: suggestions } = await supabase
      .from("follow_up_suggestions")
      .insert(
        enrichmentResult.followUpSuggestions.map((s) => ({
          contact_id: savedContact.id,
          user_id: user.id,
          message_text: s.message,
          tone: s.tone,
        }))
      )
      .select();

    // Update job to completed
    await supabase
      .from("enrichment_jobs")
      .update({
        status: "completed",
        contact_id: savedContact.id,
        source: rawProfile.source,
        completed_at: new Date().toISOString(),
      })
      .eq("id", job?.id);

    return NextResponse.json({
      contact: { ...savedContact, follow_up_suggestions: suggestions ?? [] },
      cached: false,
    } satisfies EnrichResponse);
  } catch (err) {
    console.error("[enrich] Unhandled error:", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
