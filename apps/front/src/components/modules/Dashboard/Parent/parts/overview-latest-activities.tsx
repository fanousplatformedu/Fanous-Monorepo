"use client";

import { TActivityItem } from "@/types/modules";
import { useI18n } from "@/hooks/useI18n";

export const ParentOverviewLatestActivities = ({
  items,
}: {
  items: TActivityItem[];
}) => {
  const { t } = useI18n();

  if (!items.length)
    return (
      <p className="text-sm text-muted-foreground">
        {t("dashboard.parent.overview.common.noItems")}
      </p>
    );

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="rounded-2xl border border-border/50 bg-secondary/15 p-4"
        >
          <div className="mb-2 flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-foreground">
              {item.student?.fullName || item.studentId}
            </p>
            <span className="text-xs text-muted-foreground">
              {new Date(item.createdAt).toLocaleDateString()}
            </span>
          </div>

          <p className="text-sm text-foreground">
            {t(`dashboard.parent.activities.types.${item.type}`)}
          </p>

          <p className="mt-2 text-xs leading-6 text-muted-foreground">
            {item.title}
          </p>
        </div>
      ))}
    </div>
  );
};
