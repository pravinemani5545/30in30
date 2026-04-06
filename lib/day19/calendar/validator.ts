import type { PostItem } from "@/types/day19";
import { MAX_HIGH_EFFORT_PER_WINDOW, WINDOW_SIZE_DAYS, isGenericTopic } from "./arc";

/**
 * Rolling window validation: for each day D, count high-effort posts
 * in [max(1, D-6), D]. If count > 2, mark windowViolation = true.
 */
export function validateRollingWindow(posts: PostItem[]): PostItem[] {
  return posts.map((post) => {
    const windowStart = Math.max(1, post.dayNumber - (WINDOW_SIZE_DAYS - 1));
    const windowEnd = post.dayNumber;

    const highEffortInWindow = posts.filter(
      (p) =>
        p.dayNumber >= windowStart &&
        p.dayNumber <= windowEnd &&
        p.effortLevel === "high",
    ).length;

    return {
      ...post,
      windowViolation: highEffortInWindow > MAX_HIGH_EFFORT_PER_WINDOW,
    };
  });
}

/**
 * Count the number of days that violate the rolling window constraint.
 */
export function countViolations(posts: PostItem[]): number {
  const violatingDays = new Set<number>();
  for (const post of posts) {
    if (post.windowViolation) {
      violatingDays.add(post.dayNumber);
    }
  }
  return violatingDays.size;
}

/**
 * Count topics matching generic patterns.
 */
export function countGenericTopics(posts: PostItem[]): number {
  return posts.filter((p) => isGenericTopic(p.topic)).length;
}
