"use client";

import { motion } from "motion/react";

type RibbonPlayheadProps = {
  ratio: number;
  mode: "live" | "scrubbing" | "playback";
  animated: boolean;
};

/**
 * The vertical playhead line + top handle, positioned at `ratio` (0..1)
 * across the ribbon. Uses SVG for exact positioning and Framer Motion for
 * smooth spring interpolation between playhead moves.
 */
export function RibbonPlayhead({ ratio, mode, animated }: RibbonPlayheadProps) {
  const x = Math.max(0, Math.min(1, ratio)) * 100;
  const toneClass = mode === "live" ? "text-brand" : "text-ink";
  const dashed = mode === "scrubbing";

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 h-full w-full"
    >
      <motion.line
        x1={x}
        y1={0}
        x2={x}
        y2={100}
        className={toneClass}
        stroke="currentColor"
        strokeWidth={0.4}
        strokeDasharray={dashed ? "2 2" : undefined}
        initial={false}
        animate={{ x1: x, x2: x }}
        transition={
          animated ? { type: "spring", stiffness: 220, damping: 26 } : { duration: 0 }
        }
      />
      <motion.circle
        cx={x}
        cy={2}
        r={1.4}
        className={toneClass}
        fill="currentColor"
        initial={false}
        animate={{ cx: x }}
        transition={
          animated ? { type: "spring", stiffness: 220, damping: 26 } : { duration: 0 }
        }
      />
    </svg>
  );
}
