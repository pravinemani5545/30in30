"use client";

import { useState } from "react";
import type { TrackedProduct } from "@/types/day31";
import { useEditProduct } from "@/hooks/day31/useEditProduct";

interface EditProductModalProps {
  product: TrackedProduct;
  onClose: () => void;
  onSaved: () => void;
}

export function EditProductModal({
  product,
  onClose,
  onSaved,
}: EditProductModalProps) {
  const { edit, loading, error } = useEditProduct();
  const [targetPrice, setTargetPrice] = useState(
    product.target_price.toString(),
  );
  const [notifyPriceDrop, setNotifyPriceDrop] = useState(
    product.notify_price_drop,
  );
  const [notifyBackInStock, setNotifyBackInStock] = useState(
    product.notify_back_in_stock,
  );
  const [productName, setProductName] = useState(product.product_name || "");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const price = parseFloat(targetPrice);
    if (isNaN(price) || price <= 0) return;

    const result = await edit(product.id, {
      targetPrice: price,
      frequency: "1x",
      notifyPriceDrop,
      notifyBackInStock,
      productName: productName || undefined,
    });

    if (result) {
      onSaved();
      onClose();
    }
  }

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
          width: "400px",
          backgroundColor: "#111111",
          border: "1px solid #2a2a2a",
          padding: "24px",
        }}
      >
        <div className="flex items-center justify-between mb-5">
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
            EDIT PRODUCT
          </span>
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

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              style={{
                fontFamily: "var(--font-day31-mono)",
                fontSize: "11px",
                color: "#555",
                display: "block",
                marginBottom: "6px",
              }}
            >
              NAME
            </label>
            <input
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                backgroundColor: "#0F0F0F",
                border: "1px solid #2a2a2a",
                color: "#eee",
                fontFamily: "var(--font-day31-body)",
                fontSize: "14px",
                outline: "none",
              }}
            />
          </div>

          <div>
            <label
              style={{
                fontFamily: "var(--font-day31-mono)",
                fontSize: "11px",
                color: "#555",
                display: "block",
                marginBottom: "6px",
              }}
            >
              TARGET PRICE ($)
            </label>
            <input
              type="number"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              step="0.01"
              min="0.01"
              required
              style={{
                width: "100%",
                padding: "10px",
                backgroundColor: "#0F0F0F",
                border: "1px solid #2a2a2a",
                color: "#eee",
                fontFamily: "var(--font-day31-mono)",
                fontSize: "14px",
                outline: "none",
              }}
            />
          </div>

          <div>
            <label
              style={{
                fontFamily: "var(--font-day31-mono)",
                fontSize: "11px",
                color: "#555",
                display: "block",
                marginBottom: "6px",
              }}
            >
              AUTO-CHECK SCHEDULE
            </label>
            <div
              style={{
                fontFamily: "var(--font-day31-mono)",
                fontSize: "12px",
                padding: "10px 14px",
                border: "1px solid #2a2a2a",
                backgroundColor: "rgba(0,255,65,0.03)",
                color: "#999",
              }}
            >
              <span style={{ color: "#00FF41" }}>1x / day</span> at 9:00 AM UTC
              <div
                style={{
                  fontSize: "10px",
                  color: "#555",
                  marginTop: "4px",
                }}
              >
                You can also check manually anytime using the CHECK button.
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={notifyPriceDrop}
                onChange={(e) => setNotifyPriceDrop(e.target.checked)}
                className="accent-[#00FF41]"
              />
              <span
                style={{
                  fontFamily: "var(--font-day31-body)",
                  fontSize: "14px",
                  color: "#999",
                }}
              >
                Price drop alerts
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={notifyBackInStock}
                onChange={(e) => setNotifyBackInStock(e.target.checked)}
                className="accent-[#00FF41]"
              />
              <span
                style={{
                  fontFamily: "var(--font-day31-body)",
                  fontSize: "14px",
                  color: "#999",
                }}
              >
                Back in stock alerts
              </span>
            </label>
          </div>

          {error && (
            <div
              style={{
                fontFamily: "var(--font-day31-mono)",
                fontSize: "12px",
                color: "#ff4444",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              fontFamily: "var(--font-day31-mono)",
              fontSize: "14px",
              fontWeight: 700,
              backgroundColor: loading ? "#333" : "#00FF41",
              color: loading ? "#666" : "#000",
              border: "none",
              padding: "14px",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "SAVING..." : "[ SAVE ]"}
          </button>
        </form>
      </div>
    </div>
  );
}
