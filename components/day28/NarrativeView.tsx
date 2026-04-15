"use client";

interface NarrativeViewProps {
  narrative: string;
}

function renderMarkdown(md: string): string {
  let html = md
    // Headers
    .replace(/^### (.+)$/gm, '<h3 style="color:#eeeeee;font-family:var(--font-day28-heading);font-weight:600;font-size:16px;margin:20px 0 8px;">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 style="color:#eeeeee;font-family:var(--font-day28-heading);font-weight:600;font-size:18px;margin:24px 0 10px;">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 style="color:#eeeeee;font-family:var(--font-day28-heading);font-weight:700;font-size:22px;margin:24px 0 12px;">$1</h1>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong style="color:#00FF41;">$1</strong>')
    // Italic
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code style="background:#161616;padding:2px 6px;font-family:var(--font-day28-mono);font-size:13px;color:#00FF41;">$1</code>')
    // Unordered lists
    .replace(/^- (.+)$/gm, '<li style="margin:4px 0;padding-left:4px;">$1</li>')
    // Line breaks
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n/g, '<br/>');

  // Wrap consecutive <li> in <ul>
  html = html.replace(
    /(<li[^>]*>.*?<\/li>(?:<br\/>)?)+/g,
    (match) => `<ul style="list-style:disc;padding-left:20px;margin:8px 0;">${match.replace(/<br\/>/g, "")}</ul>`,
  );

  return html;
}

export function NarrativeView({ narrative }: NarrativeViewProps) {
  return (
    <div
      style={{
        background: "#111111",
        border: "1px solid #2a2a2a",
        borderRadius: 0,
      }}
    >
      {/* Top bar */}
      <div
        className="flex items-center gap-2 px-4 py-3"
        style={{
          background: "#161616",
          borderBottom: "1px solid #2a2a2a",
        }}
      >
        <span
          className="w-3 h-3 inline-block"
          style={{ background: "#ff4444", borderRadius: "50%" }}
        />
        <span
          className="w-3 h-3 inline-block"
          style={{ background: "#FFB800", borderRadius: "50%" }}
        />
        <span
          className="w-3 h-3 inline-block"
          style={{ background: "#22C55E", borderRadius: "50%" }}
        />
        <span
          className="ml-3 text-xs"
          style={{
            fontFamily: "var(--font-day28-mono)",
            color: "#555",
          }}
        >
          changelog.md
        </span>
      </div>

      {/* Content */}
      <div
        className="p-6"
        style={{
          fontFamily: "var(--font-day28-body)",
          fontSize: "14px",
          lineHeight: 1.8,
          color: "#999",
        }}
        dangerouslySetInnerHTML={{ __html: renderMarkdown(narrative) }}
      />
    </div>
  );
}
