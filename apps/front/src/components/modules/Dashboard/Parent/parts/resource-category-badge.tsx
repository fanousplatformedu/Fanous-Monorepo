"use client";

import { useI18n } from "@/hooks/useI18n";
import { cn } from "@/lib/utils";

export const ParentResourceCategoryBadge = ({
  category,
}: {
  category: string;
}) => {
  const { t } = useI18n();

  const toneClass =
    category === "WELLBEING"
      ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
      : category === "CAREER_GUIDE"
        ? "bg-blue-500/15 text-blue-700 dark:text-blue-300"
        : category === "SUPPORT_TEEN"
          ? "bg-amber-500/15 text-amber-700 dark:text-amber-300"
          : category === "STUDY_SUPPORT"
            ? "bg-violet-500/15 text-violet-700 dark:text-violet-300"
            : "bg-secondary/40 text-foreground";

  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-xs font-medium",
        toneClass,
      )}
    >
      {t(`dashboard.parent.resources.categories.${category}`)}
    </span>
  );
};
