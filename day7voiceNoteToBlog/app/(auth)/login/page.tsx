'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/browser'
import { Button } from '@/components/ui/button'
import { Mic, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return

    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      toast.error(error.message)
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  async function handleGoogleLogin() {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)] px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)]">
            <Mic className="h-8 w-8 text-[var(--accent)]" />
          </div>
          <h1 className="font-display text-3xl text-[var(--text-primary)]">
            VoiceNote to Blog
          </h1>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Record your thoughts. Get a structured blog post.
          </p>
        </div>

        {sent ? (
          <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6 text-center">
            <p className="text-[var(--text-primary)]">Check your email</p>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              We sent a magic link to <strong>{email}</strong>
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <Button
              onClick={handleGoogleLogin}
              variant="outline"
              className="w-full border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] hover:bg-[var(--surface-raised)]"
            >
              Continue with Google
            </Button>

            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-[var(--border)]" />
              <span className="text-xs text-[var(--text-tertiary)]">or</span>
              <div className="h-px flex-1 bg-[var(--border)]" />
            </div>

            <form onSubmit={handleMagicLink} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface-input)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--border-focus)] focus:outline-none"
                required
              />
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[var(--accent)] text-black hover:bg-[var(--accent-hover)]"
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Send Magic Link
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
