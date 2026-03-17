import Link from "next/link";
import { Mic, BookOpen, Sparkles } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center gap-8">
      {/* Icon */}
      <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-muted mb-1">
        <BookOpen className="w-7 h-7 md:w-8 md:h-8 text-muted-foreground" />
      </div>

      {/* Headline */}
      <div className="space-y-3 max-w-lg">
        <h1 className="font-serif text-4xl md:text-5xl text-foreground leading-tight">
          Your voice,<br />structured.
        </h1>
        <p className="text-muted-foreground text-base md:text-lg">
          Speak your thoughts. Claude turns them into mood, events, and reflections.
          A journal that listens and understands.
        </p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl w-full text-left">
        {[
          {
            icon: Mic,
            title: "Voice-first",
            desc: "No typing. Just speak naturally.",
          },
          {
            icon: Sparkles,
            title: "AI-structured",
            desc: "Claude finds the emotional truth in your words.",
          },
          {
            icon: BookOpen,
            title: "Private",
            desc: "Your entries are yours. End-to-end secure.",
          },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="rounded-lg border border-border bg-muted/30 p-4 space-y-1.5">
            <div className="flex items-center gap-2">
              <Icon className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">{title}</span>
            </div>
            <p className="text-xs text-muted-foreground">{desc}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <Link
        href="/login"
        className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-medium h-11 px-10 transition-colors hover:bg-primary/80 active:scale-95"
      >
        Start journaling
      </Link>

      <p className="text-xs text-muted-foreground/50">
        Day 1 of 30-in-30 · Built with Claude Code
      </p>
    </div>
  );
}
