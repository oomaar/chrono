"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { forwardRef, type ComponentPropsWithoutRef, type HTMLAttributes } from "react";
import { cn } from "../utils/cn";

export const Modal = DialogPrimitive.Root;
export const ModalTrigger = DialogPrimitive.Trigger;
export const ModalClose = DialogPrimitive.Close;

type OverlayProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>;

export const ModalOverlay = forwardRef<HTMLDivElement, OverlayProps>(
  ({ className, ...props }, ref) => (
    <DialogPrimitive.Overlay
      ref={ref}
      className={cn(
        "fixed inset-0 z-40 bg-(--theme-scrim) backdrop-blur-sm",
        "data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out",
        className,
      )}
      {...props}
    />
  ),
);

ModalOverlay.displayName = "ModalOverlay";

type ContentProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
  showClose?: boolean;
};

export const ModalContent = forwardRef<HTMLDivElement, ContentProps>(
  ({ className, children, showClose = true, ...props }, ref) => (
    <DialogPrimitive.Portal>
      <ModalOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          "fixed top-1/2 left-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2",
          "border-line bg-surface text-ink rounded-2xl border p-6 shadow-[0_24px_60px_rgba(0,0,0,0.55)] outline-none",
          "data-[state=open]:animate-scale-in data-[state=closed]:animate-scale-out",
          className,
        )}
        {...props}
      >
        {children}
        {showClose ? (
          <DialogPrimitive.Close
            aria-label="Close"
            className="text-ink-3 hover:bg-elev hover:text-ink focus-visible:ring-brand/40 absolute top-4 right-4 rounded-full p-1 transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            <X size={14} />
          </DialogPrimitive.Close>
        ) : null}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  ),
);

ModalContent.displayName = "ModalContent";

export function ModalHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-4 space-y-1.5", className)} {...props} />;
}

export function ModalFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
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

export const ModalTitle = forwardRef<
  HTMLHeadingElement,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-ink text-lg font-semibold tracking-tight", className)}
    {...props}
  />
));

ModalTitle.displayName = "ModalTitle";

export const ModalDescription = forwardRef<
  HTMLParagraphElement,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-ink-2 text-sm", className)}
    {...props}
  />
));

ModalDescription.displayName = "ModalDescription";
