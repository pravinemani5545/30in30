"use client";

import { useState, useEffect, useCallback } from "react";

interface GradeHistoryItem {
  id: string;
  overall_score: number;
  gate_passed: boolean;
  original_email: string;
  created_at: string;
}

interface UseGradesReturn {
  grades: GradeHistoryItem[];
  isLoading: boolean;
  refresh: () => void;
}

export function useGrades(): UseGradesReturn {
  const [grades, setGrades] = useState<GradeHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchGrades = useCallback(async () => {
    try {
      const res = await fetch("/api/day11/grades");
      if (res.ok) {
        const data = await res.json();
        setGrades(data.grades ?? []);
      }
    } catch {
      // Silently fail — history is not critical
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGrades();
  }, [fetchGrades]);

  return { grades, isLoading, refresh: fetchGrades };
}
