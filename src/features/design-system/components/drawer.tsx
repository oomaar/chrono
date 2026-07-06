"use client";

import { X } from "lucide-react";
import { forwardRef, type ComponentPropsWithoutRef, type HTMLAttributes } from "react";
import { Drawer as DrawerPrimitive } from "vaul";
import { cn } from "../utils/cn";

export const Drawer = DrawerPrimitive.Root;
export const DrawerTrigger = DrawerPrimitive.Trigger;
export const DrawerClose = DrawerPrimitive.Close;

type OverlayProps = ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>;

export const DrawerOverlay = forwardRef<HTMLDivElement, OverlayProps>(
  ({ className, ...props }, ref) => (
    <DrawerPrimitive.Overlay
      ref={ref}
      className={cn("fixed inset-0 z-40 bg-(--theme-scrim) backdrop-blur-sm", className)}
      {...props}
    />
  ),
);

DrawerOverlay.displayName = "DrawerOverlay";

type ContentProps = ComponentPropsWithoutRef<typeof DrawerPrimitive.Content> & {
  showClose?: boolean;
  showHandle?: boolean;
};

export const DrawerContent = forwardRef<HTMLDivElement, ContentProps>(
  ({ className, children, showClose = true, showHandle = true, ...props }, ref) => (
    <DrawerPrimitive.Portal>
      <DrawerOverlay />
      <DrawerPrimitive.Content
        ref={ref}
        className={cn(
          "border-line bg-surface text-ink fixed inset-x-0 bottom-0 z-50 flex max-h-[85vh] flex-col rounded-t-2xl border-t shadow-[0_-24px_60px_rgba(0,0,0,0.55)] outline-none",
          className,
        )}
        {...props}
      >
        {showHandle ? (
          <div className="bg-line-strong mx-auto mt-3 h-1 w-10 shrink-0 rounded-full" />
        ) : null}
        <div className="relative flex-1 overflow-auto p-6">
          {children}
          {showClose ? (
            <DrawerPrimitive.Close
              aria-label="Close"
              className="text-ink-3 hover:bg-elev hover:text-ink focus-visible:ring-brand/40 absolute top-4 right-4 rounded-full p-1 transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              <X size={14} />
            </DrawerPrimitive.Close>
          ) : null}
        </div>
      </DrawerPrimitive.Content>
    </DrawerPrimitive.Portal>
  ),
);

DrawerContent.displayName = "DrawerContent";

export function DrawerHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-4 space-y-1.5", className)} {...props} />;
}

export function DrawerFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className,
      )}
      {...props}
    />
  );
}

export const DrawerTitle = forwardRef<
  HTMLHeadingElement,
  ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title
    ref={ref}
    className={cn("text-ink text-lg font-semibold tracking-tight", className)}
    {...props}
  />
));

DrawerTitle.displayName = "DrawerTitle";

export const DrawerDescription = forwardRef<
  HTMLParagraphElement,
  ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description
    ref={ref}
    className={cn("text-ink-2 text-sm", className)}
    {...props}
  />
));

DrawerDescription.displayName = "DrawerDescription";
