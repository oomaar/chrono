"use client";

import { motion } from "motion/react";
import { type ReactNode } from "react";
import { TimelineScan } from "@/features/illustrations";
import { cn } from "../utils/cn";

type LoadingStateProps = {
  kicker?: string;
  title?: string;
  description?: string;
  illustration?: ReactNode;
  className?: string;
};

export function LoadingState({
  kicker = "Reconstructing state",
  title = "Reading the timeline…",
  description = "Chrono is replaying moments to render this view.",
  illustration,
  className,
}: LoadingStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "border-line bg-surface flex flex-col items-center gap-6 rounded-2xl border p-10 text-center",
        className,
      )}
    >
      <div className="text-ink-3">
        {illustration ?? <TimelineScan className="h-28 w-auto" />}
      </div>

      <div className="space-y-2">
        <p className="text-brand font-mono text-[10px] tracking-[0.22em] uppercase">
          {kicker}
        </p>
        <h3 className="text-ink text-base font-semibold tracking-tight">{title}</h3>
        {description ? (
          <p className="text-ink-2 mx-auto max-w-sm text-sm">{description}</p>
        ) : null}
      </div>

      <div className="flex items-center gap-1.5">
        {[0, 1, 2].map((index) => (
          <motion.span
            key={index}
            className="bg-brand h-1.5 w-1.5 rounded-full"
            animate={{ opacity: [0.25, 1, 0.25] }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.15,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
