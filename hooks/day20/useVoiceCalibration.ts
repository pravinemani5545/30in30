"use client";

import { useState, useEffect, useCallback } from "react";
import type { VoiceCalibration } from "@/types/day20";

const STORAGE_KEY = "content-pipeline-voice";

const EMPTY: VoiceCalibration = {
  examplePost: "",
  tone: "",
  vocabUse: "",
  vocabAvoid: "",
};

function hasData(cal: VoiceCalibration): boolean {
  return !!(cal.examplePost || cal.tone || cal.vocabUse || cal.vocabAvoid);
}

export function useVoiceCalibration() {
  const [calibration, setCalibration] = useState<VoiceCalibration>(EMPTY);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setCalibration(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
    setLoaded(true);
  }, []);

  const update = useCallback(
    (partial: Partial<VoiceCalibration>) => {
      setCalibration((prev) => {
        const next = { ...prev, ...partial };
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          // ignore
        }
        return next;
      });
    },
    [],
  );

  const clear = useCallback(() => {
    setCalibration(EMPTY);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  return {
    calibration,
    update,
    clear,
    loaded,
    hasCalibration: hasData(calibration),
  };
}
