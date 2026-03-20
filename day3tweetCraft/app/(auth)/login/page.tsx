"use client";

import { useState } from "react";
import { createSupabaseBrowser } from "@/lib/supabase/browser";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    const supabase = createSupabaseBrowser();
    const { error } = await supabase.auth.signInWithOtp({
      email,
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
    const supabase = createSupabaseBrowser();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) toast.error(error.message);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--background)" }}>
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1
            className="text-4xl mb-2"
            style={{ fontFamily: "var(--font-serif)", color: "var(--text-primary)" }}
          >
            TweetCraft
          </h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Turn any blog post into 5 tweet variations in seconds.
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-xl p-6 border"
          style={{ background: "var(--surface)", borderColor: "var(--border)" }}
        >
          {sent ? (
            <div className="text-center py-4">
              <p className="text-sm mb-1" style={{ color: "var(--text-primary)" }}>
                Check your email
              </p>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                We sent a magic link to <strong>{email}</strong>
              </p>
            </div>
          ) : (
            <>
              <form onSubmit={handleMagicLink} className="space-y-3">
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-lg text-sm border outline-none transition-colors"
                  style={{
                    background: "var(--surface-input)",
                    borderColor: "var(--border)",
                    color: "var(--text-primary)",
                  }}
                />
                <button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                  style={{
                    background: "var(--accent)",
                    color: "#0C0C0C",
                  }}
                >
                  {loading ? "Sending..." : "Send magic link"}
                </button>
              </form>

              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
                <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>or</span>
                <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
              </div>

              <button
                onClick={handleGoogle}
                className="w-full py-2 rounded-lg text-sm font-medium border transition-colors"
                style={{
                  background: "transparent",
                  borderColor: "var(--border)",
                  color: "var(--text-primary)",
                }}
              >
                Continue with Google
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
