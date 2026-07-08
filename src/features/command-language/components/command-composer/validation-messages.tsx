import { cn } from "@/features/design-system";
import type { ValidationIssue } from "../../types/command-language.types";

type ValidationMessagesProps = {
  issues: ValidationIssue[];
};

/** Renders inline validation errors + warnings below the command bar. */
export function ValidationMessages({ issues }: ValidationMessagesProps) {
  if (issues.length === 0) return null;

  return (
    <ul className="flex flex-col gap-1 text-[11px]">
      {issues.map((issue, index) => (
        <li
          key={index}
          className={cn(
            "flex items-start gap-1 leading-relaxed",
            issue.severity === "error" ? "text-crit" : "text-warn",
          )}
        >
          <span className="font-mono">{issue.severity === "error" ? "✕" : "⚠"}</span>
          <span>{issue.message}</span>
        </li>
      ))}
    </ul>
  );
}
