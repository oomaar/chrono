export type ThemeMode = "light" | "dark" | "system";

export type ResolvedThemeMode = "light" | "dark";

export type ThemeContextValue = {
  mode: ThemeMode;
  resolvedMode: ResolvedThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
};
