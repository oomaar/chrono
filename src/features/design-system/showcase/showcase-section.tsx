import { type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../utils/cn";

type ShowcaseSectionProps = HTMLAttributes<HTMLElement> & {
  kicker: string;
  title: string;
  description?: string;
  children: ReactNode;
};

export function ShowcaseSection({
  kicker,
  title,
  description,
  className,
  children,
  ...props
}: ShowcaseSectionProps) {
  return (
    <section
      className={cn("border-line bg-surface rounded-2xl border p-8", className)}
      {...props}
    >
      <header className="mb-6 space-y-2">
        <p className="text-brand font-mono text-[10px] tracking-[0.22em] uppercase">
          {kicker}
        </p>
        <h2 className="text-ink text-xl font-semibold tracking-tight">{title}</h2>
        {description ? (
          <p className="text-ink-2 max-w-2xl text-sm">{description}</p>
        ) : null}
      </header>
      <div className="flex flex-col gap-8">{children}</div>
    </section>
  );
}

export function ShowcaseRow({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-3 md:flex-row md:items-start", className)}>
      <div className="text-ink-3 w-40 shrink-0 font-mono text-[10px] tracking-[0.16em] uppercase md:pt-2">
        {label}
      </div>
      <div className="flex flex-1 flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}
