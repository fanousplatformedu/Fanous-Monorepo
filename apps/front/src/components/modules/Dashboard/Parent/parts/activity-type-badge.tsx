"use client";

import { useI18n } from "@/hooks/useI18n";
import { cn } from "@/lib/utils";

export const ParentActivityTypeBadge = ({ type }: { type: string }) => {
  const { t } = useI18n();

  const toneClass =
    type === "ASSESSMENT_COMPLETED" || type === "RESULT_PUBLISHED"
      ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
      : type === "ASSIGNMENT_SUBMITTED" || type === "ASSIGNMENT_STARTED"
        ? "bg-blue-500/15 text-blue-700 dark:text-blue-300"
        : type === "SESSION_REQUESTED" ||
            type === "SESSION_BOOKED" ||
            type === "SESSION_COMPLETED"
          ? "bg-amber-500/15 text-amber-700 dark:text-amber-300"
          : "bg-secondary/40 text-foreground";

  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-xs font-medium",
        toneClass,
      )}
    >
      {t(`dashboard.parent.activities.types.${type}`)}
    </span>
  );
};
