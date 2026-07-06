import { type ReactNode } from "react";
import { cn } from "../utils/cn";

type ScreenStateTone = "brand" | "crit" | "warn" | "ok" | "neutral";

type ScreenStateProps = {
  tone?: ScreenStateTone;
  kicker: string;
  title: string;
  description?: ReactNode;
  meta?: string;
  illustration: ReactNode;
  action?: ReactNode;
  footnote?: string;
  containerClassName?: string;
  cardClassName?: string;
};

const toneKickerClass: Record<ScreenStateTone, string> = {
  brand: "text-brand",
  crit: "text-crit",
  warn: "text-warn",
  ok: "text-ok",
  neutral: "text-ink-3",
};

const toneGlowClass: Record<ScreenStateTone, string> = {
  brand: "bg-[radial-gradient(circle_at_50%_35%,rgba(198,242,78,0.09),transparent_55%)]",
  crit: "bg-[radial-gradient(circle_at_50%_35%,rgba(242,106,111,0.10),transparent_55%)]",
  warn: "bg-[radial-gradient(circle_at_50%_35%,rgba(230,163,58,0.09),transparent_55%)]",
  ok: "bg-[radial-gradient(circle_at_50%_35%,rgba(56,201,168,0.08),transparent_55%)]",
  neutral:
    "bg-[radial-gradient(circle_at_50%_35%,rgba(162,158,148,0.06),transparent_55%)]",
};

export function ScreenState({
  tone = "brand",
  kicker,
  title,
  description,
  meta,
  illustration,
  action,
  footnote,
  containerClassName,
  cardClassName,
}: ScreenStateProps) {
  return (
    <div
      className={cn(
        "bg-bg text-ink relative flex items-center justify-center px-6",
        containerClassName ?? "min-h-screen",
      )}
    >
      <div className={cn("pointer-events-none absolute inset-0", toneGlowClass[tone])} />

      <section
        className={cn(
          "border-line bg-surface relative flex w-full max-w-xl flex-col items-center gap-8 rounded-2xl border p-10 text-center shadow-[0_24px_60px_rgba(0,0,0,0.35)]",
          cardClassName,
        )}
      >
        <div className="text-ink-3">{illustration}</div>

        <div className="space-y-3">
          <p
            className={cn(
              "font-mono text-[11px] tracking-[0.22em] uppercase",
              toneKickerClass[tone],
            )}
          >
            {kicker}
          </p>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
          {description ? <p className="text-ink-2 text-sm">{description}</p> : null}
          {meta ? (
            <p className="text-ink-3 font-mono text-[10px] tracking-[0.18em]">{meta}</p>
          ) : null}
        </div>

        {action || footnote ? (
          <div className="flex flex-col items-center gap-2">
            {action}
            {footnote ? (
              <p className="text-ink-3 font-mono text-[10px] tracking-[0.18em]">
                {footnote}
              </p>
            ) : null}
          </div>
        ) : null}
      </section>
    </div>
  );
}
