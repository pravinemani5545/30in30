import { Resend } from "resend";
import { getServerEnv } from "@/lib/env";
import { DigestEmail } from "./digest";
import type { DigestChange } from "@/types/day18";

let resendClient: Resend | null = null;

function getResend(): Resend {
  if (resendClient) return resendClient;
  const env = getServerEnv();
  if (!env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is required for Day 18 digest");
  }
  resendClient = new Resend(env.RESEND_API_KEY);
  return resendClient;
}

export async function sendDigest(
  userEmail: string,
  changes: DigestChange[],
  date: string,
): Promise<void> {
  const env = getServerEnv();
  const fromEmail = env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";

  const subject =
    changes.length > 0
      ? `CompanyTracker: ${changes.length} change${changes.length > 1 ? "s" : ""} detected — ${date}`
      : `CompanyTracker: All quiet today — ${date}`;

  const resend = getResend();

  await resend.emails.send({
    from: `CompanyTracker <${fromEmail}>`,
    to: [userEmail],
    subject,
    react: DigestEmail({ changes, date }),
  });
}
