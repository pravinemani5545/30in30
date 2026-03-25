"use client";

import { useSearchParams } from "next/navigation";

export default function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const error = searchParams.get("error");

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4">
      <div className="text-center max-w-sm">
        <h1 className="font-heading text-3xl text-text-primary mb-4">
          HN Digest
        </h1>
        {success && (
          <p className="text-text-secondary">
            You&apos;ve been unsubscribed from HN Digest. You won&apos;t receive
            any more emails.
          </p>
        )}
        {error === "invalid_token" && (
          <p className="text-error">
            Invalid unsubscribe link. It may have already been used.
          </p>
        )}
        {error === "missing_token" && (
          <p className="text-error">
            Missing unsubscribe token. Please use the link from your email.
          </p>
        )}
        {!success && !error && (
          <p className="text-text-secondary">Processing your request...</p>
        )}
      </div>
    </div>
  );
}
