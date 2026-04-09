"use client";

import { useState, useEffect } from "react";
import type { CheckFrequency } from "@/types/day31";
import { useAddProduct } from "@/hooks/day31/useAddProduct";

interface AddProductSlideOverProps {
  open: boolean;
  onClose: () => void;
  onAdded: () => void;
}

const FREQUENCIES: CheckFrequency[] = ["1x", "2x", "4x", "6x"];

export function AddProductSlideOver({
  open,
  onClose,
  onAdded,
}: AddProductSlideOverProps) {
  const { add, preview, loading, previewing, error } = useAddProduct();

  const [url, setUrl] = useState("");
  const [productName, setProductName] = useState("");
  const [targetPrice, setTargetPrice] = useState("");
  const [frequency, setFrequency] = useState<CheckFrequency>("2x");
  const [notifyPriceDrop, setNotifyPriceDrop] = useState(true);
  const [notifyBackInStock, setNotifyBackInStock] = useState(true);
  const [previewPrice, setPreviewPrice] = useState<number | null>(null);
  const [previewDone, setPreviewDone] = useState(false);

  // Auto-preview on URL paste
  useEffect(() => {
    if (!url || url.length < 10) return;
    if (!url.startsWith("http")) return;

    const timeout = setTimeout(async () => {
      const result = await preview(url);
      if (result) {
        if (result.productName && !productName) {
          setProductName(result.productName);
        }
        if (result.currentPrice !== null) {
          setPreviewPrice(result.currentPrice);
        }
        setPreviewDone(true);
      }
    }, 500);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const price = parseFloat(targetPrice);
    if (isNaN(price) || price <= 0) return;

    const result = await add({
      url,
      productName: productName || undefined,
      targetPrice: price,
      frequency,
      notifyPriceDrop,
      notifyBackInStock,
    });

    if (result) {
      setUrl("");
      setProductName("");
      setTargetPrice("");
      setFrequency("2x");
      setPreviewPrice(null);
      setPreviewDone(false);
      onAdded();
      onClose();
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div
        style={{
          width: "420px",
          backgroundColor: "#111111",
          borderLeft: "1px solid #2a2a2a",
          height: "100%",
          overflowY: "auto",
          padding: "24px",
        }}
      >
        <div className="flex items-center justify-between mb-6">
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
            ADD PRODUCT
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

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* URL */}
          <div>
            <label
              style={{
                fontFamily: "var(--font-day31-mono)",
                fontSize: "11px",
                letterSpacing: "1px",
                color: "#555",
                display: "block",
                marginBottom: "6px",
              }}
            >
              PRODUCT URL
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              required
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: "#0F0F0F",
                border: "1px solid #2a2a2a",
                color: "#eee",
                fontFamily: "var(--font-day31-mono)",
                fontSize: "13px",
                outline: "none",
              }}
            />
            {previewing && (
              <div
                style={{
                  fontFamily: "var(--font-day31-mono)",
                  fontSize: "11px",
                  color: "#555",
                  marginTop: "4px",
                }}
              >
                extracting...
              </div>
            )}
            {previewDone && previewPrice !== null && (
              <div
                style={{
                  fontFamily: "var(--font-day31-mono)",
                  fontSize: "13px",
                  color: "#00FF41",
                  marginTop: "4px",
                }}
              >
                current price: ${previewPrice.toFixed(2)}
              </div>
            )}
          </div>

          {/* Product Name */}
          <div>
            <label
              style={{
                fontFamily: "var(--font-day31-mono)",
                fontSize: "11px",
                letterSpacing: "1px",
                color: "#555",
                display: "block",
                marginBottom: "6px",
              }}
            >
              PRODUCT NAME
            </label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Auto-detected or enter manually"
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: "#0F0F0F",
                border: "1px solid #2a2a2a",
                color: "#eee",
                fontFamily: "var(--font-day31-body)",
                fontSize: "14px",
                outline: "none",
              }}
            />
          </div>

          {/* Target Price */}
          <div>
            <label
              style={{
                fontFamily: "var(--font-day31-mono)",
                fontSize: "11px",
                letterSpacing: "1px",
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
              placeholder="0.00"
              step="0.01"
              min="0.01"
              required
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: "#0F0F0F",
                border: "1px solid #2a2a2a",
                color: "#eee",
                fontFamily: "var(--font-day31-mono)",
                fontSize: "14px",
                outline: "none",
              }}
            />
          </div>

          {/* Frequency */}
          <div>
            <label
              style={{
                fontFamily: "var(--font-day31-mono)",
                fontSize: "11px",
                letterSpacing: "1px",
                color: "#555",
                display: "block",
                marginBottom: "6px",
              }}
            >
              CHECK FREQUENCY
            </label>
            <div className="flex gap-2">
              {FREQUENCIES.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFrequency(f)}
                  style={{
                    fontFamily: "var(--font-day31-mono)",
                    fontSize: "12px",
                    padding: "8px 16px",
                    border: `1px solid ${frequency === f ? "#00FF41" : "#2a2a2a"}`,
                    backgroundColor:
                      frequency === f ? "rgba(0,255,65,0.08)" : "transparent",
                    color: frequency === f ? "#00FF41" : "#555",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {f}/day
                </button>
              ))}
            </div>
          </div>

          {/* Notification toggles */}
          <div className="flex flex-col gap-3">
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
                Notify on price drop
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
                Notify when back in stock
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
            disabled={loading || !url || !targetPrice}
            style={{
              fontFamily: "var(--font-day31-mono)",
              fontSize: "14px",
              fontWeight: 700,
              letterSpacing: "0.5px",
              backgroundColor:
                loading || !url || !targetPrice ? "#333" : "#00FF41",
              color: loading || !url || !targetPrice ? "#666" : "#000",
              border: "none",
              padding: "16px 32px",
              cursor:
                loading || !url || !targetPrice ? "not-allowed" : "pointer",
              transition: "all 0.25s ease",
              width: "100%",
              marginTop: "8px",
            }}
          >
            {loading ? "ADDING..." : "[ START TRACKING ]"}
          </button>
        </form>
      </div>
    </div>
  );
}
