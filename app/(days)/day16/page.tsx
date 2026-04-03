import { Suspense } from "react";
import { BackToHub } from "@/components/shared/BackToHub";
import { VoiceoverStudio } from "@/components/day16/VoiceoverStudio";

export default function Day16Page() {
  return (
    <div
      data-day="16"
      className="min-h-screen"
      style={{ background: "var(--background)" }}
    >
      <header
        className="flex items-center justify-between border-b px-4 py-3"
        style={{ borderColor: "var(--border)" }}
      >
        <BackToHub label="Back to 30 in 30" />
        <h1
          className="text-lg"
          style={{
            fontFamily: "var(--font-serif)",
            color: "var(--foreground)",
          }}
        >
          VoiceoverStudio
        </h1>
        <div className="w-[120px]" />
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Suspense fallback={null}>
          <VoiceoverStudio />
        </Suspense>
      </main>
    </div>
  );
}
