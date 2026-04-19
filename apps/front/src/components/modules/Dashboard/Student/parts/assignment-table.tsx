"use client";

import { TStudentAssignmentTable } from "@/types/modules";
import { DashboardTableCard } from "@modules/Dashboard/parts/dashboard-table-card";
import { TablePagination } from "@elements/table-pagination";
import { PAGE_SIZE } from "@/utils/constant";
import { useI18n } from "@/hooks/useI18n";
import { Button } from "@ui/button";

export const StudentAssignmentTable = ({
  items,
  total,
  page,
  isFetching,
  onPageChange,
  onViewDetail,
}: TStudentAssignmentTable) => {
  const { t } = useI18n();

  const getStatusLabel = (status: string) => {
    return t(`dashboard.student.assignments.status.${status}`);
  };

  const getTargetModeLabel = (mode?: string | null) => {
    if (!mode) return "-";
    return t(`dashboard.student.assignments.targetModes.${mode}`);
  };

  return (
    <DashboardTableCard
      title={t("dashboard.student.assignments.table.title")}
      description={t("dashboard.student.assignments.table.description")}
    >
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-secondary/30 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">
                {t("dashboard.student.assignments.table.columns.title")}
              </th>
              <th className="px-4 py-3 font-medium">
                {t("dashboard.student.assignments.table.columns.status")}
              </th>
              <th className="px-4 py-3 font-medium">
                {t("dashboard.student.assignments.table.columns.target")}
              </th>
              <th className="px-4 py-3 font-medium">
                {t("dashboard.student.assignments.table.columns.completion")}
              </th>
              <th className="px-4 py-3 font-medium">
                {t("dashboard.student.assignments.table.columns.dueAt")}
              </th>
              <th className="px-4 py-3 font-medium text-right">
                {t("dashboard.student.assignments.table.columns.actions")}
              </th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t border-border/40">
                <td className="px-4 py-3">
                  <div className="font-medium">{item.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {item.description || "-"}
                  </div>
                </td>

                <td className="px-4 py-3">{getStatusLabel(item.status)}</td>

                <td className="px-4 py-3">
                  {getTargetModeLabel(item.targetMode)}
                </td>

                <td className="px-4 py-3">{item.completionRate}%</td>

                <td className="px-4 py-3">
                  {item.dueAt ? new Date(item.dueAt).toLocaleString() : "-"}
                </td>

                <td className="px-4 py-3">
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      variant="brand"
                      className="rounded-2xl"
                      onClick={() => onViewDetail(item.id)}
                    >
                      {t("dashboard.student.assignments.actions.view")}
                    </Button>
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
