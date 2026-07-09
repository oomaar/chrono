const HINTS: Array<{ label: string; example: string }> = [
  { label: "act", example: "reboot berlin failures" },
  { label: "ask", example: "what changed at -6h" },
  { label: "compare", example: "berlin now vs before 14.2" },
  { label: "schedule", example: "when drift > 20 re-apply" },
];

/**
 * The four category hints that live directly under the command bar. Each
 * demonstrates one facet of Chrono's operational language (present action,
 * past investigation, temporal comparison, future automation) so the operator
 * always sees the shape of what's possible without opening a help panel.
 */
export function CommandHints() {
  return (
    <div className="text-ink-3 flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 pl-2 text-[11px]">
      {HINTS.map((hint) => (
        <span key={hint.label}>
          <span className="text-brand font-medium">{hint.label}</span>
          <span className="mx-1">—</span>
          <span className="text-ink-2 font-mono">{hint.example}</span>
        </span>
      ))}
      <span className="text-ink-3 ml-auto font-mono text-[10px] tracking-[0.14em] uppercase">
        press <span className="text-ink-2">?</span> for shortcuts
      </span>
    </div>
  );
}
