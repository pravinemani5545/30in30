"use client";

import { useState } from "react";
import { createBrowserClient } from "@/lib/supabase/browser";
import { Mail, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    const supabase = createBrowserClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });

    if (error) {
      toast.error("Failed to send magic link. Try again.");
    } else {
      setSent(true);
    }
    setLoading(false);
  }

  async function handleGoogle() {
    const supabase = createBrowserClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-2">
          <h1 className="font-[family-name:var(--font-display)] text-4xl text-text-primary">
            PitchDoctor
          </h1>
          <p className="font-[family-name:var(--font-mono)] text-sm text-text-muted">
            Your one-liner, dissected.
          </p>
        </div>

        {sent ? (
          <div className="bg-surface border border-border rounded-lg p-6 text-center space-y-2">
            <Mail className="w-8 h-8 text-accent mx-auto" />
            <p className="text-text-primary text-sm">Check your email</p>
            <p className="text-text-muted text-xs">
              We sent a magic link to <strong className="text-text-secondary">{email}</strong>
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <form onSubmit={handleMagicLink} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-surface border border-border rounded-md px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-accent hover:bg-accent-hover text-background font-medium rounded-md px-4 py-3 text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? "Sending..." : "Send magic link"}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-border" />
              <span className="text-text-muted text-xs">or</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <button
              onClick={handleGoogle}
              className="w-full bg-surface border border-border hover:border-text-muted text-text-primary rounded-md px-4 py-3 text-sm transition-colors"
            >
              Continue with Google
            </button>

            <p className="text-text-muted text-xs text-center">
              Sign in to save your results and track improvement over time.
            </p>
          </div>
        )}

        <div className="text-center">
          <a
            href="/"
            className="text-text-muted text-xs hover:text-text-secondary transition-colors"
          >
            ← Back to PitchDoctor
          </a>
        </div>
      </div>
    </div>
  );
}
