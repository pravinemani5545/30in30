import { Resend } from "resend";
import DigestEmail from "@/components/DigestEmail";
import type { Subscriber, SummarizedStory } from "@/types";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

export async function sendDigestEmail(
  subscriber: Subscriber & { unsubscribe_token: string },
  stories: SummarizedStory[],
  dateString: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const unsubscribeUrl = `${appUrl}/api/unsubscribe?token=${subscriber.unsubscribe_token}`;

  const subject = `HN Digest — ${dateString} — ${stories.length} stories for AI builders`;

  try {
    const { data, error } = await getResend().emails.send({
      from: "HN Digest <digest@pravinemani.com>",
      to: subscriber.email,
      subject,
      react: DigestEmail({ stories, dateString, unsubscribeUrl }),
    });

    if (error) {
      console.error(`Email send failed for subscriber ${subscriber.id}:`, error.message);
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`Email send failed for subscriber ${subscriber.id}:`, message);
    return { success: false, error: message };
  }
}
