export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div
        className="text-5xl mb-4"
        style={{ fontFamily: "var(--font-serif)", color: "var(--text-tertiary)" }}
      >
        ✍
      </div>
      <h2
        className="text-xl mb-2"
        style={{ fontFamily: "var(--font-serif)", color: "var(--text-primary)" }}
      >
        Paste a blog post URL above
      </h2>
      <p className="text-sm max-w-xs" style={{ color: "var(--text-secondary)" }}>
        TweetCraft extracts the article and generates 5 tweet variations — each a different
        strategic type.
      </p>
      <p className="text-xs mt-4" style={{ color: "var(--text-tertiary)" }}>
        Try: <span style={{ color: "var(--accent)" }}>paulgraham.com/genius.html</span>
      </p>
    </div>
  );
}
