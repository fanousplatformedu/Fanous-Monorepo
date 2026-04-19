"use client";

import { TStudentNotificationTable } from "@/types/modules";
import { DashboardTableCard } from "@modules/Dashboard/parts/dashboard-table-card";
import { TablePagination } from "@elements/table-pagination";
import { PAGE_SIZE } from "@/utils/constant";
import { useI18n } from "@/hooks/useI18n";
import { Button } from "@ui/button";
import { cn } from "@/lib/utils";

export const StudentNotificationTable = ({
  items,
  total,
  page,
  isFetching,
  isMarkingRead,
  onPageChange,
  onViewDetail,
  onMarkAsRead,
}: TStudentNotificationTable) => {
  const { t } = useI18n();

  const getTypeLabel = (type: string) => {
    const key = `dashboard.student.notifications.types.${type}`;
    return t(key);
  };

  return (
    <DashboardTableCard
      title={t("dashboard.student.notifications.table.title")}
      description={t("dashboard.student.notifications.table.description")}
    >
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-secondary/30 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">
                {t("dashboard.student.notifications.table.columns.title")}
              </th>
              <th className="px-4 py-3 font-medium">
                {t("dashboard.student.notifications.table.columns.type")}
              </th>
              <th className="px-4 py-3 font-medium">
                {t("dashboard.student.notifications.table.columns.status")}
              </th>
              <th className="px-4 py-3 font-medium">
                {t("dashboard.student.notifications.table.columns.createdAt")}
              </th>
              <th className="px-4 py-3 font-medium text-right">
                {t("dashboard.student.notifications.table.columns.actions")}
              </th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                className={cn(
                  "border-t border-border/40",
                  !item.isRead && "bg-primary/5",
                )}
              >
                <td className="px-4 py-3">
                  <div className="font-medium">{item.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {item.body}
                  </div>
                </td>

                <td className="px-4 py-3">{getTypeLabel(item.type)}</td>

                <td className="px-4 py-3">
                  {item.isRead
                    ? t("dashboard.student.notifications.status.read")
                    : t("dashboard.student.notifications.status.unread")}
                </td>

                <td className="px-4 py-3">
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleString()
                    : "-"}
                </td>

                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="brandSoft"
                      className="rounded-2xl"
                      onClick={() => onViewDetail(item.id)}
                    >
                      {t("dashboard.student.notifications.actions.view")}
                    </Button>

                    {!item.isRead ? (
                      <Button
                        size="sm"
                        variant="brand"
                        className="rounded-2xl"
                        disabled={isMarkingRead}
                        onClick={() => onMarkAsRead(item.id)}
                      >
                        {t(
                          "dashboard.student.notifications.actions.markAsRead",
                        )}
                      </Button>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <TablePagination
        page={page}
        total={total}
        pageSize={PAGE_SIZE}
        onPageChange={onPageChange}
      />

      {isFetching ? (
        <p className="mt-3 text-xs text-muted-foreground">
          {t("common.refreshing", {}, "Refreshing...")}
        </p>
      ) : null}
    </DashboardTableCard>
  );
};
