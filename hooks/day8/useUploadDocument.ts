"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import type { Document } from "@/types/day8";

export function useUploadDocument() {
  const [isUploading, setIsUploading] = useState(false);

  const upload = useCallback(async (file: File): Promise<Document | null> => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("pdf", file);

      const res = await fetch("/api/day8/documents", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Upload failed");
        return null;
      }

      toast.success("Document uploaded and processed");
      return data as Document;
    } catch {
      toast.error("Upload failed");
      return null;
    } finally {
      setIsUploading(false);
    }
  }, []);

  return { upload, isUploading };
}
