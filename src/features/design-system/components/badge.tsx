import { cva, type VariantProps } from "class-variance-authority";
import { type HTMLAttributes } from "react";
import { cn } from "../utils/cn";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full font-mono text-[10px] font-semibold tracking-[0.14em] uppercase",
  {
    variants: {
      tone: {
        neutral: "border-line bg-surface-2 text-ink-2 border",
        brand: "border-brand/25 bg-brand/12 text-brand border",
        ok: "border-ok/25 bg-ok/12 text-ok border",
        warn: "border-warn/25 bg-warn/12 text-warn border",
        crit: "border-crit/25 bg-crit/12 text-crit border",
        outline: "border-line-strong text-ink-2 border bg-transparent",
      },
      size: {
        sm: "h-5 px-2",
        md: "h-6 px-2.5",
      },
    },
    defaultVariants: {
      tone: "neutral",
      size: "md",
    },
  },
);

type BadgeProps = HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeVariants> & {
    dot?: boolean;
  };

export function Badge({
  className,
  tone,
  size,
  dot = false,
  children,
  ...props
}: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ tone, size }), className)} {...props}>
      {dot ? (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            tone === "brand" && "bg-brand",
            tone === "ok" && "bg-ok",
            tone === "warn" && "bg-warn",
            tone === "crit" && "bg-crit",
            (tone === "neutral" || tone === "outline" || !tone) && "bg-ink-3",
          )}
        />
      ) : null}
      {children}
    </span>
  );
}
