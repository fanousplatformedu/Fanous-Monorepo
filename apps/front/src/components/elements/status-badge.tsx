"use client";

import { TStatusBadgeProps } from "@/types/elements";
import { useI18n } from "@/hooks/useI18n";
import { cn } from "@/lib/utils";

const statusClassMap: Record<string, string> = {
  ACTIVE:
    "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  APPROVED:
    "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",

  PENDING:
    "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  SUSPENDED:
    "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300",

  REJECTED:
    "border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-300",
  DISABLED:
    "border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-300",
  DELETED: "border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-300",

  ARCHIVED:
    "border-slate-500/20 bg-slate-500/10 text-slate-700 dark:text-slate-300",
};

const statusKeyMap: Record<string, string> = {
  ACTIVE: "status.active",
  APPROVED: "status.approved",
  PENDING: "status.pending",
  SUSPENDED: "status.suspended",
  REJECTED: "status.rejected",
  DISABLED: "status.disabled",
  DELETED: "status.deleted",
  ARCHIVED: "status.archived",
};

export const StatusBadge = ({ value, className }: TStatusBadgeProps) => {
  const { t } = useI18n();

  const normalized = String(value ?? "").toUpperCase();

  const label = statusKeyMap[normalized]
    ? t(statusKeyMap[normalized], {}, normalized)
    : normalized || "-";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
        statusClassMap[normalized] ??
          "border-border/60 bg-secondary/30 text-muted-foreground",
        className,
      )}
    >
      {label}
    </span>
  );
};
