"use client";

import { motion } from "motion/react";

type IllustrationProps = {
  className?: string;
};

export function TimelineScan({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 320 180" role="img" aria-hidden className={className} fill="none">
      <g className="text-ink-3" opacity="0.4">
        <line x1="20" x2="300" y1="96" y2="96" stroke="currentColor" strokeWidth="1.25" />
        {Array.from({ length: 15 }).map((_, i) => (
          <line
            key={i}
            x1={30 + i * 18}
            x2={30 + i * 18}
            y1="90"
            y2="102"
            stroke="currentColor"
            strokeWidth="1"
            opacity={0.35 + (i % 4) * 0.12}
          />
        ))}
      </g>

      <motion.g
        initial={{ x: 0 }}
        animate={{ x: 240 }}
        transition={{
          duration: 2,
          ease: [0.4, 0.0, 0.2, 1],
          repeat: Infinity,
          repeatType: "loop",
        }}
      >
        <rect
          x="-30"
          y="60"
          width="30"
          height="72"
          fill="url(#scan-gradient)"
          opacity="0.55"
        />
        <line
          x1="10"
          y1="60"
          x2="10"
          y2="132"
          className="text-brand"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </motion.g>

      <defs>
        <linearGradient id="scan-gradient" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="var(--theme-brand)" stopOpacity="0" />
          <stop offset="1" stopColor="var(--theme-brand)" stopOpacity="0.4" />
        </linearGradient>
      </defs>
    </svg>
  );
}
