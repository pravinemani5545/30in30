"use client";

import { useState } from "react";
import Link from "next/link";
import type { TrackedProduct } from "@/types/day31";
import { useProducts } from "@/hooks/day31/useProducts";
import { useCheckNow } from "@/hooks/day31/useCheckNow";
import { useEditProduct } from "@/hooks/day31/useEditProduct";
import { StatsBar } from "./StatsBar";
import { ProductTable } from "./ProductTable";
import { EmptyState } from "./EmptyState";
import { AddProductSlideOver } from "./AddProductSlideOver";
import { EditProductModal } from "./EditProductModal";
import { PriceHistoryModal } from "./PriceHistoryModal";

export function PriceTrackerDashboard() {
  const { products, loading, authenticated, refresh } = useProducts();
  const { check, loading: checking } = useCheckNow();
  const { remove } = useEditProduct();

  const [showAdd, setShowAdd] = useState(false);
  const [editProduct, setEditProduct] = useState<TrackedProduct | null>(null);
  const [historyProduct, setHistoryProduct] = useState<TrackedProduct | null>(
    null,
  );
  const [checkingId, setCheckingId] = useState<string | null>(null);

  // Auth gate
  if (!authenticated) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div
          style={{
            fontFamily: "var(--font-day31-heading)",
            fontSize: "24px",
            fontWeight: 700,
            color: "#eee",
            marginBottom: "12px",
          }}
        >
          Sign in to start <span style={{ color: "#00FF41" }}>tracking</span>
        </div>
        <div
          style={{
            fontFamily: "var(--font-day31-body)",
            fontSize: "16px",
            color: "#999",
            marginBottom: "24px",
          }}
        >
          PriceTracker requires an account to save your tracked products.
        </div>
        <Link
          href={`/login?redirectTo=${encodeURIComponent("/day31")}`}
          style={{
            fontFamily: "var(--font-day31-mono)",
            fontSize: "14px",
            fontWeight: 700,
            backgroundColor: "#00FF41",
            color: "#000",
            padding: "16px 32px",
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          [ SIGN IN ]
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div
          style={{
            fontFamily: "var(--font-day31-mono)",
            fontSize: "13px",
            color: "#555",
          }}
        >
          loading products...
        </div>
      </div>
    );
  }

  async function handleCheck(id: string) {
    setCheckingId(id);
    await check(id);
    setCheckingId(null);
    await refresh();
  }

  async function handleDelete(id: string) {
    const ok = window.confirm("Remove this product?");
    if (!ok) return;
    await remove(id);
    await refresh();
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Hero */}
      <div className="text-center py-8">
        <div
          style={{
            fontFamily: "var(--font-day31-mono)",
            fontSize: "11px",
            letterSpacing: "3px",
            textTransform: "uppercase",
            color: "#00FF41",
            opacity: 0.75,
            marginBottom: "12px",
          }}
        >
          DAY 31
        </div>
        <h2
          style={{
            fontFamily: "var(--font-day31-heading)",
            fontSize: "clamp(28px, 5vw, 42px)",
            fontWeight: 700,
            color: "#eee",
            lineHeight: 1.1,
            marginBottom: "8px",
          }}
        >
          Dead-simple <span style={{ color: "#00FF41" }}>price monitoring</span>
        </h2>
        <p
          style={{
            fontFamily: "var(--font-day31-body)",
            fontSize: "16px",
            color: "#999",
            lineHeight: 1.8,
          }}
        >
          Add products. Set target prices. Get notified when prices drop.
        </p>
      </div>

      {products.length === 0 ? (
        <EmptyState onAdd={() => setShowAdd(true)} />
      ) : (
        <>
          <StatsBar products={products} />

          {/* Add button */}
          <div className="flex justify-end py-4">
            <button
              onClick={() => setShowAdd(true)}
              style={{
                fontFamily: "var(--font-day31-mono)",
                fontSize: "12px",
                fontWeight: 700,
                backgroundColor: "#00FF41",
                color: "#000",
                border: "none",
                padding: "10px 20px",
                cursor: "pointer",
                transition: "all 0.25s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#33ff66";
                e.currentTarget.style.boxShadow =
                  "0 0 30px rgba(0,255,65,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#00FF41";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              [ ADD PRODUCT ]
            </button>
          </div>

          <ProductTable
            products={products}
            onCheck={handleCheck}
            onEdit={setEditProduct}
            onHistory={setHistoryProduct}
            onDelete={handleDelete}
            checkingId={checking ? checkingId : null}
          />
        </>
      )}

      {/* Slide-over */}
      <AddProductSlideOver
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onAdded={refresh}
      />

      {/* Edit modal */}
      {editProduct && (
        <EditProductModal
          product={editProduct}
          onClose={() => setEditProduct(null)}
          onSaved={refresh}
        />
      )}

      {/* History modal */}
      {historyProduct && (
        <PriceHistoryModal
          product={historyProduct}
          onClose={() => setHistoryProduct(null)}
        />
      )}
    </div>
  );
}
