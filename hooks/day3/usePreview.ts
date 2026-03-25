"use client";

import { useState, useEffect, useRef } from "react";
import type { PreviewResponse } from "@/types/day3";

function isValidUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export function usePreview(url: string) {
  const [previewData, setPreviewData] = useState<PreviewResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastFetchedUrl = useRef<string>("");

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (!url || !isValidUrl(url)) {
      setPreviewData(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    if (url === lastFetchedUrl.current) return;

    debounceRef.current = setTimeout(async () => {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `/api/day3/preview?url=${encodeURIComponent(url)}`
        );
        const data = await res.json() as PreviewResponse | { error: string };

        if (!res.ok || "error" in data) {
          setPreviewData(null);
          setError("error" in data ? data.error : "Could not fetch preview");
        } else {
          setPreviewData(data);
          lastFetchedUrl.current = url;
        }
      } catch {
        setPreviewData(null);
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [url]);

  return { previewData, isLoading, error };
}
