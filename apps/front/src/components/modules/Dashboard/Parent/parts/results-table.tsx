"use client";

import { DashboardTableCard } from "@modules/Dashboard/parts/dashboard-table-card";
import { TParentResultTable } from "@/types/modules";
import { TableActionButton } from "@elements/table-action-button";
import { TablePagination } from "@elements/table-pagination";
import { PAGE_SIZE } from "@/utils/constant";
import { useI18n } from "@/hooks/useI18n";

import * as L from "lucide-react";

export const ParentResultsTable = ({
  page,
  total,
  items,
  compareIds,
  isFetching,
  onPageChange,
  onViewDetail,
  onOpenCompare,
  onToggleCompare,
}: TParentResultTable) => {
  const { t } = useI18n();

  return (
    <DashboardTableCard
      title={t("dashboard.parent.results.table.title")}
      description={t("dashboard.parent.results.table.description")}
    >
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-secondary/30 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">
                {t("dashboard.parent.results.table.columns.child")}
              </th>
              <th className="px-4 py-3 font-medium">
                {t("dashboard.parent.results.table.columns.assignment")}
              </th>
              <th className="px-4 py-3 font-medium">
                {t("dashboard.parent.results.table.columns.dominant")}
              </th>
              <th className="px-4 py-3 font-medium">
                {t("dashboard.parent.results.table.columns.createdAt")}
              </th>
              <th className="px-4 py-3 font-medium text-right">
                {t("dashboard.parent.results.table.columns.actions")}
              </th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => {
              const selected = compareIds.includes(item.id);

              return (
                <tr key={item.id} className="border-t border-border/40">
                  <td className="px-4 py-3">
                    <div className="font-medium">
                      {item.student?.fullName || "-"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {item.student?.email || item.studentId}
                    </div>
                  </td>

                  <td className="px-4 py-3">{item.assignmentTitle || "-"}</td>

                  <td className="px-4 py-3">
                    {item.dominantIntelligence
                      ? t(
                          `dashboard.parent.results.intelligences.${item.dominantIntelligence}`,
                        )
                      : t("dashboard.parent.results.common.notAvailable")}
                  </td>

                  <td className="px-4 py-3">
                    {new Date(item.createdAt).toLocaleString()}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <TableActionButton
                        icon={L.Eye}
                        label={t("dashboard.parent.results.table.viewAction")}
                        onClick={() => onViewDetail(item.id)}
                      />

                      <TableActionButton
                        icon={L.Scale}
                        onClick={() => onToggleCompare(item.id)}
                        variant={selected ? "brand" : "brandChip"}
                        label={
                          selected
                            ? t(
                                "dashboard.parent.results.table.selectedCompareAction",
                              )
                            : t("dashboard.parent.results.table.compareAction")
                        }
                      />

                      <TableActionButton
                        variant="brandSoft"
                        icon={L.ArrowLeftRight}
                        onClick={() => onOpenCompare(item.id)}
                        label={t(
                          "dashboard.parent.results.table.openCompareAction",
                        )}
                      />
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
