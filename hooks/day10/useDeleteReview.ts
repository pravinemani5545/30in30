"use client";

import { useState } from "react";

export function useDeleteReview(onSuccess?: () => void) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function deleteReview(id: string) {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/day10/reviews/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        onSuccess?.();
      }
    } catch {
      // Silent fail
    } finally {
      setIsDeleting(false);
    }
  }

  return { deleteReview, isDeleting };
}
