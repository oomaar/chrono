"use client";

import * as SwitchPrimitive from "@radix-ui/react-switch";
import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cn } from "../utils/cn";

type SwitchProps = ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>;

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  ({ className, ...props }, ref) => (
    <SwitchPrimitive.Root
      ref={ref}
      className={cn(
        "peer border-line inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border transition-colors",
        "focus-visible:ring-brand/40 focus-visible:ring-offset-bg focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-45",
        "data-[state=checked]:bg-brand data-[state=checked]:border-brand",
        "data-[state=unchecked]:bg-elev",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          "bg-ink pointer-events-none block h-3.5 w-3.5 rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.3)] transition-transform",
          "data-[state=checked]:bg-bg data-[state=checked]:translate-x-4.5",
          "data-[state=unchecked]:translate-x-0.75",
        )}
      />
    </SwitchPrimitive.Root>
  ),
);

Switch.displayName = "Switch";
