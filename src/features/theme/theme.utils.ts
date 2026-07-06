import { THEME_ATTRIBUTE } from "./theme.constants";
import type { ResolvedThemeMode, ThemeMode } from "./theme.types";

export const THEME_MODES: ThemeMode[] = ["light", "dark", "system"];

export const isThemeMode = (value: string | null): value is ThemeMode => {
  return value !== null && THEME_MODES.includes(value as ThemeMode);
};

export const getSystemTheme = (
  darkModeQuery: MediaQueryList,
): ResolvedThemeMode => {
  return darkModeQuery.matches ? "dark" : "light";
};

export const resolveThemeMode = (
  mode: ThemeMode,
  systemMode: ResolvedThemeMode,
): ResolvedThemeMode => {
  if (mode === "system") {
    return systemMode;
  }

  return mode;
};

export const applyResolvedThemeMode = (
  root: HTMLElement,
  resolvedMode: ResolvedThemeMode,
): void => {
  root.setAttribute(THEME_ATTRIBUTE, resolvedMode);
  root.style.colorScheme = resolvedMode;
};
