"use client";

import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cn } from "../utils/cn";

export const HoverCard = HoverCardPrimitive.Root;
export const HoverCardTrigger = HoverCardPrimitive.Trigger;

type HoverCardContentProps = ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>;

export const HoverCardContent = forwardRef<HTMLDivElement, HoverCardContentProps>(
  ({ className, align = "start", sideOffset = 8, ...props }, ref) => (
    <HoverCardPrimitive.Portal>
      <HoverCardPrimitive.Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "border-line bg-surface text-ink z-50 w-72 rounded-xl border p-4 text-sm shadow-[0_24px_60px_rgba(0,0,0,0.35)] outline-none",
          "data-[state=open]:animate-scale-in data-[state=closed]:animate-scale-out",
          className,
        )}
        {...props}
      />
    </HoverCardPrimitive.Portal>
  ),
);

HoverCardContent.displayName = "HoverCardContent";
