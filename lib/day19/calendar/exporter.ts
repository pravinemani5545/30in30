import type { PostItem, ContentCalendar } from "@/types/day19";
import { PLATFORM_LABELS, EFFORT_LABELS, FORMAT_LABELS } from "@/types/day19";

function formatRepurposing(post: PostItem, posts: PostItem[]): string {
  const parts: string[] = [];

  if (post.repurposingMap?.parentDayNumber) {
    const parent = posts.find(
      (p) => p.dayNumber === post.repurposingMap?.parentDayNumber,
    );
    if (parent) {
      parts.push(
        `Repurposed from: Day ${parent.dayNumber} (${PLATFORM_LABELS[parent.platform]})`,
      );
    }
  }

  if (post.repurposingMap?.derivedPosts?.length) {
    const derived = post.repurposingMap.derivedPosts
      .map(
        (d) =>
          `Day ${d.dayNumber} (${PLATFORM_LABELS[d.platform as keyof typeof PLATFORM_LABELS] ?? d.platform})`,
      )
      .join(", ");
    parts.push(`Repurposed to: ${derived}`);
  }

  return parts.length > 0 ? parts.join(" | ") : "";
}

export function exportToText(calendar: ContentCalendar): string {
  const lines: string[] = [];
  lines.push(`CONTENT CALENDAR — ${calendar.month_label}`);
  lines.push(`Pillars: ${calendar.pillars.join(", ")}`);
  lines.push(`Perspective: ${calendar.unique_perspective}`);
  lines.push("");

  for (let week = 0; week < 5; week++) {
    const startDay = week * 7 + 1;
    const endDay = Math.min(startDay + 6, 30);
    const weekPosts = calendar.posts.filter(
      (p) => p.dayNumber >= startDay && p.dayNumber <= endDay,
    );

    if (weekPosts.length === 0) continue;

    lines.push(`WEEK ${week + 1} (Days ${startDay}-${endDay})`);
    lines.push("─────────────────");

    for (const post of weekPosts) {
      lines.push(
        `Day ${post.dayNumber} · ${post.dayOfWeek} · ${PLATFORM_LABELS[post.platform]} · ${FORMAT_LABELS[post.format]} · ${EFFORT_LABELS[post.effortLevel]} Effort`,
      );
      lines.push(`Topic: ${post.topic}`);
      lines.push(`Time: ${post.postingTime}`);
      const repurposing = formatRepurposing(post, calendar.posts);
      if (repurposing) {
        lines.push(repurposing);
      }
      if (post.windowViolation) {
        lines.push("⚠ High-effort constraint warning for this window");
      }
      lines.push("");
    }

    lines.push("");
  }

  if (calendar.constraint_violations > 0) {
    lines.push(
      `⚠ ${calendar.constraint_violations} day(s) exceed the 2 high-effort / 7-day window limit.`,
    );
  }
  if (calendar.generic_output_warning) {
    lines.push(
      "⚠ Some topics may be too generic. Consider strengthening your unique angle.",
    );
  }

  return lines.join("\n");
}
