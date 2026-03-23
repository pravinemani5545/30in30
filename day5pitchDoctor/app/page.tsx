import { PitchInput } from "@/components/pitch-input";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center px-4 pt-32 pb-16">
      <div className="w-full max-w-lg space-y-8">
        <div className="text-center space-y-2">
          <h1 className="font-[family-name:var(--font-display)] text-5xl text-text-primary">
            PitchDoctor
          </h1>
          <p className="font-[family-name:var(--font-mono)] text-sm text-text-muted">
            Your one-liner, dissected.
          </p>
        </div>
        <PitchInput />
      </div>
    </main>
  );
}
