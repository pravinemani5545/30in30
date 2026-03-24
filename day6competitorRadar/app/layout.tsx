import type { Metadata } from 'next'
import { Instrument_Serif, DM_Sans } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const instrumentSerif = Instrument_Serif({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const dmSans = DM_Sans({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'CompetitorRadar — Strategic Competitor Teardown',
  description: "Your competitor's landing page is a strategy document they forgot to password-protect.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`dark ${instrumentSerif.variable} ${dmSans.variable}`}>
      <body className="min-h-screen bg-background font-body text-text-primary antialiased">
        {children}
        <Toaster
          theme="dark"
          toastOptions={{
            style: {
              background: '#1A1A1A',
              border: '1px solid #262626',
              color: '#F5F0E8',
            },
          }}
        />
      </body>
    </html>
  )
}
