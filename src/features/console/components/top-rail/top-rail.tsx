"use client";

import { ThemeToggle } from "@/features/theme";
import { BrandMark } from "./brand-mark";
import { LiveClock } from "./live-clock";
import { ModeStatement } from "../mode-statement";
import { UserAvatarChip } from "./user-avatar-chip";

/**
 * The top rail — 52px header with brand, mode statement, LIVE pill + clock,
 * and the user avatar. The mode statement is a *time* statement, never a page
 * breadcrumb.
 */
export function TopRail() {
  return (
    <header className="border-line bg-surface flex h-13 items-center gap-3 border-b px-4 sm:px-5">
      <BrandMark />
      <span className="bg-line hidden h-5 w-px md:block" />
      <ModeStatement />
      <div className="ml-auto flex items-center gap-3">
        <LiveClock />
        <span className="bg-line hidden h-5 w-px lg:block" />
        <div className="hidden lg:block">
          <ThemeToggle />
        </div>
        <UserAvatarChip />
      </div>
    </header>
  );
}
