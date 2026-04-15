"use client";

import { useState, useEffect } from "react";

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<boolean>;
}

type CheckoutStep = "form" | "processing" | "success" | "error";

const PROCESSING_MESSAGES = [
  "> validating card details...",
  "> connecting to payment gateway...",
  "> authorizing transaction...",
  "> confirming subscription...",
  "> finalizing...",
];

export function CheckoutModal({ open, onClose, onConfirm }: CheckoutModalProps) {
  const [step, setStep] = useState<CheckoutStep>("form");
  const [processingLine, setProcessingLine] = useState(0);

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setStep("form");
      setProcessingLine(0);
    }
  }, [open]);

  // Processing animation
  useEffect(() => {
    if (step !== "processing") return;
    if (processingLine >= PROCESSING_MESSAGES.length) return;

    const timer = setTimeout(() => {
      setProcessingLine((prev) => prev + 1);
    }, 400);

    return () => clearTimeout(timer);
  }, [step, processingLine]);

  async function handlePay() {
    setStep("processing");
    setProcessingLine(0);

    // Wait for the animation to play out
    await new Promise((resolve) => setTimeout(resolve, 2200));

    const success = await onConfirm();
    setStep(success ? "success" : "error");
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.8)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget && step !== "processing") onClose();
      }}
    >
      <div
        className="w-full max-w-md"
        style={{
          background: "#111111",
          border: "1px solid #2a2a2a",
          borderRadius: 0,
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid #2a2a2a" }}
        >
          <h3
            style={{
              fontFamily: "var(--font-day25-heading)",
              fontSize: "16px",
              fontWeight: 700,
              color: "#eeeeee",
            }}
          >
            {step === "success" ? "Payment Complete" : "Checkout"}
          </h3>
          {step !== "processing" && (
            <button
              onClick={onClose}
              style={{
                fontFamily: "var(--font-day25-mono)",
                fontSize: "14px",
                color: "#555555",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              [x]
            </button>
          )}
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          {step === "form" && (
            <div className="space-y-4">
              {/* Mock card form */}
              <div>
                <label
                  style={{
                    fontFamily: "var(--font-day25-mono)",
                    fontSize: "11px",
                    color: "#999999",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  Card Number
                </label>
                <input
                  readOnly
                  value="4242 4242 4242 4242"
                  className="w-full px-3 py-2"
                  style={{
                    fontFamily: "var(--font-day25-mono)",
                    fontSize: "14px",
                    color: "#eeeeee",
                    background: "#0a0a0a",
                    border: "1px solid #2a2a2a",
                    borderRadius: 0,
                    outline: "none",
                  }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    style={{
                      fontFamily: "var(--font-day25-mono)",
                      fontSize: "11px",
                      color: "#999999",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      display: "block",
                      marginBottom: 6,
                    }}
                  >
                    Expiry
                  </label>
                  <input
                    readOnly
                    value="12/28"
                    className="w-full px-3 py-2"
                    style={{
                      fontFamily: "var(--font-day25-mono)",
                      fontSize: "14px",
                      color: "#eeeeee",
                      background: "#0a0a0a",
                      border: "1px solid #2a2a2a",
                      borderRadius: 0,
                      outline: "none",
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      fontFamily: "var(--font-day25-mono)",
                      fontSize: "11px",
                      color: "#999999",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      display: "block",
                      marginBottom: 6,
                    }}
                  >
                    CVC
                  </label>
                  <input
                    readOnly
                    value="123"
                    className="w-full px-3 py-2"
                    style={{
                      fontFamily: "var(--font-day25-mono)",
                      fontSize: "14px",
                      color: "#eeeeee",
                      background: "#0a0a0a",
                      border: "1px solid #2a2a2a",
                      borderRadius: 0,
                      outline: "none",
                    }}
                  />
                </div>
              </div>

              <div>
                <label
                  style={{
                    fontFamily: "var(--font-day25-mono)",
                    fontSize: "11px",
                    color: "#999999",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  Cardholder Name
                </label>
                <input
                  readOnly
                  value="TEST USER"
                  className="w-full px-3 py-2"
                  style={{
                    fontFamily: "var(--font-day25-mono)",
                    fontSize: "14px",
                    color: "#eeeeee",
                    background: "#0a0a0a",
                    border: "1px solid #2a2a2a",
                    borderRadius: 0,
                    outline: "none",
                  }}
                />
              </div>

              <div
                className="mt-2 p-3"
                style={{
                  background: "rgba(0,255,65,0.04)",
                  border: "1px solid rgba(0,255,65,0.15)",
                  borderRadius: 0,
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-day25-mono)",
                    fontSize: "11px",
                    color: "#00FF41",
                  }}
                >
                  {">"} This is a mock checkout. No real charges will be made.
                </p>
              </div>

              <button
                onClick={handlePay}
                className="w-full py-3 mt-2 transition-all"
                style={{
                  fontFamily: "var(--font-day25-mono)",
                  fontSize: "14px",
                  fontWeight: 700,
                  background: "#00FF41",
                  color: "#000000",
                  border: "none",
                  borderRadius: 0,
                  cursor: "pointer",
                }}
              >
                [ PAY $29 ]
              </button>
            </div>
          )}

          {step === "processing" && (
            <div
              className="py-4"
              style={{
                fontFamily: "var(--font-day25-mono)",
                fontSize: "13px",
                minHeight: 160,
              }}
            >
              {PROCESSING_MESSAGES.slice(0, processingLine + 1).map((msg, i) => (
                <div
                  key={i}
                  className="mb-2"
                  style={{
                    color: i < processingLine ? "#00FF41" : "#999999",
                  }}
                >
                  {msg}
                  {i === processingLine && (
                    <span
                      style={{
                        display: "inline-block",
                        width: 8,
                        height: 14,
                        background: "#00FF41",
                        marginLeft: 4,
                        animation: "blink 1s step-end infinite",
                      }}
                    />
                  )}
                </div>
              ))}
              <style>{`@keyframes blink { 50% { opacity: 0; } }`}</style>
            </div>
          )}

          {step === "success" && (
            <div className="py-6 text-center space-y-4">
              <div
                style={{
                  fontFamily: "var(--font-day25-mono)",
                  fontSize: "32px",
                  color: "#00FF41",
                }}
              >
                [OK]
              </div>
              <p
                style={{
                  fontFamily: "var(--font-day25-mono)",
                  fontSize: "14px",
                  color: "#eeeeee",
                }}
              >
                Payment successful. Welcome to Pro!
              </p>
              <p
                style={{
                  fontFamily: "var(--font-day25-mono)",
                  fontSize: "12px",
                  color: "#555555",
                }}
              >
                {">"} subscription activated
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2 mt-2"
                style={{
                  fontFamily: "var(--font-day25-mono)",
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "#00FF41",
                  background: "none",
                  border: "1px solid #00FF41",
                  borderRadius: 0,
                  cursor: "pointer",
                }}
              >
                [ DONE ]
              </button>
            </div>
          )}

          {step === "error" && (
            <div className="py-6 text-center space-y-4">
              <div
                style={{
                  fontFamily: "var(--font-day25-mono)",
                  fontSize: "32px",
                  color: "#EF4444",
                }}
              >
                [ERR]
              </div>
              <p
                style={{
                  fontFamily: "var(--font-day25-mono)",
                  fontSize: "14px",
                  color: "#eeeeee",
                }}
              >
                Checkout failed. Please try again.
              </p>
              <button
                onClick={() => setStep("form")}
                className="px-6 py-2 mt-2"
                style={{
                  fontFamily: "var(--font-day25-mono)",
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "#EF4444",
                  background: "none",
                  border: "1px solid #EF4444",
                  borderRadius: 0,
                  cursor: "pointer",
                }}
              >
                [ RETRY ]
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
