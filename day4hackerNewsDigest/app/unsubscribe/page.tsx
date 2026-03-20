import { Suspense } from "react";
import UnsubscribeContent from "./content";

export default function UnsubscribePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center bg-background">
          <p className="text-text-secondary">Loading...</p>
        </div>
      }
    >
      <UnsubscribeContent />
    </Suspense>
  );
}
