"use client";

import { TClassroomTableProps } from "@/types/modules";
import { DashboardTableCard } from "@modules/Dashboard/parts/dashboard-table-card";
import { TablePagination } from "@elements/table-pagination";
import { useI18n } from "@/hooks/useI18n";
import { Button } from "@ui/button";

export const ClassroomTable = ({
  page,
  total,
  onEdit,
  pageSize,
  gradeMap,
  classrooms,
  isUpdating,
  isFetching,
  isArchiving,
  activeCount,
  isRestoring,
  onPageChange,
  archivedCount,
  onToggleArchive,
}: TClassroomTableProps) => {
  const { t } = useI18n();

  return (
    <DashboardTableCard
      title={t("dashboard.schoolAdmin.classrooms.table.title")}
      description={t("dashboard.schoolAdmin.classrooms.table.description")}
    >
      <div className="mb-4 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-secondary/25 p-4">
          <p className="text-xs text-muted-foreground">
            {t("dashboard.schoolAdmin.classrooms.kpis.total")}
          </p>
          <p className="mt-1 text-xl font-semibold">{total}</p>
        </div>

        <div className="rounded-2xl bg-secondary/25 p-4">
          <p className="text-xs text-muted-foreground">
            {t("dashboard.schoolAdmin.classrooms.kpis.active")}
          </p>
          <p className="mt-1 text-xl font-semibold">{activeCount}</p>
        </div>

        <div className="rounded-2xl bg-secondary/25 p-4">
          <p className="text-xs text-muted-foreground">
            {t("dashboard.schoolAdmin.classrooms.kpis.archived")}
          </p>
          <p className="mt-1 text-xl font-semibold">{archivedCount}</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-secondary/30 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">
                {t("dashboard.schoolAdmin.classrooms.columns.name")}
              </th>
              <th className="px-4 py-3 font-medium">
                {t("dashboard.schoolAdmin.classrooms.columns.grade")}
              </th>
              <th className="px-4 py-3 font-medium">
                {t("dashboard.schoolAdmin.classrooms.columns.code")}
              </th>
              <th className="px-4 py-3 font-medium">
                {t("dashboard.schoolAdmin.classrooms.columns.year")}
              </th>
              <th className="px-4 py-3 font-medium">
                {t("dashboard.schoolAdmin.classrooms.columns.status")}
              </th>
              <th className="px-4 py-3 font-medium text-right">
                {t("dashboard.schoolAdmin.classrooms.columns.actions")}
              </th>
            </tr>
          </thead>

          <tbody>
            {classrooms.map((classroom) => {
              const grade = gradeMap.get(classroom.gradeId);
              const isArchived = !!classroom.deletedAt;

              return (
                <tr key={classroom.id} className="border-t border-border/40">
                  <td className="px-4 py-3 font-medium">{classroom.name}</td>

                  <td className="px-4 py-3">
                    {grade?.code
                      ? `${grade.name} (${grade.code})`
                      : grade?.name || "-"}
                  </td>

                  <td className="px-4 py-3">{classroom.code || "-"}</td>

                  <td className="px-4 py-3">{classroom.year || "-"}</td>

                  <td className="px-4 py-3">
                    <span
                      className={
                        isArchived
                          ? "inline-flex rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
                          : "inline-flex rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300"
                      }
                    >
                      {isArchived
                        ? t("dashboard.schoolAdmin.classrooms.status.archived")
                        : t("dashboard.schoolAdmin.classrooms.status.active")}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="brandSoft"
                        disabled={isUpdating}
                        className="rounded-2xl"
                        onClick={() => onEdit(classroom)}
                      >
                        {t("dashboard.schoolAdmin.classrooms.actions.edit")}
                      </Button>

                      <Button
                        size="sm"
                        variant="brandSoft"
                        className="rounded-2xl"
                        disabled={isArchiving || isRestoring}
                        onClick={() =>
                          onToggleArchive(classroom.id, classroom.deletedAt)
                        }
                      >
                        {isArchived
                          ? t(
                              "dashboard.schoolAdmin.classrooms.actions.restore",
                            )
                          : t(
                              "dashboard.schoolAdmin.classrooms.actions.archive",
                            )}
                      </Button>
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
        pageSize={pageSize}
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
