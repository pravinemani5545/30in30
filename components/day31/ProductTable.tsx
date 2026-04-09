"use client";

import { useState, useMemo } from "react";
import type { TrackedProduct } from "@/types/day31";
import { ProductRow } from "./ProductRow";

type SortKey = "product_name" | "current_price" | "availability" | "last_check_at";
type SortDir = "asc" | "desc";

interface ProductTableProps {
  products: TrackedProduct[];
  onCheck: (id: string) => void;
  onEdit: (product: TrackedProduct) => void;
  onHistory: (product: TrackedProduct) => void;
  onDelete: (id: string) => void;
  checkingId: string | null;
}

const HEADERS: { key: SortKey | null; label: string }[] = [
  { key: "product_name", label: "PRODUCT" },
  { key: "current_price", label: "PRICE" },
  { key: null, label: "DELTA" },
  { key: "availability", label: "STATUS" },
  { key: "last_check_at", label: "CHECKS" },
  { key: null, label: "ACTIONS" },
];

export function ProductTable({
  products,
  onCheck,
  onEdit,
  onHistory,
  onDelete,
  checkingId,
}: ProductTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("last_check_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const sorted = useMemo(() => {
    return [...products].sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      const av = a[sortKey];
      const bv = b[sortKey];
      if (av === null && bv === null) return 0;
      if (av === null) return 1;
      if (bv === null) return -1;
      if (typeof av === "string" && typeof bv === "string")
        return av.localeCompare(bv) * dir;
      if (typeof av === "number" && typeof bv === "number")
        return (av - bv) * dir;
      return 0;
    });
  }, [products, sortKey, sortDir]);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#111111", borderBottom: "1px solid #2a2a2a" }}>
            {HEADERS.map((h) => (
              <th
                key={h.label}
                onClick={h.key ? () => handleSort(h.key!) : undefined}
                style={{
                  fontFamily: "var(--font-day31-mono)",
                  fontSize: "11px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "#555",
                  padding: "12px 16px",
                  textAlign: "left",
                  cursor: h.key ? "pointer" : "default",
                  whiteSpace: "nowrap",
                  userSelect: "none",
                  position: "sticky",
                  top: 0,
                  backgroundColor: "#111111",
                  zIndex: 1,
                }}
              >
                {h.label}
                {h.key && sortKey === h.key && (
                  <span style={{ marginLeft: "4px" }}>
                    {sortDir === "asc" ? "\u2191" : "\u2193"}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((product) => (
            <ProductRow
              key={product.id}
              product={product}
              onCheck={onCheck}
              onEdit={onEdit}
              onHistory={onHistory}
              onDelete={onDelete}
              checkingId={checkingId}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
