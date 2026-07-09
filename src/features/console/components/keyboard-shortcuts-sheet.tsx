"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { Kbd, cn } from "@/features/design-system";

type ShortcutRow = { keys: string[]; label: string };

type ShortcutGroup = { title: string; rows: ShortcutRow[] };

const GROUPS: ShortcutGroup[] = [
  {
    title: "Command",
    rows: [
      { keys: ["⌘", "K"], label: "Focus the command bar from anywhere" },
      { keys: ["Enter"], label: "Commit the current command" },
      { keys: ["Tab"], label: "Accept the active suggestion" },
      { keys: ["Esc"], label: "Clear input or dismiss suggestions" },
      { keys: ["↑", "↓"], label: "Move between suggestions" },
    ],
  },
  {
    title: "Timeline",
    rows: [
      { keys: ["Space"], label: "Play / pause playback" },
      { keys: ["←", "→"], label: "Step 5 minutes" },
      { keys: ["⇧", "←"], label: "Step 1 hour" },
      { keys: ["Home"], label: "Jump to start of window" },
      { keys: ["End"], label: "Jump to end of window" },
      { keys: ["A"], label: "Pin playhead as A" },
      { keys: ["B"], label: "Pin playhead as B → compare" },
      { keys: ["C"], label: "Clear both pins" },
      { keys: ["1", "2"], label: "Jump to pin A / B" },
    ],
  },
  {
    title: "Navigation",
    rows: [
      { keys: ["Esc"], label: "Return to the console pane" },
      { keys: ["?"], label: "Show this shortcut sheet" },
    ],
  },
];

/**
 * Global keyboard-shortcuts sheet. Bound to `?` (Shift-/ on US layouts).
 * Ignored while a text input / dialog has focus so it never eats a real
 * question mark someone is typing.
 */
export function KeyboardShortcutsSheet() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (event: globalThis.KeyboardEvent) => {
      if (event.key !== "?" && !(event.shiftKey && event.key === "/")) return;
      if (event.defaultPrevented) return;
      const target = event.target as HTMLElement | null;
      if (target) {
        const tag = target.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || target.isContentEditable) {
          return;
        }
      }
      event.preventDefault();
      setOpen((v) => !v);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in fixed inset-0 z-40 bg-(--theme-scrim) backdrop-blur-sm" />
        <DialogPrimitive.Content
          className={cn(
            "fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2",
            "border-line-strong bg-surface text-ink max-h-[calc(100vh-64px)] w-[min(720px,calc(100vw-32px))] overflow-auto",
            "rounded-2xl border p-6 shadow-[0_24px_60px_rgba(0,0,0,0.55)] outline-none",
            "data-[state=open]:animate-scale-in data-[state=closed]:animate-scale-out",
          )}
        >
          <div className="mb-5 flex items-center gap-2">
            <DialogPrimitive.Title asChild>
              <p className="text-brand font-mono text-[10px] font-semibold tracking-[0.22em] uppercase">
                Keyboard · everything the mouse can do, faster
              </p>
            </DialogPrimitive.Title>
            <DialogPrimitive.Close
              aria-label="Close"
              className="text-ink-3 hover:bg-elev hover:text-ink ml-auto rounded-full p-1 transition-colors"
            >
              <X size={14} />
            </DialogPrimitive.Close>
          </div>
          <DialogPrimitive.Description className="sr-only">
            Keyboard shortcuts for Chrono.
          </DialogPrimitive.Description>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {GROUPS.map((group) => (
              <section key={group.title} className="space-y-3">
                <p className="text-ink-3 font-mono text-[10px] font-semibold tracking-[0.14em] uppercase">
                  {group.title}
                </p>
                <ul className="space-y-2">
                  {group.rows.map((row, index) => (
                    <li
                      key={`${group.title}-${index}`}
                      className="border-line-2 flex items-center gap-3 border-b pb-2 last:border-0"
                    >
                      <span className="text-ink-2 flex-1 text-xs">{row.label}</span>
                      <span className="flex flex-none items-center gap-1">
                        {row.keys.map((k, i) => (
                          <span key={i} className="flex items-center gap-1">
                            {i > 0 ? (
                              <span className="text-ink-3 font-mono text-[10px]">·</span>
                            ) : null}
                            <Kbd>{k}</Kbd>
                          </span>
                        ))}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          <p className="text-ink-3 border-line-2 mt-6 border-t pt-4 font-mono text-[10px] tracking-[0.14em] uppercase">
            Press <Kbd>?</Kbd> or <Kbd>Esc</Kbd> to close
          </p>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
