"use client";

import { motion } from "framer-motion";
import { MoodBadge, MOOD_CONFIG } from "./MoodBadge";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { AnalyzedEntry, Mood } from "@/types/day1";

interface EntryResultProps {
  entry: AnalyzedEntry & { id?: string | null };
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

const significanceBadgeClass: Record<string, string> = {
  high: "bg-rose-500/15 text-rose-300 border-rose-500/30",
  medium: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  low: "bg-zinc-500/15 text-zinc-400 border-zinc-500/30",
};

export function EntryResult({ entry }: EntryResultProps) {
  const moodConfig = MOOD_CONFIG[entry.mood as Mood];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Mood Banner */}
      <motion.div
        variants={item}
        className={[
          "rounded-xl border p-5 space-y-3",
          moodConfig.bgClass,
        ].join(" ")}
      >
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="font-serif text-xl md:text-2xl text-foreground">{entry.entry_title}</h1>
          <MoodBadge mood={entry.mood as Mood} size="lg" />
        </div>
        <p className={`text-sm italic ${moodConfig.colorClass}`}>{entry.mood_summary}</p>
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Intensity</span>
            <span className={moodConfig.colorClass}>{entry.mood_intensity}/10</span>
          </div>
          <Progress value={entry.mood_intensity * 10} className="h-1.5" />
        </div>
      </motion.div>

      {/* Events */}
      {entry.events.length > 0 && (
        <motion.div variants={item} className="space-y-3">
          <h2 className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
            What happened
          </h2>
          <div className="space-y-2">
            {entry.events.map((event, i) => (
              <Card key={i} className="bg-muted/30 border-border">
                <CardContent className="pt-4 pb-3 px-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-foreground">{event.title}</p>
                      <p className="text-xs text-muted-foreground">{event.description}</p>
                    </div>
                    <Badge
                      variant="outline"
                      className={[
                        "shrink-0 text-xs capitalize",
                        significanceBadgeClass[event.significance],
                      ].join(" ")}
                    >
                      {event.significance}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      )}

      {/* Reflections */}
      {entry.reflections.length > 0 && (
        <motion.div variants={item} className="space-y-3">
          <h2 className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
            Reflections
          </h2>
          <div className="space-y-3">
            {entry.reflections.map((ref, i) => (
              <div
                key={i}
                className="border-l-2 border-teal-500/50 pl-4 space-y-1"
              >
                <p className="text-sm text-foreground leading-relaxed italic">
                  &ldquo;{ref.insight}&rdquo;
                </p>
                <p className="text-xs text-teal-400/70 capitalize">{ref.theme}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Gratitude */}
      {entry.gratitude.length > 0 && (
        <motion.div variants={item} className="space-y-3">
          <h2 className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
            Grateful for
          </h2>
          <ul className="space-y-1.5">
            {entry.gratitude.map((g, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                <span className="text-green-400 mt-0.5">✦</span>
                {g}
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Tomorrow's intention */}
      {entry.tomorrow_intention && (
        <motion.div
          variants={item}
          className="rounded-lg border border-teal-500/25 bg-teal-500/10 p-4 space-y-1"
        >
          <p className="text-xs uppercase tracking-widest text-teal-400/70 font-medium">
            Tomorrow&apos;s intention
          </p>
          <p className="text-sm text-teal-200 leading-relaxed">
            {entry.tomorrow_intention}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
