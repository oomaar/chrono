import { Avatar, AvatarFallback } from "@/features/design-system";

/**
 * The demo user chip in the top-right. Static for now — no auth flow.
 */

type UserAvatarChipProps = {
  initials?: string;
  name?: string;
  role?: string;
};

export function UserAvatarChip({
  initials = "AK",
  name = "Ada Keller",
  role = "Operator · on-call",
}: UserAvatarChipProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="hidden text-right md:block">
        <p className="text-ink text-xs leading-tight font-medium">{name}</p>
        <p className="text-ink-3 font-mono text-[10px] leading-tight tracking-[0.14em] uppercase">
          {role}
        </p>
      </div>
      <Avatar size="sm" className="rounded-md">
        <AvatarFallback className="rounded-md">{initials}</AvatarFallback>
      </Avatar>
    </div>
  );
}
