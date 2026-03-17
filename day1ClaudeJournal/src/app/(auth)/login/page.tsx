"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Chrome } from "lucide-react";
import { toast } from "sonner";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
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
      setSent(true);
    }
  }

  async function handleGoogle() {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) toast.error(error.message);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-8">
        {/* Logo */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
            <BookOpen className="w-6 h-6 text-muted-foreground" />
          </div>
          <h1 className="font-serif text-3xl text-foreground">ClaudeJournal</h1>
          <p className="text-sm text-muted-foreground">
            Speak your thoughts. Claude finds the meaning.
          </p>
        </div>

        {sent ? (
          <div className="text-center space-y-3 py-6">
            <div className="text-4xl">✉️</div>
            <p className="text-foreground font-medium">Check your email</p>
            <p className="text-sm text-muted-foreground">
              We sent a magic link to <span className="text-foreground">{email}</span>
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSent(false)}
              className="text-muted-foreground"
            >
              Use a different email
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <form onSubmit={handleMagicLink} className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-muted-foreground text-xs uppercase tracking-wider">
                  Email address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-muted/50 border-border"
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? "Sending…" : "Send magic link"}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-background px-2 text-muted-foreground">or</span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={handleGoogle}
            >
              <Chrome className="w-4 h-4 mr-2" />
              Continue with Google
            </Button>
          </div>
        )}

        <p className="text-center text-xs text-muted-foreground">
          Your journal entries are private and encrypted.
        </p>
      </div>
    </div>
  );
}
