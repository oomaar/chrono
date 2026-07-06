"use client";

import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cn } from "../utils/cn";

type AvatarSize = "xs" | "sm" | "md" | "lg";

type AvatarProps = ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> & {
  size?: AvatarSize;
};

const sizeClasses: Record<AvatarSize, string> = {
  xs: "h-5 w-5 text-[9px]",
  sm: "h-6 w-6 text-[10px]",
  md: "h-8 w-8 text-xs",
  lg: "h-10 w-10 text-sm",
};

export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(
  ({ className, size = "md", ...props }, ref) => (
    <AvatarPrimitive.Root
      ref={ref}
      className={cn(
        "border-line bg-elev text-ink-2 relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-md border",
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  ),
);

Avatar.displayName = "Avatar";

export const AvatarImage = forwardRef<
  HTMLImageElement,
  ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("h-full w-full object-cover", className)}
    {...props}
  />
));

AvatarImage.displayName = "AvatarImage";

export const AvatarFallback = forwardRef<
  HTMLSpanElement,
  ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "from-line-strong to-elev text-ink flex h-full w-full items-center justify-center bg-gradient-to-br font-mono font-semibold tracking-tight uppercase",
      className,
    )}
    {...props}
  />
));

AvatarFallback.displayName = "AvatarFallback";
