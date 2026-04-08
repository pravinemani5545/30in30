"use client";

export function HeroTerminal() {
  return (
    <div
      style={{
        background: "#161616",
        border: "1px solid #2a2a2a",
      }}
    >
      {/* Top bar */}
      <div
        className="flex items-center gap-2 px-4 py-3"
        style={{
          background: "#1a1a1a",
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
            fontFamily: "var(--font-day20-mono)",
            color: "#555",
          }}
        >
          pipeline.sh
        </span>
      </div>

      {/* Terminal body */}
      <div
        className="p-5 space-y-1"
        style={{
          fontFamily: "var(--font-day20-mono)",
          fontSize: "13px",
          lineHeight: 1.8,
          color: "#999",
        }}
      >
        <div>
          <span style={{ color: "#00FF41" }}>$</span> repurpose --source
          blog_post.md
        </div>
        <div style={{ color: "#555" }}># parsing 1,247 words...</div>
        <div>
          <span style={{ color: "#00FF41" }}>$</span> voice --calibrate
          --tone &quot;direct, no fluff&quot;
        </div>
        <div style={{ color: "#555" }}># matching voice profile...</div>
        <div>
          <span style={{ color: "#00FF41" }}>$</span> generate --all
        </div>
        <div>
          output: <span style={{ color: "#00FF41" }}>summary_card</span>{" "}
          [OK]
        </div>
        <div>
          output: <span style={{ color: "#00FF41" }}>x_thread</span> (12
          tweets) [OK]
        </div>
        <div>
          output: <span style={{ color: "#00FF41" }}>standalone_tweets</span>{" "}
          (4) [OK]
        </div>
        <div>
          output: <span style={{ color: "#00FF41" }}>youtube_description</span>{" "}
          [OK]
        </div>
        <div>
          output: <span style={{ color: "#00FF41" }}>newsletter_section</span>{" "}
          [OK]
        </div>
        <div>
          output: <span style={{ color: "#00FF41" }}>linkedin_post</span>{" "}
          [OK]
        </div>
        <div>
          output: <span style={{ color: "#00FF41" }}>tiktok_captions</span>{" "}
          (3 variants) [OK]
        </div>
        <div className="mt-2">
          <span style={{ color: "#00FF41" }}>$</span>{" "}
          <span
            className="inline-block w-2 h-4 align-middle"
            style={{
              background: "#00FF41",
              animation: "cursor-blink 1s infinite",
            }}
          />
        </div>
      </div>
    </div>
  );
}
