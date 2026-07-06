import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cn } from "../utils/cn";

type SeparatorProps = ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> & {
  strong?: boolean;
};

export const Separator = forwardRef<HTMLDivElement, SeparatorProps>(
  (
    { className, orientation = "horizontal", decorative = true, strong, ...props },
    ref,
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      orientation={orientation}
      decorative={decorative}
      className={cn(
        "shrink-0",
        strong ? "bg-line-strong" : "bg-line",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className,
      )}
      {...props}
    />
  ),
);

Separator.displayName = "Separator";
