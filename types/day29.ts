export interface CompanyEnrichment {
  name: string;
  industry: string;
  size: string;
  description: string;
  keyProducts: string[];
  painPoints: string[];
  recentNews: string[];
}

export interface OutreachDraft {
  subject: string;
  body: string;
  personalization: string[];
  callToAction: string;
}

export interface EmailSequence {
  emails: Array<{
    day: number;
    subject: string;
    body: string;
    intent: string;
  }>;
  strategy: string;
}

export interface CampaignPreview {
  campaignName: string;
  targetPersona: string;
  totalEmails: number;
  estimatedDuration: string;
  keyMetrics: string[];
  summary: string;
}

export interface PipelineStage<T> {
  name: string;
  status: "pending" | "running" | "complete" | "error";
  data: T | null;
  durationMs: number;
}

export interface PipelineResult {
  enrichment: PipelineStage<CompanyEnrichment>;
  outreach: PipelineStage<OutreachDraft>;
  sequence: PipelineStage<EmailSequence>;
  campaign: PipelineStage<CampaignPreview>;
  totalDurationMs: number;
}
