"use client";

import { DashboardTableCard } from "@modules/Dashboard/parts/dashboard-table-card";
import { TGradeTableProps } from "@/types/modules";
import { TablePagination } from "@elements/table-pagination";
import { useI18n } from "@/hooks/useI18n";
import { Button } from "@ui/button";

export const GradeTable = ({
  page,
  total,
  items,
  onEdit,
  pageSize,
  isFetching,
  isUpdating,
  isArchiving,
  isRestoring,
  onPageChange,
  onToggleArchive,
}: TGradeTableProps) => {
  const { t } = useI18n();

  return (
    <DashboardTableCard
      title={t("dashboard.schoolAdmin.grades.table.title")}
      description={t("dashboard.schoolAdmin.grades.table.description")}
    >
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-secondary/30 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">
                {t("dashboard.schoolAdmin.grades.table.columns.name")}
              </th>
              <th className="px-4 py-3 font-medium">
                {t("dashboard.schoolAdmin.grades.table.columns.code")}
              </th>
              <th className="px-4 py-3 font-medium">
                {t("dashboard.schoolAdmin.grades.table.columns.status")}
              </th>
              <th className="px-4 py-3 font-medium">
                {t("dashboard.schoolAdmin.grades.table.columns.createdAt")}
              </th>
              <th className="px-4 py-3 font-medium text-right">
                {t("dashboard.schoolAdmin.grades.table.columns.actions")}
              </th>
            </tr>
          </thead>

          <tbody>
            {items.map((grade) => {
              const isArchived = Boolean(grade.deletedAt);
              return (
                <tr key={grade.id} className="border-t border-border/40">
                  <td className="px-4 py-3 font-medium">{grade.name}</td>
                  <td className="px-4 py-3">{grade.code || "-"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        isArchived
                          ? "inline-flex rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
                          : "inline-flex rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300"
                      }
                    >
                      {isArchived
                        ? t("dashboard.schoolAdmin.grades.status.archived")
                        : t("dashboard.schoolAdmin.grades.status.active")}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    {new Date(grade.createdAt).toLocaleDateString()}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="brandChip"
                        disabled={isUpdating}
                        className="rounded-2xl"
                        onClick={() => onEdit(grade)}
                      >
                        {t("dashboard.schoolAdmin.grades.actions.edit")}
                      </Button>
                      <Button
                        size="sm"
                        variant="brandSoft"
                        className="rounded-2xl"
                        disabled={isArchiving || isRestoring}
                        onClick={() =>
                          onToggleArchive(grade.id, grade.deletedAt)
                        }
                      >
                        {isArchived
                          ? t("dashboard.schoolAdmin.grades.actions.restore")
                          : t("dashboard.schoolAdmin.grades.actions.archive")}
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
