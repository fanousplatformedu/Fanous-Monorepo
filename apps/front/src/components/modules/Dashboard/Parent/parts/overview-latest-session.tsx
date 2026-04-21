"use client";

import { TSessionItem } from "@/types/modules";
import { useI18n } from "@/hooks/useI18n";

export const ParentOverviewLatestSessions = ({
  items,
}: {
  items: TSessionItem[];
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
              {item.scheduledAt
                ? new Date(item.scheduledAt).toLocaleDateString()
                : new Date(item.createdAt).toLocaleDateString()}
            </span>
          </div>

          <p className="text-sm text-foreground">{item.title}</p>

          <p className="mt-2 text-xs text-primary">
            {t(`dashboard.parent.counseling.table.status.${item.status}`)}
          </p>
        </div>
      ))}
    </div>
  );
};
