"use client";

import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { Check, ChevronRight } from "lucide-react";
import { forwardRef, type ComponentPropsWithoutRef, type HTMLAttributes } from "react";
import { cn } from "../utils/cn";

export const Dropdown = DropdownMenuPrimitive.Root;
export const DropdownTrigger = DropdownMenuPrimitive.Trigger;
export const DropdownGroup = DropdownMenuPrimitive.Group;
export const DropdownRadioGroup = DropdownMenuPrimitive.RadioGroup;
export const DropdownSub = DropdownMenuPrimitive.Sub;

const contentClasses = cn(
  "border-line bg-surface text-ink z-50 min-w-[200px] overflow-hidden rounded-xl border p-1.5 text-sm shadow-[0_24px_60px_rgba(0,0,0,0.35)] outline-none",
  "data-[state=open]:animate-scale-in data-[state=closed]:animate-scale-out",
);

type ContentProps = ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>;

export const DropdownContent = forwardRef<HTMLDivElement, ContentProps>(
  ({ className, sideOffset = 6, align = "start", ...props }, ref) => (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        align={align}
        className={cn(contentClasses, className)}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  ),
);

DropdownContent.displayName = "DropdownContent";

const itemClasses =
  "relative flex cursor-default select-none items-center gap-2 rounded-md px-2.5 py-1.5 text-sm text-ink-2 outline-none transition-colors focus:bg-elev focus:text-ink data-[disabled]:pointer-events-none data-[disabled]:opacity-40";

type ItemProps = ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
  destructive?: boolean;
};

export const DropdownItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ className, destructive, ...props }, ref) => (
    <DropdownMenuPrimitive.Item
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

DropdownItem.displayName = "DropdownItem";

type CheckboxItemProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.CheckboxItem
>;

export const DropdownCheckboxItem = forwardRef<HTMLDivElement, CheckboxItemProps>(
  ({ className, children, checked, ...props }, ref) => (
    <DropdownMenuPrimitive.CheckboxItem
      ref={ref}
      checked={checked}
      className={cn(itemClasses, "pl-7", className)}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <Check size={12} />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  ),
);

DropdownCheckboxItem.displayName = "DropdownCheckboxItem";

type RadioItemProps = ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>;

export const DropdownRadioItem = forwardRef<HTMLDivElement, RadioItemProps>(
  ({ className, children, ...props }, ref) => (
    <DropdownMenuPrimitive.RadioItem
      ref={ref}
      className={cn(itemClasses, "pl-7", className)}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <span className="bg-brand h-1.5 w-1.5 rounded-full" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  ),
);

DropdownRadioItem.displayName = "DropdownRadioItem";

export function DropdownLabel({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label>) {
  return (
    <DropdownMenuPrimitive.Label
      className={cn(
        "text-ink-3 px-2.5 py-1.5 font-mono text-[10px] tracking-[0.14em] uppercase",
        className,
      )}
      {...props}
    />
  );
}

export function DropdownSeparator({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>) {
  return (
    <DropdownMenuPrimitive.Separator
      className={cn("bg-line-2 -mx-1.5 my-1 h-px", className)}
      {...props}
    />
  );
}

export function DropdownShortcut({
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

type SubTriggerProps = ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger>;

export const DropdownSubTrigger = forwardRef<HTMLDivElement, SubTriggerProps>(
  ({ className, children, ...props }, ref) => (
    <DropdownMenuPrimitive.SubTrigger
      ref={ref}
      className={cn(itemClasses, "data-[state=open]:bg-elev", className)}
      {...props}
    >
      {children}
      <ChevronRight size={12} className="text-ink-3 ml-auto" />
    </DropdownMenuPrimitive.SubTrigger>
  ),
);

DropdownSubTrigger.displayName = "DropdownSubTrigger";

type SubContentProps = ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>;

export const DropdownSubContent = forwardRef<HTMLDivElement, SubContentProps>(
  ({ className, ...props }, ref) => (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.SubContent
        ref={ref}
        className={cn(contentClasses, className)}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  ),
);

DropdownSubContent.displayName = "DropdownSubContent";
