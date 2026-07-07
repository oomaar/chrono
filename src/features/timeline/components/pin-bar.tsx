"use client";

import { X } from "lucide-react";
import { differenceInMinutes } from "@/features/fake-db";
import { cn } from "@/features/design-system";
import type { PinSlot, PinState } from "../types/timeline.types";

type PinBarProps = {
  pins: PinState;
  now: string;
  onJumpToPin: (slot: PinSlot) => void;
  onClearPin: (slot: PinSlot) => void;
  onClearAll: () => void;
};

const formatOffset = (iso: string | null, now: string): string => {
  if (!iso) return "—";
  const min = differenceInMinutes(iso, now);
  if (Math.abs(min) < 1) return "now";
  const sign = min < 0 ? "−" : "+";
  const abs = Math.abs(min);
  if (abs < 60) return `${sign}${Math.round(abs)}m`;
  return `${sign}${(abs / 60).toFixed(1)}h`;
};

/**
 * Compact summary chip for pinned moments — appears in the spine header when
 * at least one pin is set. Clicking a pin jumps the playhead there; the small
 * X removes it. The "clear" button removes both.
 */
export function PinBar({ pins, now, onJumpToPin, onClearPin, onClearAll }: PinBarProps) {
  const hasA = pins.A !== null;
  const hasB = pins.B !== null;
  if (!hasA && !hasB) return null;

  return (
    <div className="border-line bg-surface-2 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs">
      <span className="text-ink-3 font-mono text-[10px] tracking-[0.14em] uppercase">
        pinned
      </span>

      {hasA ? (
        <span className="inline-flex items-center gap-1">
          <button
            type="button"
            onClick={() => onJumpToPin("A")}
            className={cn(
              "text-ink-2 hover:text-ink font-mono text-[10px] tracking-[0.14em]",
            )}
          >
            A · {formatOffset(pins.A, now)}
          </button>
          <button
            type="button"
            onClick={() => onClearPin("A")}
            aria-label="Clear pin A"
            className="text-ink-3 hover:text-ink"
          >
            <X size={10} />
          </button>
        </span>
      ) : null}

      {hasA && hasB ? <span className="text-ink-3">→</span> : null}

      {hasB ? (
        <span className="inline-flex items-center gap-1">
          <button
            type="button"
            onClick={() => onJumpToPin("B")}
            className="text-brand font-mono text-[10px] tracking-[0.14em]"
          >
            B · {formatOffset(pins.B, now)}
          </button>
          <button
            type="button"
            onClick={() => onClearPin("B")}
            aria-label="Clear pin B"
            className="text-ink-3 hover:text-ink"
          >
            <X size={10} />
          </button>
        </span>
      ) : null}

      {hasA && hasB ? (
        <button
          type="button"
          onClick={onClearAll}
          className="text-ink-3 hover:text-ink ml-1 font-mono text-[10px] tracking-[0.14em]"
        >
          clear
        </button>
      ) : null}
    </div>
  );
}
