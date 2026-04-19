"use client";

import { TAssignmentResultsTableProps } from "@/types/modules";
import { DashboardLoadingCard } from "@modules/Dashboard/parts/dashboard-loading-card";
import { DashboardEmptyState } from "@modules/Dashboard/parts/dashboard-empty-state";
import { DashboardTableCard } from "@modules/Dashboard/parts/dashboard-table-card";
import { TablePagination } from "@elements/table-pagination";
import { PAGE_SIZE } from "@/utils/constant";
import { useI18n } from "@/hooks/useI18n";

import * as L from "lucide-react";

export const AssignmentResultsTable = ({
  page,
  items,
  total,
  isLoading,
  isFetching,
  onPageChange,
}: TAssignmentResultsTableProps) => {
  const { t } = useI18n();

  if (isLoading) return <DashboardLoadingCard rows={6} />;

  if (!items.length)
    return (
      <DashboardEmptyState
        icon={L.BarChart3}
        title={t("dashboard.schoolAdmin.assignments.results.empty.title")}
        description={t(
          "dashboard.schoolAdmin.assignments.results.empty.description",
        )}
      />
    );

  return (
    <DashboardTableCard
      title={t("dashboard.schoolAdmin.assignments.results.title")}
      description={t("dashboard.schoolAdmin.assignments.results.description")}
    >
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-secondary/30 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">
                {t("dashboard.schoolAdmin.assignments.results.columns.student")}
              </th>
              <th className="px-4 py-3 font-medium">
                {t(
                  "dashboard.schoolAdmin.assignments.results.columns.assignment",
                )}
              </th>
              <th className="px-4 py-3 font-medium">
                {t("dashboard.schoolAdmin.assignments.results.columns.status")}
              </th>
              <th className="px-4 py-3 font-medium">
                {t(
                  "dashboard.schoolAdmin.assignments.results.columns.completionRate",
                )}
              </th>
              <th className="px-4 py-3 font-medium">
                {t(
                  "dashboard.schoolAdmin.assignments.results.columns.dominantKey",
                )}
              </th>
              <th className="px-4 py-3 font-medium">
                {t(
                  "dashboard.schoolAdmin.assignments.results.columns.createdAt",
                )}
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t border-border/40">
                <td className="px-4 py-3">
                  <div className="font-medium">
                    {item.student.fullName || "-"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {item.student.email || item.studentId}
                  </div>
                </td>
                <td className="px-4 py-3">
                  {item.studentAssignment.assignment.title}
                </td>
                <td className="px-4 py-3">{item.studentAssignment.status}</td>
                <td className="px-4 py-3">
                  {item.studentAssignment.completionRate}%
                </td>
                <td className="px-4 py-3">{item.dominantKey || "-"}</td>
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
