"use client";

import { useState, useCallback } from "react";

export function useDeleteProfile() {
  const [deleting, setDeleting] = useState(false);

  const deleteProfile = useCallback(async (id: string): Promise<boolean> => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/day13/profiles/${id}`, { method: "DELETE" });
      return res.ok;
    } catch {
      return false;
    } finally {
      setDeleting(false);
    }
  }, []);

  return { deleteProfile, deleting };
}
