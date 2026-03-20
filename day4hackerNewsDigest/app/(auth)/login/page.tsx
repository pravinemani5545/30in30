"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    const supabase = createClient();
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
      toast.success("Check your email for the magic link");
    }
  }

  async function handleGoogleLogin() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="font-heading text-4xl text-text-primary">HN Digest</h1>
          <p className="mt-3 text-sm text-text-secondary">
            The 10 Hacker News stories that matter for AI builders. Every morning.
          </p>
        </div>

        <form onSubmit={handleMagicLink} className="space-y-4">
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-11 border-border bg-surface-input text-text-primary placeholder:text-text-tertiary focus:border-amber focus:ring-amber"
          />
          <Button
            type="submit"
            disabled={loading}
            className="h-11 w-full bg-amber text-background hover:bg-amber-hover font-medium"
          >
            {loading ? "Sending..." : "Send magic link"}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-background px-3 text-text-tertiary">
              or continue with
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={handleGoogleLogin}
          className="h-11 w-full border-border bg-surface text-text-primary hover:bg-surface-raised"
        >
          Google
        </Button>
      </div>
    </div>
  );
}
