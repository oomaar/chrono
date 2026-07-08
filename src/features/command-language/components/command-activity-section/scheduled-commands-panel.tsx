"use client";

import { X } from "lucide-react";
import { useConsole } from "@/features/console";
import { useCommandLanguage } from "../../command-language.provider";
import { formatTimingOffset } from "../../utils/format-timing";

/**
 * List of scheduled commands that haven't fired or been cancelled yet.
 */
export function ScheduledCommandsPanel() {
  const { scheduled, cancelScheduled } = useCommandLanguage();
  const { timeline } = useConsole();

  if (scheduled.length === 0) {
    return <p className="text-ink-3 py-4 text-center text-xs">No scheduled commands.</p>;
  }

  return (
    <ul className="flex flex-col">
      {scheduled.map((receipt) => (
        <li
          key={receipt.id}
          className="border-line-2 flex items-start gap-3 border-b py-2 text-xs last:border-0"
        >
          <span className="text-warn w-14 shrink-0 font-mono text-[10px] tracking-[0.14em] uppercase">
            {formatTimingOffset(receipt.effectiveAt, timeline.now)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-ink font-mono text-xs">{receipt.raw}</p>
            <p className="text-ink-3 font-mono text-[10px]">
              {receipt.affectedDeviceIds.length} devices ·{" "}
              {new Date(receipt.effectiveAt).toISOString().slice(11, 16)} UTC
            </p>
          </div>
          <button
            type="button"
            onClick={() => cancelScheduled(receipt.id)}
            aria-label="Cancel scheduled command"
            className="text-ink-3 hover:text-crit"
          >
            <X size={12} />
          </button>
        </li>
      ))}
    </ul>
  );
}
