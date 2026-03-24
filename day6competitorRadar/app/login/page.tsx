'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/browser'
import { toast } from 'sonner'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
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
      setLoading(false)
      return
    }

    setSent(true)
    setLoading(false)
  }

  async function handleGoogleSignIn() {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="space-y-3">
          <h1 className="font-display text-4xl text-text-primary">
            CompetitorRadar
          </h1>
          <p className="text-base text-text-secondary leading-relaxed">
            Your competitor&apos;s landing page is a strategy document
            they forgot to password-protect.
          </p>
        </div>

        {sent ? (
          <div className="space-y-4 rounded-lg border border-border bg-surface p-6">
            <p className="text-text-primary">Check your email for a sign-in link.</p>
            <p className="text-sm text-text-secondary">
              Didn&apos;t receive it?{' '}
              <button
                onClick={() => setSent(false)}
                className="text-accent hover:text-accent-hover underline"
              >
                Try again
              </button>
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full rounded-lg border border-border bg-surface-input px-4 py-3 text-text-primary placeholder:text-text-tertiary focus:border-border-focus focus:outline-none"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-accent px-4 py-3 font-medium text-background transition-colors hover:bg-accent-hover disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Sign in with magic link'}
              </button>
            </form>

            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs text-text-tertiary uppercase tracking-wider">or</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <button
              onClick={handleGoogleSignIn}
              className="w-full rounded-lg border border-border bg-surface px-4 py-3 font-medium text-text-primary transition-colors hover:bg-surface-raised"
            >
              Continue with Google
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
