import { type HTMLAttributes } from "react";
import { cn } from "../utils/cn";

type SkeletonProps = HTMLAttributes<HTMLDivElement> & {
  variant?: "block" | "text" | "circle";
};

export function Skeleton({ className, variant = "block", ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "animate-shimmer bg-elev",
        variant === "block" && "h-4 w-full rounded-md",
        variant === "text" && "h-3 w-full rounded",
        variant === "circle" && "h-8 w-8 rounded-full",
        className,
      )}
      {...props}
    />
  );
}

export function SkeletonLines({
  count = 3,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton
          key={index}
          variant="text"
          className={index === count - 1 ? "w-2/3" : "w-full"}
        />
      ))}
    </div>
  );
}
