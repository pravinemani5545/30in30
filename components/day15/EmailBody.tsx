"use client";

import { Fragment } from "react";
import { SlotHighlight } from "./SlotHighlight";

const SLOT_REGEX = /\{\{([a-z_]+)\}\}/g;

export function EmailBody({ body }: { body: string }) {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  const regex = new RegExp(SLOT_REGEX);
  while ((match = regex.exec(body)) !== null) {
    if (match.index > lastIndex) {
      parts.push(body.slice(lastIndex, match.index));
    }
    parts.push(<SlotHighlight key={match.index} name={match[1]} />);
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < body.length) {
    parts.push(body.slice(lastIndex));
  }

  return (
    <div
      className="whitespace-pre-wrap text-sm leading-[1.7]"
      style={{ color: "var(--foreground)", fontFamily: "var(--font-sans)" }}
    >
      {parts.map((part, i) => (
        <Fragment key={i}>{part}</Fragment>
      ))}
    </div>
  );
}
