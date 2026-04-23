"use client";

import { TCounselorReviewsTable } from "@/types/modules";
import { DashboardTableCard } from "@modules/Dashboard/parts/dashboard-table-card";
import { TableActionButton } from "@elements/table-action-button";
import { TablePagination } from "@elements/table-pagination";
import { StatusBadge } from "@elements/status-badge";
import { PAGE_SIZE } from "@/utils/constant";
import { useI18n } from "@/hooks/useI18n";

import * as L from "lucide-react";

export const CounselorReviewsTable = ({
  page,
  total,
  items,
  isFetching,
  onPageChange,
  onViewDetail,
  onOpenAction,
}: TCounselorReviewsTable) => {
  const { t } = useI18n();

  return (
    <DashboardTableCard
      title={t("dashboard.counselor.reviews.table.title")}
      description={t("dashboard.counselor.reviews.table.description")}
    >
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-secondary/30 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">
                {t("dashboard.counselor.reviews.table.columns.student")}
              </th>
              <th className="px-4 py-3 font-medium">
                {t("dashboard.counselor.reviews.table.columns.assignment")}
              </th>
              <th className="px-4 py-3 font-medium">
                {t("dashboard.counselor.reviews.table.columns.status")}
              </th>
              <th className="px-4 py-3 font-medium">
                {t("dashboard.counselor.reviews.table.columns.createdAt")}
              </th>
              <th className="px-4 py-3 font-medium">
                {t("dashboard.counselor.reviews.table.columns.reviewedAt")}
              </th>
              <th className="px-4 py-3 font-medium text-right">
                {t("dashboard.counselor.reviews.table.columns.actions")}
              </th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => (
              <tr key={item.reviewId} className="border-t border-border/40">
                <td className="px-4 py-3 font-medium">{item.studentName}</td>

                <td className="px-4 py-3">{item.assignmentTitle}</td>

                <td className="px-4 py-3">
                  <StatusBadge value={item.status} />
                </td>

                <td className="px-4 py-3">
                  {new Date(item.createdAt).toLocaleString()}
                </td>

                <td className="px-4 py-3">
                  {item.reviewedAt
                    ? new Date(item.reviewedAt).toLocaleString()
                    : "-"}
                </td>

                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <TableActionButton
                      icon={L.Eye}
                      onClick={() => onViewDetail(item.reviewId)}
                      label={t("dashboard.counselor.reviews.table.viewAction")}
                    />

                    <TableActionButton
                      icon={L.FilePenLine}
                      variant="brandSoft"
                      label={t(
                        "dashboard.counselor.reviews.table.reviewAction",
                      )}
                      onClick={() => onOpenAction(item.reviewId)}
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
