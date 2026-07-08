import { cn } from "@/features/design-system";
import type { IncidentChainStep } from "@/features/fake-db";

const toneClass: Record<IncidentChainStep["tone"], string> = {
  ok: "text-ok",
  warn: "text-warn",
  crit: "text-crit",
  brand: "text-brand",
  neutral: "text-ink-3",
};

const borderToneClass: Record<IncidentChainStep["tone"], string> = {
  ok: "border-l-ok",
  warn: "border-l-warn",
  crit: "border-l-crit",
  brand: "border-l-brand",
  neutral: "border-l-ink-3",
};

/**
 * Horizontal causal chain — TRIGGER → SIDE EFFECT → NOW — with arrow
 * separators between steps, matching the wireframe.
 */
export function CausalChain({ steps }: { steps: IncidentChainStep[] }) {
  if (steps.length === 0) return null;

  return (
    <section className="space-y-3">
      <p className="text-ink-3 font-mono text-[10px] tracking-[0.14em] uppercase">
        Causal chain · how this moment came to be
      </p>
      <div className="flex flex-col items-stretch gap-2 md:flex-row md:items-center md:gap-0">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;
          return (
            <div key={index} className="flex flex-1 items-stretch gap-0 md:items-center">
              <div
                className={cn(
                  "border-line bg-surface flex-1 rounded-xl border border-l-[3px] p-4",
                  borderToneClass[step.tone],
                )}
              >
                <p
                  className={cn(
                    "font-mono text-[9px] font-semibold tracking-[0.14em] uppercase",
                    toneClass[step.tone],
                  )}
                >
                  {step.label}
                </p>
                <p className="text-ink mt-2 text-xs leading-relaxed">{step.text}</p>
              </div>
              {!isLast ? (
                <span
                  aria-hidden
                  className="text-ink-3 hidden flex-none px-3 font-mono text-sm md:block"
                >
                  →
                </span>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
