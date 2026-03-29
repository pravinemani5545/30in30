"use client";

import { useState, useCallback } from "react";

interface ImageState {
  loading: boolean;
  url: string | null;
  error: string | null;
}

export function useGenerateImage(conceptSetId: string | null) {
  const [images, setImages] = useState<Record<number, ImageState>>({});

  const generate = useCallback(
    async (conceptIndex: number) => {
      if (!conceptSetId) return;

      setImages((prev) => ({
        ...prev,
        [conceptIndex]: { loading: true, url: null, error: null },
      }));

      try {
        const res = await fetch(
          `/api/day12/concepts/${conceptSetId}/image`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ conceptIndex }),
          },
        );

        const data = await res.json();

        if (!res.ok) {
          setImages((prev) => ({
            ...prev,
            [conceptIndex]: {
              loading: false,
              url: null,
              error: data.error ?? "Failed to generate image",
            },
          }));
          return;
        }

        setImages((prev) => ({
          ...prev,
          [conceptIndex]: { loading: false, url: data.image, error: null },
        }));
      } catch {
        setImages((prev) => ({
          ...prev,
          [conceptIndex]: {
            loading: false,
            url: null,
            error: "Network error",
          },
        }));
      }
    },
    [conceptSetId],
  );

  const reset = useCallback(() => setImages({}), []);

  return { images, generate, reset };
}
