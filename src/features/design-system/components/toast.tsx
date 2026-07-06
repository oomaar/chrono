"use client";

import { Toaster as SonnerToaster, toast, type ToasterProps } from "sonner";
import { useTheme } from "@/features/theme";

export function Toaster(props: ToasterProps) {
  const { resolvedMode } = useTheme();

  return (
    <SonnerToaster
      theme={resolvedMode}
      position="bottom-right"
      offset={16}
      gap={10}
      duration={4500}
      closeButton
      style={
        {
          "--normal-bg": "var(--theme-surface)",
          "--normal-text": "var(--theme-ink)",
          "--normal-border": "var(--theme-line)",
          "--success-bg": "var(--theme-surface)",
          "--success-text": "var(--theme-ink)",
          "--success-border":
            "color-mix(in srgb, var(--theme-ok) 40%, var(--theme-line))",
          "--error-bg": "var(--theme-surface)",
          "--error-text": "var(--theme-ink)",
          "--error-border":
            "color-mix(in srgb, var(--theme-crit) 40%, var(--theme-line))",
          "--info-bg": "var(--theme-surface)",
          "--info-text": "var(--theme-ink)",
          "--info-border": "var(--theme-line)",
          "--warning-bg": "var(--theme-surface)",
          "--warning-text": "var(--theme-ink)",
          "--warning-border":
            "color-mix(in srgb, var(--theme-warn) 40%, var(--theme-line))",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast:
            "chrono-toast group !bg-surface !text-ink !border-line flex items-start gap-3 !rounded-xl !p-4 !text-sm shadow-[0_24px_60px_rgba(0,0,0,0.4)]",
          title: "!text-ink !font-semibold",
          description: "!text-ink-2 !text-xs",
          actionButton:
            "!bg-brand !text-bg !rounded-full !px-3 !py-1 !text-xs !font-semibold hover:!opacity-90",
          cancelButton:
            "!bg-elev !text-ink-2 !rounded-full !px-3 !py-1 !text-xs !font-semibold hover:!text-ink",
          closeButton: "!bg-elev !text-ink-2 !border-line hover:!bg-surface-2",
          success: "!bg-surface !text-ink !border-ok/40 [&_[data-icon]]:!text-ok",
          error: "!bg-surface !text-ink !border-crit/40 [&_[data-icon]]:!text-crit",
          info: "!bg-surface !text-ink !border-line",
          warning: "!bg-surface !text-ink !border-warn/40 [&_[data-icon]]:!text-warn",
        },
      }}
      {...props}
    />
  );
}

export { toast };
