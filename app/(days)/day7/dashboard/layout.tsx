import { Mic } from 'lucide-react'
import Link from 'next/link'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)]">
      <header className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
        <Link href="/day7/dashboard" className="flex items-center gap-2">
          <Mic className="h-5 w-5 text-[var(--accent)]" />
          <span className="font-display text-lg text-[var(--text-primary)]">
            VoiceNote to Blog
          </span>
        </Link>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  )
}
