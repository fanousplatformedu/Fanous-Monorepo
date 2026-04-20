"use client";

import { DashboardTableCard } from "@modules/Dashboard/parts/dashboard-table-card";
import { TableActionButton } from "@elements/table-action-button";
import { TablePagination } from "@elements/table-pagination";
import { TChildTable } from "@/types/modules";
import { PAGE_SIZE } from "@/utils/constant";
import { useI18n } from "@/hooks/useI18n";

import * as L from "lucide-react";

export const ParentChildrenTable = ({
  page,
  total,
  items,
  isFetching,
  onPageChange,
  onOpenDetail,
}: TChildTable) => {
  const { t } = useI18n();

  return (
    <DashboardTableCard
      title={t("dashboard.parent.children.table.title")}
      description={t("dashboard.parent.children.table.description")}
    >
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-secondary/30 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">
                {t("dashboard.parent.children.table.columns.fullName")}
              </th>
              <th className="px-4 py-3 font-medium">
                {t("dashboard.parent.children.table.columns.email")}
              </th>
              <th className="px-4 py-3 font-medium">
                {t("dashboard.parent.children.table.columns.mobile")}
              </th>
              <th className="px-4 py-3 font-medium">
                {t("dashboard.parent.children.table.columns.grade")}
              </th>
              <th className="px-4 py-3 font-medium">
                {t("dashboard.parent.children.table.columns.classroom")}
              </th>
              <th className="px-4 py-3 font-medium text-right">
                {t("dashboard.parent.children.table.columns.actions")}
              </th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t border-border/40">
                <td className="px-4 py-3 font-medium">
                  {item.fullName || "-"}
                </td>
                <td className="px-4 py-3">{item.email || "-"}</td>
                <td className="px-4 py-3">{item.mobile || "-"}</td>
                <td className="px-4 py-3">
                  {item.currentEnrollment?.classroom?.grade?.name || "-"}
                </td>
                <td className="px-4 py-3">
                  {item.currentEnrollment?.classroom?.name || "-"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end">
                    <TableActionButton
                      icon={L.Eye}
                      label={t("dashboard.parent.children.table.viewAction")}
                      onClick={() => onOpenDetail(item.id)}
                    />
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
