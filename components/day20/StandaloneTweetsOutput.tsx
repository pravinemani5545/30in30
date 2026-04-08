"use client";

interface StandaloneTweetsOutputProps {
  tweets: string[];
}

export function StandaloneTweetsOutput({
  tweets,
}: StandaloneTweetsOutputProps) {
  return (
    <div className="space-y-3">
      {tweets.map((tweet, i) => (
        <div
          key={i}
          className="p-3"
          style={{
            background: "#111111",
            border: "1px solid #2a2a2a",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-day20-body)",
              fontSize: "14px",
              lineHeight: 1.7,
              color: "#999",
            }}
          >
            {tweet}
          </p>
        </div>
      ))}
    </div>
  );
}
