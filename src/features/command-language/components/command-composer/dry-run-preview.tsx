import { cn } from "@/features/design-system";
import type { DryRunPreview } from "../../types/command-language.types";

type DryRunPreviewCardProps = {
  preview: DryRunPreview;
  isDryRun: boolean;
};

const reversibilityLabel: Record<
  DryRunPreview["reversibility"],
  { label: string; className: string }
> = {
  reversible: { label: "reversible", className: "text-ok" },
  "reversible-if-caught": {
    label: "reversible before it fires",
    className: "text-warn",
  },
  irreversible: { label: "not reversible", className: "text-crit" },
};

export function DryRunPreviewCard({ preview, isDryRun }: DryRunPreviewCardProps) {
  const reversibility = reversibilityLabel[preview.reversibility];

  return (
    <div className="border-line bg-elev/60 space-y-2 rounded-xl border p-3">
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "font-mono text-[10px] tracking-[0.14em] uppercase",
            isDryRun ? "text-warn" : "text-brand",
          )}
        >
          {isDryRun ? "Dry-run preview" : "Preview"}
        </span>
        <span className="text-ink-3 font-mono text-[10px] tracking-[0.14em]">
          · {reversibility.label}
        </span>
      </div>
      <p className="text-ink text-xs leading-relaxed">{preview.summary}</p>
      {preview.effects.length > 0 ? (
        <ul className="text-ink-2 flex flex-col gap-1 text-[11px] leading-relaxed">
          {preview.effects.map((effect, index) => (
            <li key={index}>· {effect}</li>
          ))}
        </ul>
      ) : null}
      {preview.warnings.length > 0 ? (
        <ul className="text-warn flex flex-col gap-1 text-[11px] leading-relaxed">
          {preview.warnings.map((warning, index) => (
            <li key={index}>⚠ {warning}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
