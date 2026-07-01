"use client";

import { TAssignmentDetailStudentsTableProps } from "@/types/modules";
import { DashboardLoadingCard } from "@modules/Dashboard/parts/dashboard-loading-card";
import { DashboardEmptyState } from "@modules/Dashboard/parts/dashboard-empty-state";
import { DashboardTableCard } from "@modules/Dashboard/parts/dashboard-table-card";
import { TablePagination } from "@elements/table-pagination";
import { PAGE_SIZE } from "@/utils/constant";
import { useI18n } from "@/hooks/useI18n";
import { getInitials, formatPersonName } from "@/utils/function-helper";
import { cn } from "@/lib/utils";
import { Button } from "@ui/button";

import * as L from "lucide-react";
import { convertToPersianDate } from "@/utils/jalali-date-conversion";
import Link from "next/link";

const STATUS_STYLES: Record<string, string> = {
  NOT_STARTED: "bg-slate-500/15 text-slate-700 dark:text-slate-300",
  PENDING: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  IN_PROGRESS: "bg-sky-500/15 text-sky-700 dark:text-sky-300",
  SUBMITTED: "bg-violet-500/15 text-violet-700 dark:text-violet-300",
  EVALUATED: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
};

const formatDate = (value?: string | null) => {
  if (!value) return "—";
  return convertToPersianDate(new Date(value).toISOString());
};

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
        icon={L.Users}
        title={t("dashboard.schoolAdmin.assignmentDetail.students.empty.title")}
        description={t(
          "dashboard.schoolAdmin.assignmentDetail.students.empty.description",
        )}
      />
    );

  return (
    <DashboardTableCard
      title={t("dashboard.schoolAdmin.assignmentDetail.students.title")}
      description={t(
        "dashboard.schoolAdmin.assignmentDetail.students.description",
      )}
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
                  "dashboard.schoolAdmin.assignmentDetail.assignedStudent.columns.status",
                )}
              </th>
              <th className="px-4 py-3 font-medium">
                {t(
                  "dashboard.schoolAdmin.assignmentDetail.assignedStudent.columns.startedAt",
                )}
              </th>
              <th className="px-4 py-3 font-medium">
                {t(
                  "dashboard.schoolAdmin.assignmentDetail.assignedStudent.columns.submittedAt",
                )}
              </th>
              <th className="px-4 py-3 font-medium">
                {t(
                  "dashboard.schoolAdmin.assignmentDetail.assignedStudent.columns.completionRate",
                )}
              </th>
              <th className="px-4 py-3 text-end font-medium">
                {t(
                  "dashboard.schoolAdmin.assignmentDetail.assignedStudent.columns.actions",
                )}
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const completion = Math.round(item.completionRate ?? 0);
              const hasResult = Boolean(item.result?.id);

              return (
                <tr
                  key={item.id}
                  className="border-t border-border/40 transition-colors hover:bg-secondary/10"
                >
                  <td className="px-4 py-3">
                    {item.result?.id ? (
                      <Link
                        href={`/school-admin/dashboard/assignment/${assignmentId}/student-detail/${item.studentId}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-sm font-semibold text-primary">
                            {getInitials(item.student?.firstName, item.student?.lastName)}
                          </div>
                          <div className="min-w-0 text-start">
                            <p className="truncate font-medium text-foreground">
                              {formatPersonName(item.student?.firstName, item.student?.lastName) || "—"}
                            </p>
                            <p className="truncate text-xs text-muted-foreground">
                              {item.studentId}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ) : (
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-sm font-semibold text-primary">
                          {getInitials(item.student?.firstName, item.student?.lastName)}
                        </div>
                        <div className="min-w-0 text-start">
                          <p className="truncate font-medium text-foreground">
                            {formatPersonName(item.student?.firstName, item.student?.lastName) || "—"}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            {item.studentId}
                          </p>
                        </div>
                      </div>
                    )}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
                        STATUS_STYLES[item.status] ??
                          "bg-secondary text-muted-foreground",
                      )}
                    >
                      {t(
                        `dashboard.schoolAdmin.assignmentDetail.studentStatus.${item.status}`,
                      )}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-muted-foreground">
                    {formatDate(item.startedAt)}
                  </td>

                  <td className="px-4 py-3 text-muted-foreground">
                    {formatDate(item.submittedAt)}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex min-w-[120px] items-center gap-3">
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary/60">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-sky-400 to-blue-500 transition-all"
                          style={{ width: `${Math.min(completion, 100)}%` }}
                        />
                      </div>
                      <span className="w-10 text-end text-xs font-semibold text-foreground">
                        {completion}%
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      {hasResult ? (
                        <Button
                          asChild
                          size="sm"
                          variant="brandSoft"
                          className="rounded-2xl"
                        >
                          <Link
                            href={`/school-admin/dashboard/assignment/${assignmentId}/student-detail/${item.studentId}`}
                          >
                            <L.Eye className="h-4 w-4" />
                            {t(
                              "dashboard.schoolAdmin.assignmentDetail.assignedStudent.actions.viewResult",
                            )}
                          </Link>
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
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
