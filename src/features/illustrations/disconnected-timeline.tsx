"use client";

import { motion } from "motion/react";

type IllustrationProps = {
  className?: string;
};

export function DisconnectedTimeline({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 320 180" role="img" aria-hidden className={className} fill="none">
      <g className="text-ink-3">
        <line
          x1="20"
          x2="140"
          y1="96"
          y2="96"
          stroke="currentColor"
          strokeWidth="1.25"
          opacity="0.7"
        />
        <line
          x1="180"
          x2="300"
          y1="96"
          y2="96"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeDasharray="3 4"
          opacity="0.35"
        />
      </g>

      <g className="text-ink-2">
        <circle cx="45" cy="96" r="3" fill="currentColor" />
        <circle cx="90" cy="96" r="3" fill="currentColor" />
        <circle cx="135" cy="96" r="3" fill="currentColor" opacity="0.7" />
      </g>

      <g className="text-ink-3" opacity="0.5">
        <circle cx="200" cy="96" r="3" fill="currentColor" />
        <circle cx="245" cy="96" r="3" fill="currentColor" />
        <circle cx="290" cy="96" r="3" fill="currentColor" />
      </g>

      <g className="text-warn">
        <path
          d="M148 88 L152 96 L146 104 L164 104 L168 96 L164 88 Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
          fill="none"
        />
        <motion.circle
          cx="160"
          cy="96"
          r="4"
          fill="currentColor"
          initial={{ opacity: 0.4 }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        />
      </g>

      <g className="text-warn" opacity="0.5">
        {[0, 1, 2].map((i) => (
          <motion.path
            key={i}
            d={`M160 96 Q${170 + i * 6} ${88 - i * 4} ${180 + i * 12} ${96 - i * 2}`}
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
            strokeLinecap="round"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.6, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.25,
              ease: "easeInOut",
            }}
          />
        ))}
      </g>
    </svg>
  );
}
