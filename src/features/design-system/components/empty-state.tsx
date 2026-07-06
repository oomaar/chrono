"use client";

import { motion } from "motion/react";
import { type ReactNode } from "react";
import { EmptyTimeline } from "@/features/illustrations";
import { cn } from "../utils/cn";

type EmptyStateProps = {
  kicker?: string;
  title: string;
  description?: string;
  illustration?: ReactNode;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({
  kicker,
  title,
  description,
  illustration,
  action,
  className,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: [0.2, 0.7, 0.3, 1] }}
      className={cn(
        "border-line-strong bg-surface-2/50 flex flex-col items-center gap-6 rounded-2xl border border-dashed p-10 text-center",
        className,
      )}
    >
      <div className="text-ink-3">
        {illustration ?? <EmptyTimeline className="h-28 w-auto" />}
      </div>

      <div className="space-y-2">
        {kicker ? (
          <p className="text-ink-3 font-mono text-[10px] tracking-[0.22em] uppercase">
            {kicker}
          </p>
        ) : null}
        <h3 className="text-ink text-lg font-semibold tracking-tight">{title}</h3>
        {description ? (
          <p className="text-ink-2 mx-auto max-w-sm text-sm">{description}</p>
        ) : null}
      </div>

      {action ? <div>{action}</div> : null}
    </motion.div>
  );
}
