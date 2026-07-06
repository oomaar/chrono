import { Children, Fragment, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../utils/cn";

type KbdProps = HTMLAttributes<HTMLElement> & {
  keys?: string[];
  children?: ReactNode;
};

export function Kbd({ className, keys, children, ...props }: KbdProps) {
  const parts = keys ?? (children ? Children.toArray(children).map(String) : []);

  return (
    <span
      className={cn(
        "text-ink-3 inline-flex items-center gap-1 font-mono text-[10px]",
        className,
      )}
      {...props}
    >
      {parts.map((key, index) => (
        <Fragment key={`${key}-${index}`}>
          <kbd className="border-line bg-surface-2 text-ink-2 inline-flex h-5 min-w-5 items-center justify-center rounded-md border px-1.5 text-[10px] font-semibold tracking-tight shadow-[inset_0_-1px_0_rgba(0,0,0,0.25)]">
            {key}
          </kbd>
          {index < parts.length - 1 ? <span className="text-ink-3">+</span> : null}
        </Fragment>
      ))}
    </span>
  );
}
