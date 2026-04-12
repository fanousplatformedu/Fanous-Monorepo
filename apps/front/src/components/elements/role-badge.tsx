"use client";

import { getRoleBadgeTone, getRoleLabel } from "@/utils/auth-role-helper";
import { TRoleBadgeProps } from "@/types/elements";
import { cn } from "@/lib/utils";

const toneMap = {
  blue: "bg-blue-500/10 text-blue-700 dark:bg-white/8 dark:text-[var(--primary)]",
  green:
    "bg-emerald-500/10 text-emerald-700 dark:bg-white/8 dark:text-[var(--primary)]",
  amber:
    "bg-amber-500/10 text-amber-700 dark:bg-white/8 dark:text-[var(--primary)]",
};

export const RoleBadge = ({ role, className }: TRoleBadgeProps) => {
  const tone = getRoleBadgeTone(role);

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold",
        toneMap[tone],
        className,
      )}
    >
      {getRoleLabel(role)}
    </span>
  );
};
