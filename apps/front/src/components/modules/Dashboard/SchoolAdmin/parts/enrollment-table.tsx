"use client";

import { TEnrollmentTableProps } from "@/types/modules";
import { DashboardTableCard } from "@modules/Dashboard/parts/dashboard-table-card";
import { TablePagination } from "@elements/table-pagination";
import { PAGE_SIZE } from "@/utils/constant";
import { useI18n } from "@/hooks/useI18n";
import { Button } from "@ui/button";
import { cn } from "@/lib/utils";

export const EnrollmentTable = ({
  page,
  gradeMap,
  isClosing,
  isFetching,
  studentMap,
  enrollments,
  closedCount,
  activeCount,
  classroomMap,
  onPageChange,
  onCloseRequest,
  enrollmentsTotal,
  selectedGradeName,
  selectedYearLabel,
  selectedClassroomName,
}: TEnrollmentTableProps) => {
  const { t } = useI18n();

  return (
    <DashboardTableCard
      title={t("dashboard.schoolAdmin.enrollments.table.title")}
      description={t("dashboard.schoolAdmin.enrollments.table.description")}
    >
      <div className="mb-4 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-secondary/25 p-4">
          <p className="text-xs text-muted-foreground">
            {t("dashboard.schoolAdmin.enrollments.summary.classroom")}
          </p>

          <div className="mt-2 flex flex-wrap gap-2">
            <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              {selectedClassroomName || "-"}
            </span>

            {selectedGradeName ? (
              <span className="inline-flex rounded-full bg-secondary px-3 py-1 text-xs font-medium">
                {selectedGradeName}
              </span>
            ) : null}

            {selectedYearLabel ? (
              <span className="inline-flex rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                {selectedYearLabel}
              </span>
            ) : null}
          </div>
        </div>

        <div className="rounded-2xl bg-secondary/25 p-4">
          <p className="text-xs text-muted-foreground">
            {t("dashboard.schoolAdmin.enrollments.summary.active")}
          </p>
          <p className="mt-1 text-xl font-semibold">{activeCount}</p>
        </div>

        <div className="rounded-2xl bg-secondary/25 p-4">
          <p className="text-xs text-muted-foreground">
            {t("dashboard.schoolAdmin.enrollments.summary.closed")}
          </p>
          <p className="mt-1 text-xl font-semibold">{closedCount}</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-secondary/30 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">
                {t("dashboard.schoolAdmin.enrollments.table.columns.student")}
              </th>
              <th className="px-4 py-3 font-medium">
                {t("dashboard.schoolAdmin.enrollments.table.columns.email")}
              </th>
              <th className="px-4 py-3 font-medium">
                {t("dashboard.schoolAdmin.enrollments.table.columns.classroom")}
              </th>
              <th className="px-4 py-3 font-medium">
                {t("dashboard.schoolAdmin.enrollments.table.columns.started")}
              </th>
              <th className="px-4 py-3 font-medium">
                {t("dashboard.schoolAdmin.enrollments.table.columns.ended")}
              </th>
              <th className="px-4 py-3 font-medium">
                {t("dashboard.schoolAdmin.enrollments.table.columns.status")}
              </th>
              <th className="px-4 py-3 font-medium text-right">
                {t("dashboard.schoolAdmin.enrollments.table.columns.actions")}
              </th>
            </tr>
          </thead>

          <tbody>
            {enrollments.map((item) => {
              const student = studentMap.get(item.studentId);
              const classroom = classroomMap.get(item.classroomId);
              const grade = classroom?.gradeId
                ? gradeMap.get(classroom.gradeId)
                : null;
              const isClosed = Boolean(item.endedAt);

              const studentLabel =
                student?.fullName ||
                student?.email ||
                student?.mobile ||
                item.studentId;

              return (
                <tr key={item.id} className="border-t border-border/40">
                  <td className="px-4 py-3">
                    <div className="font-medium">{studentLabel}</div>
                    <div className="text-xs text-muted-foreground">
                      {item.studentId}
                    </div>
                  </td>

                  <td className="px-4 py-3">{student?.email || "-"}</td>

                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                        {classroom?.name || "-"}
                      </span>

                      {grade?.name ? (
                        <span className="inline-flex rounded-full bg-secondary px-3 py-1 text-xs font-medium">
                          {grade.name}
                        </span>
                      ) : null}

                      {classroom?.year ? (
                        <span className="inline-flex rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                          {classroom.year}
                        </span>
                      ) : null}
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    {new Date(item.startedAt).toLocaleString()}
                  </td>

                  <td className="px-4 py-3">
                    {item.endedAt
                      ? new Date(item.endedAt).toLocaleString()
                      : "-"}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "inline-flex rounded-full px-3 py-1 text-xs font-medium",
                        isClosed
                          ? "bg-muted text-muted-foreground"
                          : "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
                      )}
                    >
                      {isClosed
                        ? t("dashboard.schoolAdmin.enrollments.status.closed")
                        : t("dashboard.schoolAdmin.enrollments.status.active")}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      {!isClosed ? (
                        <Button
                          size="sm"
                          variant="brandOutline"
                          disabled={isClosing}
                          onClick={() =>
                            onCloseRequest({
                              id: item.id,
                              studentLabel,
                              classroomLabel: classroom?.name || "-",
                            })
                          }
                        >
                          {t("dashboard.schoolAdmin.enrollments.actions.close")}
                        </Button>
                      ) : (
                        <span className="text-muted-foreground">-</span>
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
        pageSize={PAGE_SIZE}
        onPageChange={onPageChange}
        total={enrollmentsTotal}
      />

      {isFetching ? (
        <p className="mt-3 text-xs text-muted-foreground">
          {t("common.refreshing", {}, "Refreshing...")}
        </p>
      ) : null}
    </DashboardTableCard>
  );
};
