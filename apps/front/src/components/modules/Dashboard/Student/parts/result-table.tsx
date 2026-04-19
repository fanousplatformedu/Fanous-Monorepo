"use client";

import { DashboardTableCard } from "@modules/Dashboard/parts/dashboard-table-card";
import { TResultTableProps } from "@/types/modules";
import { TablePagination } from "@elements/table-pagination";
import { PAGE_SIZE } from "@/utils/constant";
import { Checkbox } from "@ui/checkbox";
import { useI18n } from "@/hooks/useI18n";
import { Button } from "@ui/button";

export const StudentResultTable = ({
  page,
  items,
  total,
  isFetching,
  compareIds,
  onPageChange,
  onViewDetail,
  onOpenCompare,
  onToggleCompare,
}: TResultTableProps) => {
  const { t } = useI18n();

  const getDominantLabel = (value?: string | null) => {
    if (!value) return t("dashboard.student.results.common.notAvailable");
    return t(`dashboard.student.results.intelligences.${value}`);
  };

  return (
    <DashboardTableCard
      title={t("dashboard.student.results.table.title")}
      description={t("dashboard.student.results.table.description")}
    >
      <div className="mb-4 flex justify-end">
        <Button
          variant="brand"
          className="rounded-2xl"
          onClick={() => onOpenCompare()}
          disabled={compareIds.length !== 2}
        >
          {t("dashboard.student.results.actions.compareSelected")}
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-secondary/30 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">
                {t("dashboard.student.results.table.columns.compare")}
              </th>
              <th className="px-4 py-3 font-medium">
                {t("dashboard.student.results.table.columns.assignment")}
              </th>
              <th className="px-4 py-3 font-medium">
                {t("dashboard.student.results.table.columns.dominant")}
              </th>
              <th className="px-4 py-3 font-medium">
                {t("dashboard.student.results.table.columns.createdAt")}
              </th>
              <th className="px-4 py-3 font-medium text-right">
                {t("dashboard.student.results.table.columns.actions")}
              </th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t border-border/40">
                <td className="px-4 py-3">
                  <Checkbox
                    checked={compareIds.includes(item.id)}
                    onCheckedChange={() => onToggleCompare(item.id)}
                  />
                </td>

                <td className="px-4 py-3">
                  <div className="font-medium">{item.assignmentTitle}</div>
                  <div className="text-xs text-muted-foreground">
                    {item.studentAssignmentId}
                  </div>
                </td>

                <td className="px-4 py-3">
                  {getDominantLabel(item.dominantIntelligence)}
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
                      {t("dashboard.student.results.actions.view")}
                    </Button>
                    <Button
                      size="sm"
                      variant="brand"
                      className="rounded-2xl"
                      onClick={() => onOpenCompare(item.id)}
                    >
                      {t("dashboard.student.results.actions.compare")}
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
