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
    <div className="flex items-center gap-2 rounded-full border border-border-subtle bg-bg-elevated/80 p-1 text-xs">
      <button
        type="button"
        onClick={() => setMode("light")}
        className={`rounded-full px-3 py-1 transition-colors ${
          effectiveMode === "light"
            ? "bg-accent-cyan text-bg-canvas"
            : "text-text-muted hover:text-text-primary"
        }`}
      >
        Light
      </button>
      <button
        type="button"
        onClick={() => setMode("dark")}
        className={`rounded-full px-3 py-1 transition-colors ${
          effectiveMode === "dark"
            ? "bg-accent-cyan text-bg-canvas"
            : "text-text-muted hover:text-text-primary"
        }`}
      >
        Dark
      </button>
      <button
        type="button"
        onClick={() => setMode("system")}
        className={`rounded-full px-3 py-1 transition-colors ${
          effectiveMode === "system"
            ? "bg-accent-cyan text-bg-canvas"
            : "text-text-muted hover:text-text-primary"
        }`}
      >
        System
      </button>
      <button
        type="button"
        onClick={toggleMode}
        className="rounded-full border border-border-subtle px-3 py-1 text-text-muted transition-colors hover:text-text-primary"
      >
        Toggle ({effectiveResolvedMode})
      </button>
    </div>
  );
}
