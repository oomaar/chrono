"use client";

import { motion } from "motion/react";
import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "../utils/cn";

type MarkerTone = "brand" | "ok" | "warn" | "crit" | "neutral";

type TimelineMarkerProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  tone?: MarkerTone;
  size?: "sm" | "md" | "lg";
  pulse?: boolean;
  label?: string;
};

const toneClasses: Record<MarkerTone, string> = {
  brand: "bg-brand ring-brand/40",
  ok: "bg-ok ring-ok/40",
  warn: "bg-warn ring-warn/40",
  crit: "bg-crit ring-crit/40",
  neutral: "bg-ink-3 ring-ink-3/40",
};

const sizeClasses: Record<NonNullable<TimelineMarkerProps["size"]>, string> = {
  sm: "h-2 w-2",
  md: "h-2.5 w-2.5",
  lg: "h-3 w-3",
};

export const TimelineMarker = forwardRef<HTMLButtonElement, TimelineMarkerProps>(
  (
    { className, tone = "brand", size = "md", pulse = false, label, title, ...props },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type="button"
        title={title ?? label}
        aria-label={label}
        className={cn(
          "focus-visible:ring-brand/50 relative inline-flex items-center justify-center rounded-full transition-transform focus-visible:ring-2 focus-visible:outline-none",
          "hover:scale-125",
          className,
        )}
        {...props}
      >
        {pulse ? (
          <motion.span
            aria-hidden
            initial={{ scale: 1, opacity: 0.7 }}
            animate={{ scale: 2.4, opacity: 0 }}
            transition={{
              duration: 2,
              ease: [0.2, 0.7, 0.3, 1],
              repeat: Infinity,
            }}
            className={cn(
              "absolute inline-block rounded-full",
              sizeClasses[size],
              toneClasses[tone].split(" ")[0],
            )}
          />
        ) : null}
        <span
          className={cn(
            "relative inline-block rounded-full ring-2",
            sizeClasses[size],
            toneClasses[tone],
          )}
        />
      </button>
    );
  },
);

TimelineMarker.displayName = "TimelineMarker";
