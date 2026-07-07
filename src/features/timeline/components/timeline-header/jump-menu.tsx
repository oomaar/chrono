"use client";

import { cn } from "@/features/design-system";
import type { JumpPreset } from "../../types/timeline.types";
import { JUMP_PRESET_LABELS } from "../../utils/zoom-presets";

type JumpMenuProps = {
  onJump: (preset: JumpPreset) => void;
};

const PRESETS: JumpPreset[] = ["-24h", "-6h", "-1h", "-15m", "now", "+1h", "+6h", "+12h"];

export function JumpMenu({ onJump }: JumpMenuProps) {
  return (
    <div className="inline-flex items-center gap-0.5">
      <span className="text-ink-3 mr-1 font-mono text-[10px] tracking-[0.14em] uppercase">
        jump
      </span>
      {PRESETS.map((preset) => (
        <button
          key={preset}
          type="button"
          onClick={() => onJump(preset)}
          className={cn(
            "rounded px-1.5 py-0.5 font-mono text-[10px] font-medium tracking-widest transition-colors",
            preset === "now"
              ? "text-brand hover:text-brand"
              : preset.startsWith("+")
                ? "text-ink-3 hover:text-ink-2"
                : "text-ink-2 hover:text-ink",
          )}
        >
          {JUMP_PRESET_LABELS[preset]}
        </button>
      ))}
    </div>
  );
}
