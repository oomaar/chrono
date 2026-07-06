"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "../theme-provider";

const subscribe = () => {
  return () => {};
};

export function ThemeToggle() {
  const { mode, resolvedMode, setMode, toggleMode } = useTheme();
  const isMounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  const effectiveMode = isMounted ? mode : "system";
  const effectiveResolvedMode = isMounted ? resolvedMode : "light";

  return (
    <div className="border-line bg-elev flex items-center gap-2 rounded-full border p-1 text-xs">
      <button
        type="button"
        onClick={() => setMode("light")}
        className={`rounded-full px-3 py-1 transition-colors ${
          effectiveMode === "light" ? "bg-brand text-bg" : "text-ink-3 hover:text-ink"
        }`}
      >
        Light
      </button>
      <button
        type="button"
        onClick={() => setMode("dark")}
        className={`rounded-full px-3 py-1 transition-colors ${
          effectiveMode === "dark" ? "bg-brand text-bg" : "text-ink-3 hover:text-ink"
        }`}
      >
        Dark
      </button>
      <button
        type="button"
        onClick={() => setMode("system")}
        className={`rounded-full px-3 py-1 transition-colors ${
          effectiveMode === "system" ? "bg-brand text-bg" : "text-ink-3 hover:text-ink"
        }`}
      >
        System
      </button>
      <button
        type="button"
        onClick={toggleMode}
        className="border-line text-ink-3 hover:text-ink rounded-full border px-3 py-1 transition-colors"
      >
        Toggle ({effectiveResolvedMode})
      </button>
    </div>
  );
}
