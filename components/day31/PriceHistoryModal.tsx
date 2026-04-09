"use client";

import { useEffect } from "react";
import type { TrackedProduct } from "@/types/day31";
import { usePriceHistory } from "@/hooks/day31/usePriceHistory";
import { AvailabilityBadge } from "./AvailabilityBadge";
import { PriceSparkline } from "./PriceSparkline";

interface PriceHistoryModalProps {
  product: TrackedProduct;
  onClose: () => void;
}

export function PriceHistoryModal({
  product,
  onClose,
}: PriceHistoryModalProps) {
  const { history, loading, fetch: fetchHistory } = usePriceHistory();

  useEffect(() => {
    fetchHistory(product.id);
  }, [product.id, fetchHistory]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div
        style={{
          width: "600px",
          maxHeight: "80vh",
          backgroundColor: "#111111",
          border: "1px solid #2a2a2a",
          padding: "24px",
          overflowY: "auto",
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <span
              style={{
                fontFamily: "var(--font-day31-mono)",
                fontSize: "11px",
                letterSpacing: "3px",
                textTransform: "uppercase",
                color: "#00FF41",
                opacity: 0.75,
              }}
            >
              PRICE HISTORY
            </span>
            <div
              className="mt-1"
              style={{
                fontFamily: "var(--font-day31-body)",
                fontSize: "16px",
                fontWeight: 500,
                color: "#eee",
              }}
            >
              {product.product_name || "Untitled"}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <AvailabilityBadge status={product.availability} />
            <button
              onClick={onClose}
              style={{
                fontFamily: "var(--font-day31-mono)",
                fontSize: "14px",
                color: "#555",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              X
            </button>
          </div>
        </div>

        {loading ? (
          <div
            className="flex items-center justify-center"
            style={{
              height: "200px",
              fontFamily: "var(--font-day31-mono)",
              fontSize: "12px",
              color: "#555",
            }}
          >
            loading...
          </div>
        ) : (
          <>
            <PriceSparkline
              history={history}
              targetPrice={product.target_price}
            />

            <div className="mt-4" style={{ borderTop: "1px solid #2a2a2a" }}>
              {history.map((entry) => {
                const isSuccess = entry.result === "success";
                const priceDropped =
                  isSuccess &&
                  entry.price !== null &&
                  entry.price <= product.target_price;
                const priceRose =
                  isSuccess &&
                  entry.price !== null &&
                  entry.price > product.target_price;

                return (
                  <div
                    key={entry.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px 12px",
                      borderBottom: "1px solid #2a2a2a",
                      borderLeft: priceDropped
                        ? "2px solid #00FF41"
                        : priceRose
                          ? "2px solid #ff4444"
                          : "2px solid transparent",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-day31-mono)",
                        fontSize: "12px",
                        color: "#555",
                      }}
                    >
                      {new Date(entry.checked_at).toLocaleString()}
                    </span>
                    {isSuccess && entry.price !== null ? (
                      <span
                        style={{
                          fontFamily: "var(--font-day31-mono)",
                          fontSize: "14px",
                          fontWeight: 700,
                          color: priceDropped ? "#00FF41" : "#eee",
                        }}
                      >
                        ${entry.price.toFixed(2)}
                      </span>
                    ) : (
                      <span
                        style={{
                          fontFamily: "var(--font-day31-mono)",
                          fontSize: "12px",
                          color: "#555",
                        }}
                      >
                        {entry.result === "fetch_failed"
                          ? "fetch failed"
                          : "extraction failed"}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
