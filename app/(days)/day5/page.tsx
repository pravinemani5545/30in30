import { PitchInput } from "@/components/day5/pitch-input";

export default function Day5Page() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-xl space-y-10">
        <div className="text-center space-y-3">
          <h1 className="font-[family-name:var(--font-display)] text-6xl md:text-7xl text-text-primary">
            PitchDoctor
          </h1>
          <p className="font-[family-name:var(--font-mono)] text-base text-text-muted">
            Your one-liner, dissected.
          </p>
        </div>
        <PitchInput />
      </div>
    </main>
  );
}
