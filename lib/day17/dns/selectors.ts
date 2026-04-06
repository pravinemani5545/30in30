export const DKIM_SELECTORS: string[] = [
  // Google Workspace / Gmail (date-based selectors)
  "google",
  "20230601",
  "20221208",
  "20210112",
  "20161025",
  // Microsoft 365
  "selector1",
  "selector2",
  // Klaviyo
  "klaviyo1",
  "klaviyo2",
  // Mailchimp / Mandrill
  "k1",
  "k2",
  "k3",
  // SendGrid
  "s1",
  "s2",
  "em",
  // HubSpot
  "hs1",
  "hs2",
  // Postmark
  "pm",
  // Mailgun
  "mx",
  "smtp",
  // ActiveCampaign
  "ac",
  // Generic / common custom selectors
  "mail",
  "dkim",
  "email",
  "default",
];

export interface DKIMSelectorResult {
  selector: string;
  found: boolean;
  record: string | null;
}
