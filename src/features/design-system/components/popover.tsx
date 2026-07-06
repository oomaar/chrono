"use client";

import * as PopoverPrimitive from "@radix-ui/react-popover";
import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cn } from "../utils/cn";

export const Popover = PopoverPrimitive.Root;
export const PopoverTrigger = PopoverPrimitive.Trigger;
export const PopoverAnchor = PopoverPrimitive.Anchor;
export const PopoverClose = PopoverPrimitive.Close;

type PopoverContentProps = ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>;

export const PopoverContent = forwardRef<HTMLDivElement, PopoverContentProps>(
  ({ className, align = "start", sideOffset = 8, ...props }, ref) => (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "border-line bg-surface text-ink z-50 min-w-55 rounded-xl border p-3 text-sm shadow-[0_24px_60px_rgba(0,0,0,0.35)] outline-none",
          "data-[state=open]:animate-scale-in data-[state=closed]:animate-scale-out",
          className,
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  ),
);

PopoverContent.displayName = "PopoverContent";
