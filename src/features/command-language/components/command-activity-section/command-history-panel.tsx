"use client";

import { Undo2 } from "lucide-react";
import { cn } from "@/features/design-system";
import { useConsole } from "@/features/console";
import { useCommandLanguage } from "../../command-language.provider";
import type { CommandReceipt } from "../../types/command-language.types";
import { formatTimingOffset } from "../../utils/format-timing";

const statusClass: Record<CommandReceipt["status"], string> = {
  committed: "text-brand",
  scheduled: "text-warn",
  reverted: "text-ink-3",
  cancelled: "text-ink-3",
  fired: "text-ok",
};

/**
 * Compact list of executed + reverted commands. Reversible receipts expose an
 * inline "undo" affordance.
 */
export function CommandHistoryPanel() {
  const { history, undo, isUndoable } = useCommandLanguage();
  const { timeline } = useConsole();

  if (history.filter((receipt) => receipt.status !== "scheduled").length === 0) {
    return (
      <p className="text-ink-3 py-4 text-center text-xs">
        No commands yet — try the composer.
      </p>
    );
  }

  return (
    <ul className="flex flex-col">
      {history
        .filter((receipt) => receipt.status !== "scheduled")
        .map((receipt) => (
          <li
            key={receipt.id}
            className="border-line-2 flex items-start gap-3 border-b py-2 text-xs last:border-0"
          >
            <span
              className={cn(
                "w-16 shrink-0 font-mono text-[10px] tracking-[0.14em] uppercase",
                statusClass[receipt.status],
              )}
            >
              {receipt.status}
            </span>
            <div className="min-w-0 flex-1 space-y-0.5">
              <p className="text-ink font-mono text-xs">{receipt.raw}</p>
              <p className="text-ink-3 font-mono text-[10px]">
                {receipt.affectedDeviceIds.length} devices ·{" "}
                {formatTimingOffset(receipt.effectiveAt, timeline.now)}
              </p>
            </div>
            {isUndoable(receipt.id) ? (
              <button
                type="button"
                onClick={() => undo(receipt.id)}
                className="text-ink-2 hover:text-ink flex items-center gap-1 font-mono text-[10px] tracking-[0.14em] uppercase"
              >
                <Undo2 size={11} />
                undo
              </button>
            ) : null}
          </li>
        ))}
    </ul>
  );
}
