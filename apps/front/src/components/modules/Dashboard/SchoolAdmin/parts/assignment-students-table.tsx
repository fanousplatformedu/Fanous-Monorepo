"use client";

import {
  TAssignmentDetailStudentsTableProps,
  TAssignmentResultsTableProps,
} from "@/types/modules";
import { DashboardLoadingCard } from "@modules/Dashboard/parts/dashboard-loading-card";
import { DashboardEmptyState } from "@modules/Dashboard/parts/dashboard-empty-state";
import { DashboardTableCard } from "@modules/Dashboard/parts/dashboard-table-card";
import { TablePagination } from "@elements/table-pagination";
import { PAGE_SIZE } from "@/utils/constant";
import { useI18n } from "@/hooks/useI18n";

import * as L from "lucide-react";
import { convertToPersianDate } from "@/utils/jalali-date-conversion";
import Link from "next/link";

export const AssignmentStudentsTable = ({
  page,
  items,
  total,
  isLoading,
  isFetching,
  onPageChange,
  assignmentId,
}: TAssignmentDetailStudentsTableProps) => {
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
          <thead className="bg-secondary/30 text-start">
            <tr>
              <th className="px-4 py-3 font-medium">
                {t(
                  "dashboard.schoolAdmin.assignmentDetail.assignedStudent.columns.name",
                )}
              </th>
              <th className="px-4 py-3 font-medium">
                {t(
                  "dashboard.schoolAdmin.assignmentDetail.assignedStudent.columns.familyName",
                )}
              </th>
              <th className="px-4 py-3 font-medium">
                {t(
                  "dashboard.schoolAdmin.assignmentDetail.assignedStudent.columns.startedAt",
                )}
              </th>
              <th className="px-4 py-3 font-medium">
                {t(
                  "dashboard.schoolAdmin.assignmentDetail.assignedStudent.columns.completionRate",
                )}
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                className="border-t border-border/40 text-center"
              >
                <td className="px-4 py-3">
                  {item.result?.id ? (
                    <Link
                      href={`/school-admin/dashboard/assignment/${assignmentId}/student-detail/${item.studentId}`}
                    >
                      <div className="font-medium">
                        {item.student?.fullName || "-"}
                      </div>
                    </Link>
                  ) : (
                    <div className="font-medium">
                      {item.student?.fullName || "-"}
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground"></div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-xs text-muted-foreground"></div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-xs text-muted-foreground">
                    {item.submittedAt
                      ? convertToPersianDate(
                          new Date(item.submittedAt).toISOString(),
                        )
                      : ""}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-xs text-muted-foreground">
                    {item.completionRate.toFixed(0)}
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
          {t("common.refreshing")}
        </p>
      ) : null}
    </DashboardTableCard>
  );
};
