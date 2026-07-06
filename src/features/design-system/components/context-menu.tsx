"use client";

import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";
import { Check, ChevronRight } from "lucide-react";
import { forwardRef, type ComponentPropsWithoutRef, type HTMLAttributes } from "react";
import { cn } from "../utils/cn";

export const ContextMenu = ContextMenuPrimitive.Root;
export const ContextMenuTrigger = ContextMenuPrimitive.Trigger;
export const ContextMenuGroup = ContextMenuPrimitive.Group;
export const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup;
export const ContextMenuSub = ContextMenuPrimitive.Sub;

const contentClasses = cn(
  "border-line bg-surface text-ink z-50 min-w-[220px] overflow-hidden rounded-xl border p-1.5 text-sm shadow-[0_24px_60px_rgba(0,0,0,0.35)] outline-none",
  "data-[state=open]:animate-scale-in data-[state=closed]:animate-scale-out",
);

const itemClasses =
  "relative flex cursor-default select-none items-center gap-2 rounded-md px-2.5 py-1.5 text-sm text-ink-2 outline-none transition-colors focus:bg-elev focus:text-ink data-[disabled]:pointer-events-none data-[disabled]:opacity-40";

type ContentProps = ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content>;

export const ContextMenuContent = forwardRef<HTMLDivElement, ContentProps>(
  ({ className, ...props }, ref) => (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Content
        ref={ref}
        className={cn(contentClasses, className)}
        {...props}
      />
    </ContextMenuPrimitive.Portal>
  ),
);

ContextMenuContent.displayName = "ContextMenuContent";

type ItemProps = ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item> & {
  destructive?: boolean;
};

export const ContextMenuItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ className, destructive, ...props }, ref) => (
    <ContextMenuPrimitive.Item
      ref={ref}
      className={cn(
        itemClasses,
        destructive && "text-crit focus:bg-crit/10 focus:text-crit",
        className,
      )}
      {...props}
    />
  ),
);

ContextMenuItem.displayName = "ContextMenuItem";

type CheckboxItemProps = ComponentPropsWithoutRef<
  typeof ContextMenuPrimitive.CheckboxItem
>;

export const ContextMenuCheckboxItem = forwardRef<HTMLDivElement, CheckboxItemProps>(
  ({ className, children, checked, ...props }, ref) => (
    <ContextMenuPrimitive.CheckboxItem
      ref={ref}
      checked={checked}
      className={cn(itemClasses, "pl-7", className)}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <ContextMenuPrimitive.ItemIndicator>
          <Check size={12} />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.CheckboxItem>
  ),
);

ContextMenuCheckboxItem.displayName = "ContextMenuCheckboxItem";

export function ContextMenuLabel({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Label>) {
  return (
    <ContextMenuPrimitive.Label
      className={cn(
        "text-ink-3 px-2.5 py-1.5 font-mono text-[10px] tracking-[0.14em] uppercase",
        className,
      )}
      {...props}
    />
  );
}

export function ContextMenuSeparator({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Separator>) {
  return (
    <ContextMenuPrimitive.Separator
      className={cn("bg-line-2 -mx-1.5 my-1 h-px", className)}
      {...props}
    />
  );
}

export function ContextMenuShortcut({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "text-ink-3 ml-auto font-mono text-[10px] tracking-[0.16em]",
        className,
      )}
      {...props}
    />
  );
}

type SubTriggerProps = ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubTrigger>;

export const ContextMenuSubTrigger = forwardRef<HTMLDivElement, SubTriggerProps>(
  ({ className, children, ...props }, ref) => (
    <ContextMenuPrimitive.SubTrigger
      ref={ref}
      className={cn(itemClasses, "data-[state=open]:bg-elev", className)}
      {...props}
    >
      {children}
      <ChevronRight size={12} className="text-ink-3 ml-auto" />
    </ContextMenuPrimitive.SubTrigger>
  ),
);

ContextMenuSubTrigger.displayName = "ContextMenuSubTrigger";

type SubContentProps = ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubContent>;

export const ContextMenuSubContent = forwardRef<HTMLDivElement, SubContentProps>(
  ({ className, ...props }, ref) => (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.SubContent
        ref={ref}
        className={cn(contentClasses, className)}
        {...props}
      />
    </ContextMenuPrimitive.Portal>
  ),
);

ContextMenuSubContent.displayName = "ContextMenuSubContent";
