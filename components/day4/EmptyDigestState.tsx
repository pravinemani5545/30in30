import { Newspaper } from "lucide-react";

export default function EmptyDigestState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-surface p-12 text-center">
      <Newspaper className="h-10 w-10 text-text-tertiary mb-4" />
      <h3 className="text-sm font-medium text-text-primary mb-1">
        No digest yet
      </h3>
      <p className="text-xs text-text-secondary max-w-[240px]">
        Add a subscriber and trigger a manual digest, or wait for the 7 AM UTC
        cron to fire.
      </p>
    </div>
  );
}
