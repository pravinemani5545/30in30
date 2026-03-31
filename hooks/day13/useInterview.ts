"use client";

import { useState, useCallback } from "react";
import { ICP_QUESTIONS } from "@/lib/day13/icp/questions";
import type { InterviewState } from "@/types/day13";

export function useInterview() {
  const [state, setState] = useState<InterviewState>("idle");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [companyName, setCompanyName] = useState("");

  const startInterview = useCallback((name: string) => {
    setCompanyName(name.trim());
    setState("active");
    setCurrentIndex(0);
    setAnswers({});
  }, []);

  const submitAnswer = useCallback(
    (value: string) => {
      const question = ICP_QUESTIONS[currentIndex];
      if (!question) return;

      const newAnswers = { ...answers, [question.key]: value.trim() };
      setAnswers(newAnswers);

      if (currentIndex < ICP_QUESTIONS.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        setState("submitting");
      }
    },
    [currentIndex, answers],
  );

  const markComplete = useCallback(() => {
    setState("complete");
  }, []);

  const reset = useCallback(() => {
    setState("idle");
    setCurrentIndex(0);
    setAnswers({});
    setCompanyName("");
  }, []);

  return {
    state,
    currentIndex,
    answers,
    companyName,
    currentQuestion: ICP_QUESTIONS[currentIndex],
    totalQuestions: ICP_QUESTIONS.length,
    startInterview,
    submitAnswer,
    markComplete,
    reset,
  };
}
