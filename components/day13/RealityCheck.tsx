"use client";

const REALITY_CHECK_QUESTION =
  "Does this match the customers who have paid you money, or the customers you hope will pay you?";

interface Props {
  text: string;
}

export function RealityCheck({ text }: Props) {
  // Split at the reality check question to style it separately
  const questionIndex = text.lastIndexOf(REALITY_CHECK_QUESTION);
  const body =
    questionIndex > 0 ? text.slice(0, questionIndex).trim() : text;
  const hasQuestion = questionIndex > 0;

  return (
    <div
      className="rounded-md p-4"
      style={{
        backgroundColor: "rgb(232 160 32 / 0.04)",
        borderLeft: "3px solid var(--section-realitycheck)",
      }}
    >
      <h3
        className="text-[11px] font-bold uppercase tracking-[0.1em] mb-3"
        style={{ color: "var(--section-realitycheck)" }}
      >
        Reality Check
      </h3>

      {/* Body paragraphs — italic */}
      <div className="space-y-3">
        {body.split("\n\n").map((paragraph, i) => (
          <p
            key={i}
            className="text-sm italic"
            style={{ color: "var(--foreground)", lineHeight: "1.65" }}
          >
            {paragraph}
          </p>
        ))}
      </div>

      {/* The question — styled distinctly */}
      {hasQuestion && (
        <p
          className="mt-4 text-[15px]"
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 600,
            color: "var(--section-realitycheck)",
            lineHeight: "1.5",
          }}
        >
          {REALITY_CHECK_QUESTION}
        </p>
      )}
    </div>
  );
}
