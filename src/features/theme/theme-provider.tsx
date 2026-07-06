"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { THEME_STORAGE_KEY } from "./theme.constants";
import type {
  ResolvedThemeMode,
  ThemeContextValue,
  ThemeMode,
} from "./theme.types";
import {
  applyResolvedThemeMode,
  getSystemTheme,
  isThemeMode,
  resolveThemeMode,
} from "./theme.utils";

const DEFAULT_THEME_MODE: ThemeMode = "system";
const DARK_MODE_QUERY = "(prefers-color-scheme: dark)";

const ThemeContext = createContext<ThemeContextValue | null>(null);

type ThemeProviderProps = {
  children: ReactNode;
};

const getStoredThemeMode = (): ThemeMode => {
  if (typeof window === "undefined") {
    return DEFAULT_THEME_MODE;
  }

  const storedValue = window.localStorage.getItem(THEME_STORAGE_KEY);
  return isThemeMode(storedValue) ? storedValue : DEFAULT_THEME_MODE;
};

const subscribeToSystemTheme = (onStoreChange: () => void): (() => void) => {
  if (typeof window === "undefined") {
    return () => {};
  }

  const mediaQuery = window.matchMedia(DARK_MODE_QUERY);
  mediaQuery.addEventListener("change", onStoreChange);

  return () => {
    mediaQuery.removeEventListener("change", onStoreChange);
  };
};

const getSystemThemeSnapshot = (): ResolvedThemeMode => {
  if (typeof window === "undefined") {
    return "light";
  }

  return getSystemTheme(window.matchMedia(DARK_MODE_QUERY));
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [mode, setMode] = useState<ThemeMode>(getStoredThemeMode);
  const systemMode = useSyncExternalStore<ResolvedThemeMode>(
    subscribeToSystemTheme,
    getSystemThemeSnapshot,
    () => "light",
  );
  const resolvedMode = resolveThemeMode(mode, systemMode);

  useEffect(() => {
    applyResolvedThemeMode(document.documentElement, resolvedMode);

    window.localStorage.setItem(THEME_STORAGE_KEY, mode);
  }, [mode, resolvedMode]);

  const setThemeMode = useCallback((nextMode: ThemeMode) => {
    setMode(nextMode);
  }, []);

  const toggleMode = useCallback(() => {
    setMode((currentMode) => {
      const currentResolvedMode =
        currentMode === "system"
          ? getSystemTheme(window.matchMedia(DARK_MODE_QUERY))
          : currentMode;

      return currentResolvedMode === "dark" ? "light" : "dark";
    });
  }, []);

  const value = useMemo<ThemeContextValue>(() => {
    return {
      mode,
      resolvedMode,
      setMode: setThemeMode,
      toggleMode,
    };
  }, [mode, resolvedMode, setThemeMode, toggleMode]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
}
