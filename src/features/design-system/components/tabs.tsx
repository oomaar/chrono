"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cn } from "../utils/cn";

export const Tabs = TabsPrimitive.Root;

type TabsListProps = ComponentPropsWithoutRef<typeof TabsPrimitive.List> & {
  variant?: "underline" | "pill";
};

export const TabsList = forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, variant = "underline", ...props }, ref) => (
    <TabsPrimitive.List
      ref={ref}
      className={cn(
        "inline-flex items-center gap-1",
        variant === "underline" && "border-line border-b",
        variant === "pill" && "border-line bg-elev rounded-full border p-1",
        className,
      )}
      data-variant={variant}
      {...props}
    />
  ),
);

TabsList.displayName = "TabsList";

type TabsTriggerProps = ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>;

export const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, ...props }, ref) => (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        "group text-ink-3 relative inline-flex items-center gap-1.5 font-medium tracking-tight whitespace-nowrap transition-colors",
        "focus-visible:ring-brand/40 focus-visible:ring-offset-bg focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
        "disabled:pointer-events-none disabled:opacity-45",
        // underline variant (default)
        "in-data-[variant=underline]:h-9 in-data-[variant=underline]:px-3 in-data-[variant=underline]:text-sm",
        "in-data-[variant=underline]:hover:text-ink-2",
        "[[data-variant=underline]_&][data-state=active]:text-ink",
        // pill variant
        "in-data-[variant=pill]:h-7 in-data-[variant=pill]:rounded-full in-data-[variant=pill]:px-3 in-data-[variant=pill]:text-xs",
        "in-data-[variant=pill]:hover:text-ink",
        "[[data-variant=pill]_&][data-state=active]:bg-brand [[data-variant=pill]_&][data-state=active]:text-bg",
        className,
      )}
      {...props}
    >
      <span className="inline-flex items-center gap-1.5">{props.children}</span>
      <span
        aria-hidden
        className={cn(
          "bg-brand pointer-events-none absolute right-2 -bottom-px left-2 h-0.5 rounded-full opacity-0 transition-opacity",
          "in-data-[variant=underline]:group-data-[state=active]:opacity-100",
        )}
      />
    </TabsPrimitive.Trigger>
  ),
);

TabsTrigger.displayName = "TabsTrigger";

type TabsContentProps = ComponentPropsWithoutRef<typeof TabsPrimitive.Content>;

export const TabsContent = forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, ...props }, ref) => (
    <TabsPrimitive.Content
      ref={ref}
      className={cn(
        "mt-4 focus-visible:outline-none",
        "data-[state=inactive]:hidden",
        "data-[state=active]:animate-fade-in",
        className,
      )}
      {...props}
    />
  ),
);

TabsContent.displayName = "TabsContent";
