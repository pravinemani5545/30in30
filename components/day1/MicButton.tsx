"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Mic, Square, Loader2 } from "lucide-react";

type MicState = "idle" | "recording" | "processing";

interface MicButtonProps {
  state: MicState;
  onStart: () => void;
  onStop: () => void;
}

export function MicButton({ state, onStart, onStop }: MicButtonProps) {
  const isRecording = state === "recording";
  const isProcessing = state === "processing";
  const isIdle = state === "idle";

  function handleClick() {
    if (isIdle) onStart();
    else if (isRecording) onStop();
  }

  return (
    <div className="relative flex items-center justify-center">
      {/* Pulsing rings during recording */}
      <AnimatePresence>
        {isRecording && (
          <>
            <motion.div
              className="absolute rounded-full border-2 border-amber-500/30"
              initial={{ width: 96, height: 96, opacity: 0.6 }}
              animate={{ width: 160, height: 160, opacity: 0 }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
            />
            <motion.div
              className="absolute rounded-full border-2 border-amber-500/20"
              initial={{ width: 96, height: 96, opacity: 0.4 }}
              animate={{ width: 200, height: 200, opacity: 0 }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
            />
          </>
        )}
      </AnimatePresence>

      {/* Main button */}
      <motion.button
        onClick={handleClick}
        disabled={isProcessing}
        aria-label={
          isIdle ? "Start recording" : isRecording ? "Stop recording" : "Analyzing"
        }
        className={[
          "relative z-10 flex items-center justify-center",
          "w-24 h-24 rounded-full",
          "transition-colors duration-300",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-amber-500",
          isIdle
            ? "bg-muted border-2 border-border hover:border-amber-500/50 hover:bg-muted/80"
            : isRecording
            ? "bg-amber-500 border-2 border-amber-400 shadow-lg shadow-amber-500/25"
            : "bg-muted border-2 border-border cursor-not-allowed opacity-60",
        ].join(" ")}
        whileTap={{ scale: isProcessing ? 1 : 0.94 }}
        whileHover={{ scale: isProcessing ? 1 : 1.04 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      >
        <AnimatePresence mode="wait">
          {isIdle && (
            <motion.span
              key="mic"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.15 }}
            >
              <Mic className="w-8 h-8 text-muted-foreground" />
            </motion.span>
          )}
          {isRecording && (
            <motion.span
              key="stop"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.15 }}
            >
              <Square className="w-7 h-7 text-white fill-white" />
            </motion.span>
          )}
          {isProcessing && (
            <motion.span
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Label below */}
      <div className="absolute -bottom-9 text-xs text-muted-foreground text-center w-40">
        <AnimatePresence mode="wait">
          {isIdle && (
            <motion.span
              key="idle-label"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Tap to speak
            </motion.span>
          )}
          {isRecording && (
            <motion.span
              key="recording-label"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-amber-400"
            >
              Recording… tap to stop
            </motion.span>
          )}
          {isProcessing && (
            <motion.span
              key="processing-label"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Analyzing…
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
