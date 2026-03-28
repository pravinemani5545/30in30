"use client";

import { useState, useCallback } from "react";
import type { EmailGrade } from "@/types/day11";

interface UseGradeReturn {
  grade: EmailGrade | null;
  isLoading: boolean;
  error: string | null;
  gradeEmail: (email: string) => Promise<void>;
  reset: () => void;
}

export function useGrade(): UseGradeReturn {
  const [grade, setGrade] = useState<EmailGrade | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const gradeEmail = useCallback(async (email: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/day11/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      setGrade(data.grade);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setGrade(null);
    setError(null);
  }, []);

  return { grade, isLoading, error, gradeEmail, reset };
}
