"use client";

import { useState } from "react";
import { createSupabaseBrowser } from "@/lib/supabase/browser";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const supabase = createSupabaseBrowser();

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setLoading(false);

    if (error) {
      toast.error(error.message);
    } else {
      setSent(true);
    }
  }

  async function handleGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) toast.error(error.message);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "var(--background)" }}>
      <div className="w-full max-w-sm">
        {/* Logo / wordmark */}
        <div className="mb-10 text-center">
          <h1
            className="text-3xl font-normal mb-2"
            style={{ fontFamily: "var(--font-serif)", color: "var(--foreground)" }}
          >
            FounderCRM
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
            Built for teams of one.
          </p>
        </div>

        {sent ? (
          <div
            className="text-center p-6 rounded-lg"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
            }}
          >
            <div className="text-2xl mb-3">✉️</div>
            <p style={{ color: "var(--foreground)", marginBottom: "8px", fontWeight: 500 }}>
              Check your email
            </p>
            <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
              We sent a magic link to <strong>{email}</strong>
            </p>
          </div>
        ) : (
          <div
            className="p-6 rounded-lg"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
            }}
          >
            <form onSubmit={handleMagicLink} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  style={{ color: "var(--text-secondary)", fontSize: "13px", display: "block", marginBottom: "6px" }}
                >
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  suppressHydrationWarning
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    background: "var(--background)",
                    border: "1px solid var(--border)",
                    borderRadius: "6px",
                    color: "var(--foreground)",
                    fontSize: "14px",
                    outline: "none",
                  }}
                  className="transition-colors focus:border-[color:var(--accent)]"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !email.trim()}
                suppressHydrationWarning
                style={{
                  width: "100%",
                  padding: "10px 16px",
                  background: loading ? "var(--surface-raised)" : "var(--accent)",
                  color: loading ? "var(--text-secondary)" : "var(--background)",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "14px",
                  fontWeight: 500,
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "background 150ms",
                }}
              >
                {loading ? "Sending..." : "Send Magic Link →"}
              </button>
            </form>

            <div
              className="flex items-center gap-3 my-5"
              style={{ color: "var(--text-tertiary)", fontSize: "12px" }}
            >
              <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
              or
              <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
            </div>

            <button
              onClick={handleGoogle}
              style={{
                width: "100%",
                padding: "10px 16px",
                background: "var(--background)",
                border: "1px solid var(--border)",
                borderRadius: "6px",
                color: "var(--foreground)",
                fontSize: "14px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                transition: "border-color 150ms",
              }}
              className="hover:border-[color:var(--text-secondary)]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
