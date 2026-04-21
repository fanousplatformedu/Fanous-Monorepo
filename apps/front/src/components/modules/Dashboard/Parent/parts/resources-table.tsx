"use client";

import { DashboardTableCard } from "@modules/Dashboard/parts/dashboard-table-card";
import { TableActionButton } from "@elements/table-action-button";
import { TResourcesTable } from "@/types/modules";
import { TablePagination } from "@elements/table-pagination";
import { PAGE_SIZE } from "@/utils/constant";
import { useI18n } from "@/hooks/useI18n";

import * as L from "lucide-react";
import { ParentResourceCategoryBadge } from "./resource-category-badge";

export const ParentResourcesTable = ({
  page,
  total,
  items,
  isFetching,
  onPageChange,
  onOpenDetail,
}: TResourcesTable) => {
  const { t } = useI18n();

  return (
    <DashboardTableCard
      title={t("dashboard.parent.resources.table.title")}
      description={t("dashboard.parent.resources.table.description")}
    >
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-secondary/30 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">
                {t("dashboard.parent.resources.table.columns.title")}
              </th>
              <th className="px-4 py-3 font-medium">
                {t("dashboard.parent.resources.table.columns.category")}
              </th>
              <th className="px-4 py-3 font-medium">
                {t("dashboard.parent.resources.table.columns.summary")}
              </th>
              <th className="px-4 py-3 font-medium">
                {t("dashboard.parent.resources.table.columns.createdAt")}
              </th>
              <th className="px-4 py-3 font-medium text-right">
                {t("dashboard.parent.resources.table.columns.actions")}
              </th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t border-border/40 align-top">
                <td className="px-4 py-3">
                  <div className="font-medium">{item.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {item.slug}
                  </div>
                </td>

                <td className="px-4 py-3">
                  <ParentResourceCategoryBadge category={item.category} />
                </td>

                <td className="px-4 py-3">
                  <div className="max-w-[420px] text-sm leading-6 text-muted-foreground">
                    {item.summary || "-"}
                  </div>
                </td>

                <td className="px-4 py-3">
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleString()
                    : "-"}
                </td>

                <td className="px-4 py-3">
                  <div className="flex justify-end">
                    <TableActionButton
                      icon={L.Eye}
                      onClick={() => onOpenDetail(item)}
                      label={t("dashboard.parent.resources.table.viewAction")}
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
