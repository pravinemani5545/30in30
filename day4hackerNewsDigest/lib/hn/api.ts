import type { HNStory } from "@/types";

const HN_BASE = "https://hacker-news.firebaseio.com/v0";

interface HNItem {
  id: number;
  title: string;
  url?: string;
  score: number;
  by: string;
  descendants?: number;
  time: number;
  type: string;
}

export async function fetchTopStoryIds(): Promise<number[]> {
  const res = await fetch(`${HN_BASE}/topstories.json`, {
    signal: AbortSignal.timeout(5000),
  });
  if (!res.ok) throw new Error(`HN API error: ${res.status}`);
  const ids: number[] = await res.json();
  return ids.slice(0, 10);
}

export async function fetchStory(id: number): Promise<HNStory | null> {
  try {
    const res = await fetch(`${HN_BASE}/item/${id}.json`, {
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    const item: HNItem = await res.json();
    if (!item || item.type !== "story") return null;

    let domain = "";
    if (item.url) {
      try {
        domain = new URL(item.url).hostname.replace(/^www\./, "");
      } catch {
        domain = "";
      }
    }

    return {
      id: item.id,
      title: item.title,
      url: item.url ?? null,
      hnUrl: `https://news.ycombinator.com/item?id=${item.id}`,
      domain,
      score: item.score,
      by: item.by,
      descendants: item.descendants ?? 0,
      time: item.time,
    };
  } catch {
    console.warn(`Failed to fetch story ${id}`);
    return null;
  }
}

export async function fetchTopStories(): Promise<HNStory[]> {
  const ids = await fetchTopStoryIds();
  const results = await Promise.allSettled(ids.map(fetchStory));

  const stories = results
    .filter(
      (r): r is PromiseFulfilledResult<HNStory | null> =>
        r.status === "fulfilled"
    )
    .map((r) => r.value)
    .filter((s): s is HNStory => s !== null);

  if (stories.length < 3) {
    throw new Error(
      `Only ${stories.length} stories fetched — minimum 3 required`
    );
  }

  return stories;
}
