import type { PreviewResponse } from "@/types";

interface UrlPreviewCardProps {
  preview: PreviewResponse;
  isLoading?: boolean;
}

export function UrlPreviewCard({ preview, isLoading }: UrlPreviewCardProps) {
  if (isLoading) {
    return (
      <div
        className="rounded-lg border p-3 flex items-center gap-3"
        style={{ background: "var(--surface)", borderColor: "var(--border)" }}
      >
        <div className="w-5 h-5 rounded animate-pulse" style={{ background: "var(--surface-raised)" }} />
        <div className="flex-1 space-y-1">
          <div className="h-3 w-40 rounded animate-pulse" style={{ background: "var(--surface-raised)" }} />
          <div className="h-3 w-24 rounded animate-pulse" style={{ background: "var(--surface-raised)" }} />
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-lg border p-3 flex items-start gap-3"
      style={{ background: "var(--surface)", borderColor: "var(--border)" }}
    >
      {/* Favicon */}
      {preview.faviconUrl && (
        <img
          src={preview.faviconUrl}
          alt={preview.domain}
          width={16}
          height={16}
          className="mt-0.5 rounded-sm flex-shrink-0"
          onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
        />
      )}

      <div className="flex-1 min-w-0 space-y-0.5">
        <div className="flex items-center gap-2">
          <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
            {preview.domain}
          </span>
          <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>·</span>
          <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
            {preview.estimatedReadMinutes} min read
          </span>
        </div>
        <p
          className="text-sm font-medium truncate"
          style={{ color: "var(--text-primary)" }}
        >
          {preview.title}
        </p>
        {preview.description && (
          <p
            className="text-xs leading-relaxed line-clamp-2"
            style={{ color: "var(--text-secondary)" }}
          >
            {preview.description.slice(0, 120)}
            {preview.description.length > 120 ? "…" : ""}
          </p>
        )}
      </div>
    </div>
  );
}
