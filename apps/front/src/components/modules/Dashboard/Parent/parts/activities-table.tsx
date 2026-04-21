"use client";

import { ParentActivityTypeBadge } from "@modules/Dashboard/Parent/parts/activity-type-badge";
import { DashboardTableCard } from "@modules/Dashboard/parts/dashboard-table-card";
import { TActivitiesTable } from "@/types/modules";
import { TablePagination } from "@elements/table-pagination";
import { PAGE_SIZE } from "@/utils/constant";
import { useI18n } from "@/hooks/useI18n";

export const ParentActivitiesTable = ({
  page,
  total,
  items,
  isFetching,
  onPageChange,
}: TActivitiesTable) => {
  const { t } = useI18n();

  return (
    <DashboardTableCard
      title={t("dashboard.parent.activities.table.title")}
      description={t("dashboard.parent.activities.table.description")}
    >
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-secondary/30 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">
                {t("dashboard.parent.activities.table.columns.child")}
              </th>
              <th className="px-4 py-3 font-medium">
                {t("dashboard.parent.activities.table.columns.type")}
              </th>
              <th className="px-4 py-3 font-medium">
                {t("dashboard.parent.activities.table.columns.title")}
              </th>
              <th className="px-4 py-3 font-medium">
                {t("dashboard.parent.activities.table.columns.description")}
              </th>
              <th className="px-4 py-3 font-medium">
                {t("dashboard.parent.activities.table.columns.createdAt")}
              </th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t border-border/40 align-top">
                <td className="px-4 py-3">
                  <div className="font-medium">
                    {item.student?.fullName || item.studentId || "-"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {item.student?.email || item.student?.mobile || "-"}
                  </div>
                </td>

                <td className="px-4 py-3">
                  <ParentActivityTypeBadge type={item.type} />
                </td>

                <td className="px-4 py-3 font-medium">{item.title}</td>

                <td className="px-4 py-3">
                  <div className="max-w-[420px] text-sm text-muted-foreground leading-6">
                    {item.description || "-"}
                  </div>
                </td>

                <td className="px-4 py-3">
                  {new Date(item.createdAt).toLocaleString()}
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
          {t("common.refreshing")}
        </p>
      ) : null}
    </DashboardTableCard>
  );
};
