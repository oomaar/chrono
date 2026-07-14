"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useSyncExternalStore, type ComponentType } from "react";
import { cn } from "@/features/design-system";
import { useTheme } from "../theme-provider";
import type { ThemeMode } from "../theme.types";

const subscribe = () => {
  return () => {};
};

const MODE_ICON: Record<ThemeMode, ComponentType<{ size?: number }>> = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

const MODE_LABEL: Record<ThemeMode, string> = {
  light: "Light",
  dark: "Dark",
  system: "System",
};

const NEXT_MODE: Record<ThemeMode, ThemeMode> = {
  light: "dark",
  dark: "system",
  system: "light",
};

/**
 * Compact single-button theme cycler — Light → Dark → System → Light. Icon
 * reflects the *current* mode; aria-label reveals the mode name and what the
 * next click will do. Uses `useSyncExternalStore` to render a hydration-safe
 * placeholder before mount so SSR + client agree.
 */
export function ThemeToggle() {
  const { mode, setMode } = useTheme();
  const isMounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  const effectiveMode = isMounted ? mode : "system";
  const Icon = MODE_ICON[effectiveMode];
  const label = MODE_LABEL[effectiveMode];
  const nextLabel = MODE_LABEL[NEXT_MODE[effectiveMode]];

  return (
    <button
      type="button"
      onClick={() => setMode(NEXT_MODE[effectiveMode])}
      title={`Theme · ${label} — click for ${nextLabel}`}
      aria-label={`Theme: ${label}. Click to switch to ${nextLabel}.`}
      className={cn(
        "border-line bg-surface-2 text-ink-2 hover:border-line-strong hover:text-ink",
        "focus-visible:ring-brand/40 inline-flex h-7 w-7 items-center justify-center rounded-full border transition-colors",
        "focus-visible:ring-2 focus-visible:outline-none active:scale-95",
      )}
    >
      <Icon size={13} />
    </button>
  );
}
