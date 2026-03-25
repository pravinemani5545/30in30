"use client";

export function NoRelevantContentState() {
  return (
    <div className="border-l-2 border-[#555250] pl-4 py-2 space-y-1">
      <p className="text-[#F5F0E8] text-[15px]">
        No relevant content found in this document for that question.
      </p>
      <p className="text-[#8A8580] text-[13px]">
        This means the answer isn&apos;t in the document, not that the AI failed.
      </p>
    </div>
  );
}
