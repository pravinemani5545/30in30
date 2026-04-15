import { NextResponse } from "next/server";
import { companyInputSchema } from "@/lib/day29/validations";
import { enrichCompany } from "@/lib/day29/pipeline/enrichment";
import { generateOutreach } from "@/lib/day29/pipeline/outreach";
import { generateSequence } from "@/lib/day29/pipeline/sequence";
import { generateCampaign } from "@/lib/day29/pipeline/campaign";
import type {
  PipelineResult,
  CompanyEnrichment,
  OutreachDraft,
  EmailSequence,
  CampaignPreview,
} from "@/types/day29";

export const maxDuration = 120;

function pendingEnrichment(name: string, status: "pending" | "error", durationMs: number) {
  return { name, status, data: null as CompanyEnrichment | null, durationMs };
}
function pendingOutreach(name: string, status: "pending" | "error", durationMs: number) {
  return { name, status, data: null as OutreachDraft | null, durationMs };
}
function pendingSequence(name: string, status: "pending" | "error", durationMs: number) {
  return { name, status, data: null as EmailSequence | null, durationMs };
}
function pendingCampaign(name: string, status: "pending" | "error", durationMs: number) {
  return { name, status, data: null as CampaignPreview | null, durationMs };
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      );
    }

    const parsed = companyInputSchema.safeParse(body);
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      return NextResponse.json(
        { error: firstIssue?.message ?? "Invalid input" },
        { status: 400 },
      );
    }

    const { companyInput } = parsed.data;
    const pipelineStart = Date.now();

    // Stage 1: Company Enrichment
    let enrichmentData;
    const enrichStart = Date.now();
    try {
      enrichmentData = await enrichCompany(companyInput);
    } catch (err) {
      console.error(
        "[day29/pipeline] enrichment error:",
        err instanceof Error ? err.message : "Unknown",
      );
      const result: PipelineResult = {
        enrichment: pendingEnrichment("Company Enrichment", "error", Date.now() - enrichStart),
        outreach: pendingOutreach("Outreach Draft", "pending", 0),
        sequence: pendingSequence("Email Sequence", "pending", 0),
        campaign: pendingCampaign("Campaign Preview", "pending", 0),
        totalDurationMs: Date.now() - pipelineStart,
      };
      return NextResponse.json(
        { error: "Company enrichment failed. Please try again.", result },
        { status: 500 },
      );
    }
    const enrichDuration = Date.now() - enrichStart;

    // Stage 2: Outreach Draft
    let outreachData;
    const outreachStart = Date.now();
    try {
      outreachData = await generateOutreach(enrichmentData);
    } catch (err) {
      console.error(
        "[day29/pipeline] outreach error:",
        err instanceof Error ? err.message : "Unknown",
      );
      const result: PipelineResult = {
        enrichment: { name: "Company Enrichment", status: "complete", data: enrichmentData, durationMs: enrichDuration },
        outreach: pendingOutreach("Outreach Draft", "error", Date.now() - outreachStart),
        sequence: pendingSequence("Email Sequence", "pending", 0),
        campaign: pendingCampaign("Campaign Preview", "pending", 0),
        totalDurationMs: Date.now() - pipelineStart,
      };
      return NextResponse.json(
        { error: "Outreach generation failed. Please try again.", result },
        { status: 500 },
      );
    }
    const outreachDuration = Date.now() - outreachStart;

    // Stage 3: Email Sequence
    let sequenceData;
    const sequenceStart = Date.now();
    try {
      sequenceData = await generateSequence(enrichmentData, outreachData);
    } catch (err) {
      console.error(
        "[day29/pipeline] sequence error:",
        err instanceof Error ? err.message : "Unknown",
      );
      const result: PipelineResult = {
        enrichment: { name: "Company Enrichment", status: "complete", data: enrichmentData, durationMs: enrichDuration },
        outreach: { name: "Outreach Draft", status: "complete", data: outreachData, durationMs: outreachDuration },
        sequence: pendingSequence("Email Sequence", "error", Date.now() - sequenceStart),
        campaign: pendingCampaign("Campaign Preview", "pending", 0),
        totalDurationMs: Date.now() - pipelineStart,
      };
      return NextResponse.json(
        { error: "Email sequence generation failed. Please try again.", result },
        { status: 500 },
      );
    }
    const sequenceDuration = Date.now() - sequenceStart;

    // Stage 4: Campaign Preview
    let campaignData;
    const campaignStart = Date.now();
    try {
      campaignData = await generateCampaign(enrichmentData, sequenceData);
    } catch (err) {
      console.error(
        "[day29/pipeline] campaign error:",
        err instanceof Error ? err.message : "Unknown",
      );
      const result: PipelineResult = {
        enrichment: { name: "Company Enrichment", status: "complete", data: enrichmentData, durationMs: enrichDuration },
        outreach: { name: "Outreach Draft", status: "complete", data: outreachData, durationMs: outreachDuration },
        sequence: { name: "Email Sequence", status: "complete", data: sequenceData, durationMs: sequenceDuration },
        campaign: pendingCampaign("Campaign Preview", "error", Date.now() - campaignStart),
        totalDurationMs: Date.now() - pipelineStart,
      };
      return NextResponse.json(
        { error: "Campaign preview generation failed. Please try again.", result },
        { status: 500 },
      );
    }
    const campaignDuration = Date.now() - campaignStart;

    const result: PipelineResult = {
      enrichment: { name: "Company Enrichment", status: "complete", data: enrichmentData, durationMs: enrichDuration },
      outreach: { name: "Outreach Draft", status: "complete", data: outreachData, durationMs: outreachDuration },
      sequence: { name: "Email Sequence", status: "complete", data: sequenceData, durationMs: sequenceDuration },
      campaign: { name: "Campaign Preview", status: "complete", data: campaignData, durationMs: campaignDuration },
      totalDurationMs: Date.now() - pipelineStart,
    };

    return NextResponse.json({ result });
  } catch (error) {
    console.error(
      "[day29/pipeline] error:",
      error instanceof Error ? error.message : "Unknown",
    );
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
