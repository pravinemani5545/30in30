import { Resend } from "resend";
import { getServerEnv } from "@/lib/env";
import { PriceDropAlert } from "./templates/PriceDropAlert";
import { BackInStockAlert } from "./templates/BackInStockAlert";
import { UnreachableAlert } from "./templates/UnreachableAlert";

let resendClient: Resend | null = null;

function getResend(): Resend {
  if (resendClient) return resendClient;
  const env = getServerEnv();
  if (!env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is required for Day 31 alerts");
  }
  resendClient = new Resend(env.RESEND_API_KEY);
  return resendClient;
}

export async function sendPriceDropAlert(
  userEmail: string,
  productName: string,
  productUrl: string,
  currentPrice: number,
  targetPrice: number,
  currency: string,
): Promise<void> {
  const env = getServerEnv();
  const fromEmail = env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
  const savings = targetPrice - currentPrice;
  const pct = Math.round((savings / targetPrice) * 100);

  const resend = getResend();
  await resend.emails.send({
    from: `PriceTracker <${fromEmail}>`,
    to: [userEmail],
    subject: `Price drop: ${productName} is now $${currentPrice.toFixed(2)}`,
    react: PriceDropAlert({
      productName,
      productUrl,
      currentPrice,
      targetPrice,
      savings,
      pct,
      currency,
      appUrl: env.NEXT_PUBLIC_APP_URL,
    }),
  });
}

export async function sendBackInStockAlert(
  userEmail: string,
  productName: string,
  productUrl: string,
  currentPrice: number | null,
  targetPrice: number,
  currency: string,
): Promise<void> {
  const env = getServerEnv();
  const fromEmail = env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";

  const resend = getResend();
  await resend.emails.send({
    from: `PriceTracker <${fromEmail}>`,
    to: [userEmail],
    subject: `${productName} is back in stock`,
    react: BackInStockAlert({
      productName,
      productUrl,
      currentPrice,
      targetPrice,
      currency,
      appUrl: env.NEXT_PUBLIC_APP_URL,
    }),
  });
}

export async function sendUnreachableAlert(
  userEmail: string,
  productName: string,
  appUrl: string,
): Promise<void> {
  const env = getServerEnv();
  const fromEmail = env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";

  const resend = getResend();
  await resend.emails.send({
    from: `PriceTracker <${fromEmail}>`,
    to: [userEmail],
    subject: `PriceTracker can't reach ${productName}`,
    react: UnreachableAlert({ productName, appUrl }),
  });
}
