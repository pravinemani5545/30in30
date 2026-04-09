"use client";

import { memo } from "react";
import type { TrackedProduct } from "@/types/day31";
import { AvailabilityBadge } from "./AvailabilityBadge";
import { PriceDelta } from "./PriceDelta";

interface ProductRowProps {
  product: TrackedProduct;
  onCheck: (id: string) => void;
  onEdit: (product: TrackedProduct) => void;
  onHistory: (product: TrackedProduct) => void;
  onDelete: (id: string) => void;
  checkingId: string | null;
}

function formatPrice(price: number | null, currency: string): string {
  if (price === null) return "--";
  const symbol = currency === "USD" ? "$" : currency;
  return `${symbol}${price.toFixed(2)}`;
}

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return "--";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function timeUntil(dateStr: string): string {
  const diff = new Date(dateStr).getTime() - Date.now();
  if (diff <= 0) return "due now";
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `in ${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `in ${hrs}h`;
  const days = Math.floor(hrs / 24);
  return `in ${days}d`;
}

function truncateUrl(url: string): string {
  try {
    const u = new URL(url);
    const path =
      u.pathname.length > 30 ? u.pathname.slice(0, 30) + "..." : u.pathname;
    return u.hostname + path;
  } catch {
    return url.slice(0, 50);
  }
}

function ProductRowInner({
  product,
  onCheck,
  onEdit,
  onHistory,
  onDelete,
  checkingId,
}: ProductRowProps) {
  const isChecking = checkingId === product.id;
  const hasFailed = product.consecutive_failures > 0;
  const isDeactivated = !product.is_active;

  return (
    <tr
      style={{
        borderBottom: "1px solid #2a2a2a",
        borderLeft: isDeactivated
          ? "2px solid #ff4444"
          : product.is_below_target
            ? "2px solid #00FF41"
            : "2px solid transparent",
        transition: "background 0.2s",
        opacity: isDeactivated ? 0.5 : 1,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "#161616";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "transparent";
      }}
    >
      {/* Product */}
      <td style={{ padding: "12px 16px", maxWidth: "240px" }}>
        <div
          style={{
            fontFamily: "var(--font-day31-body)",
            fontSize: "14px",
            fontWeight: 500,
            color: "#eee",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {product.product_name || "Untitled product"}
        </div>
        <div
          style={{
            fontFamily: "var(--font-day31-mono)",
            fontSize: "11px",
            color: "#555",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            marginTop: "2px",
          }}
        >
          {truncateUrl(product.url)}
        </div>
        {/* Error status */}
        {isDeactivated && (
          <div
            style={{
              fontFamily: "var(--font-day31-mono)",
              fontSize: "10px",
              color: "#ff4444",
              marginTop: "4px",
            }}
          >
            PAUSED — 5 consecutive failures
          </div>
        )}
        {!isDeactivated && hasFailed && (
          <div
            style={{
              fontFamily: "var(--font-day31-mono)",
              fontSize: "10px",
              color: "#FFB800",
              marginTop: "4px",
            }}
          >
            {product.consecutive_failures} failed check
            {product.consecutive_failures > 1 ? "s" : ""}
          </div>
        )}
      </td>

      {/* Current Price */}
      <td style={{ padding: "12px 16px" }}>
        <div
          style={{
            fontFamily: "var(--font-day31-mono)",
            fontSize: "16px",
            fontWeight: 700,
            color: product.is_below_target ? "#00FF41" : "#eee",
          }}
        >
          {formatPrice(product.current_price, product.currency)}
        </div>
        <div
          style={{
            fontFamily: "var(--font-day31-body)",
            fontSize: "13px",
            color: "#999",
            marginTop: "2px",
          }}
        >
          target: {formatPrice(product.target_price, product.currency)}
        </div>
      </td>

      {/* Delta */}
      <td style={{ padding: "12px 16px" }}>
        <PriceDelta
          currentPrice={product.current_price}
          previousPrice={product.previous_price}
        />
      </td>

      {/* Status */}
      <td style={{ padding: "12px 16px" }}>
        <AvailabilityBadge status={product.availability} />
      </td>

      {/* Last Check / Next Check */}
      <td style={{ padding: "12px 16px" }}>
        <span
          style={{
            fontFamily: "var(--font-day31-mono)",
            fontSize: "12px",
            color: "#555",
          }}
        >
          {timeAgo(product.last_check_at)}
        </span>
        {product.next_check_at && (
          <div
            style={{
              fontFamily: "var(--font-day31-mono)",
              fontSize: "10px",
              color: "#444",
              marginTop: "2px",
            }}
          >
            next: {timeUntil(product.next_check_at)}
          </div>
        )}
      </td>

      {/* Actions */}
      <td style={{ padding: "12px 16px" }}>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onCheck(product.id)}
            disabled={isChecking}
            title="Check now"
            style={{
              fontFamily: "var(--font-day31-mono)",
              fontSize: "11px",
              color: isChecking ? "#555" : "#00FF41",
              backgroundColor: isChecking
                ? "rgba(0,255,65,0.03)"
                : "transparent",
              border: `1px solid ${isChecking ? "#2a2a2a" : "rgba(0,255,65,0.2)"}`,
              padding: "4px 8px",
              cursor: isChecking ? "not-allowed" : "pointer",
              minWidth: "56px",
              textAlign: "center",
              position: "relative",
            }}
          >
            {isChecking ? (
              <span className="inline-flex items-center gap-1">
                <span
                  style={{
                    display: "inline-block",
                    width: "4px",
                    height: "4px",
                    backgroundColor: "#00FF41",
                    animation: "pulse-dot 1s infinite",
                  }}
                />
                <span
                  style={{
                    display: "inline-block",
                    width: "4px",
                    height: "4px",
                    backgroundColor: "#00FF41",
                    animation: "pulse-dot 1s infinite 0.2s",
                  }}
                />
                <span
                  style={{
                    display: "inline-block",
                    width: "4px",
                    height: "4px",
                    backgroundColor: "#00FF41",
                    animation: "pulse-dot 1s infinite 0.4s",
                  }}
                />
              </span>
            ) : (
              "CHECK"
            )}
          </button>
          <button
            onClick={() => onHistory(product)}
            title="View history"
            style={{
              fontFamily: "var(--font-day31-mono)",
              fontSize: "11px",
              color: "#999",
              backgroundColor: "transparent",
              border: "1px solid #2a2a2a",
              padding: "4px 8px",
              cursor: "pointer",
            }}
          >
            HIST
          </button>
          <button
            onClick={() => onEdit(product)}
            title="Edit"
            style={{
              fontFamily: "var(--font-day31-mono)",
              fontSize: "11px",
              color: "#999",
              backgroundColor: "transparent",
              border: "1px solid #2a2a2a",
              padding: "4px 8px",
              cursor: "pointer",
            }}
          >
            EDIT
          </button>
          <button
            onClick={() => onDelete(product.id)}
            title="Remove"
            style={{
              fontFamily: "var(--font-day31-mono)",
              fontSize: "11px",
              color: "#ff4444",
              backgroundColor: "transparent",
              border: "1px solid rgba(255,68,68,0.15)",
              padding: "4px 8px",
              cursor: "pointer",
            }}
          >
            DEL
          </button>
        </div>
      </td>
    </tr>
  );
}

export const ProductRow = memo(ProductRowInner);
