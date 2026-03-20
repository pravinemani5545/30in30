import type { DigestRun } from "@/types";
import StoryCard from "./StoryCard";
import EmptyDigestState from "./EmptyDigestState";

interface LastDigestPreviewProps {
  lastRun: DigestRun | null;
}

export default function LastDigestPreview({ lastRun }: LastDigestPreviewProps) {
  if (!lastRun || !lastRun.stories_json || lastRun.stories_json.length === 0) {
    return <EmptyDigestState />;
  }

  const sentDate = lastRun.sent_at
    ? new Date(lastRun.sent_at).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        timeZone: "UTC",
        timeZoneName: "short",
      })
    : "Pending...";

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-heading text-xl text-text-primary">Last Digest</h2>
        <p className="text-xs text-text-secondary mt-1">
          Sent: {sentDate}
        </p>
      </div>
      <div className="rounded-lg border border-border bg-surface p-4 divide-y divide-border">
        {lastRun.stories_json.map((story, index) => (
          <StoryCard key={story.id} story={story} rank={index + 1} />
        ))}
      </div>
    </div>
  );
}
