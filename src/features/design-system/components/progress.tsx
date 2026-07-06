"use client";

import * as ProgressPrimitive from "@radix-ui/react-progress";
import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cn } from "../utils/cn";

type ProgressTone = "brand" | "ok" | "warn" | "crit" | "neutral";

type ProgressProps = ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
  tone?: ProgressTone;
  size?: "xs" | "sm" | "md";
};

const toneFillClasses: Record<ProgressTone, string> = {
  brand: "bg-brand",
  ok: "bg-ok",
  warn: "bg-warn",
  crit: "bg-crit",
  neutral: "bg-ink-2",
};

const sizeClasses: Record<NonNullable<ProgressProps["size"]>, string> = {
  xs: "h-1",
  sm: "h-1.5",
  md: "h-2",
};

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value, tone = "brand", size = "sm", ...props }, ref) => {
    const clamped = Math.max(0, Math.min(100, value ?? 0));

    return (
      <ProgressPrimitive.Root
        ref={ref}
        value={clamped}
        className={cn(
          "bg-elev relative w-full overflow-hidden rounded-full",
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={cn(
            "h-full w-full transition-transform duration-500 ease-out",
            toneFillClasses[tone],
          )}
          style={{ transform: `translateX(-${100 - clamped}%)` }}
        />
      </ProgressPrimitive.Root>
    );
  },
);

Progress.displayName = "Progress";
