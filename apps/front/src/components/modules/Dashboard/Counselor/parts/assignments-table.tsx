"use client";

import { TCounselorAssignmentsTableProps } from "@/types/modules";
import { DashboardTableCard } from "@modules/Dashboard/parts/dashboard-table-card";
import { TablePagination } from "@elements/table-pagination";
import { StatusBadge } from "@elements/status-badge";
import { PAGE_SIZE } from "@/utils/constant";
import { useI18n } from "@/hooks/useI18n";

export const CounselorAssignmentsTable = ({
  page,
  total,
  items,
  isFetching,
  onPageChange,
}: TCounselorAssignmentsTableProps) => {
  const { t } = useI18n();

  return (
    <DashboardTableCard
      title={t("dashboard.counselor.assignments.table.title")}
      description={t("dashboard.counselor.assignments.table.description")}
    >
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-secondary/30 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">
                {t("dashboard.counselor.assignments.table.columns.title")}
              </th>
              <th className="px-4 py-3 font-medium">
                {t("dashboard.counselor.assignments.table.columns.status")}
              </th>
              <th className="px-4 py-3 font-medium">
                {t("dashboard.counselor.assignments.table.columns.dueAt")}
              </th>
              <th className="px-4 py-3 font-medium">
                {t("dashboard.counselor.assignments.table.columns.publishedAt")}
              </th>
              <th className="px-4 py-3 font-medium">
                {t(
                  "dashboard.counselor.assignments.table.columns.totalAssigned",
                )}
              </th>
              <th className="px-4 py-3 font-medium">
                {t(
                  "dashboard.counselor.assignments.table.columns.pendingReviews",
                )}
              </th>
              <th className="px-4 py-3 font-medium">
                {t(
                  "dashboard.counselor.assignments.table.columns.reviewedCount",
                )}
              </th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => (
              <tr key={item.assignmentId} className="border-t border-border/40">
                <td className="px-4 py-3">
                  <div className="font-medium">{item.title || "-"}</div>
                </td>

                <td className="px-4 py-3">
                  <StatusBadge value={item.status} />
                </td>

                <td className="px-4 py-3">
                  {item.dueAt ? new Date(item.dueAt).toLocaleString() : "-"}
                </td>

                <td className="px-4 py-3">
                  {item.publishedAt
                    ? new Date(item.publishedAt).toLocaleString()
                    : "-"}
                </td>

                <td className="px-4 py-3">{item.totalAssignedStudents}</td>
                <td className="px-4 py-3">{item.pendingReviews}</td>
                <td className="px-4 py-3">{item.reviewedCount}</td>
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
