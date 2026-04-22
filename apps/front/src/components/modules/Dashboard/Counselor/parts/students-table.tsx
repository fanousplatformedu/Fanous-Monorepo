"use client";

import { DashboardTableCard } from "@modules/Dashboard/parts/dashboard-table-card";
import { TableActionButton } from "@elements/table-action-button";
import { TablePagination } from "@elements/table-pagination";
import { TStudentsTable } from "@/types/modules";
import { StatusBadge } from "@elements/status-badge";
import { PAGE_SIZE } from "@/utils/constant";
import { useI18n } from "@/hooks/useI18n";

import * as L from "lucide-react";

export const CounselorStudentsTable = ({
  page,
  total,
  items,
  onExport,
  isFetching,
  onSchedule,
  onPageChange,
  onViewDetail,
}: TStudentsTable) => {
  const { t } = useI18n();

  return (
    <DashboardTableCard
      title={t("dashboard.counselor.student.table.title")}
      description={t("dashboard.counselor.student.table.description")}
    >
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-secondary/30 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">
                {t("dashboard.counselor.student.table.columns.student")}
              </th>
              <th className="px-4 py-3 font-medium">
                {t("dashboard.counselor.student.table.columns.status")}
              </th>
              <th className="px-4 py-3 font-medium">
                {t("dashboard.counselor.student.table.columns.grade")}
              </th>
              <th className="px-4 py-3 font-medium">
                {t("dashboard.counselor.student.table.columns.classroom")}
              </th>
              <th className="px-4 py-3 font-medium">
                {t("dashboard.counselor.student.table.columns.assignedAt")}
              </th>
              <th className="px-4 py-3 font-medium text-right">
                {t("dashboard.counselor.student.table.columns.actions")}
              </th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t border-border/40 align-top">
                <td className="px-4 py-3">
                  <div className="font-medium">{item.fullName || "-"}</div>
                  <div className="text-xs text-muted-foreground">
                    {item.email || item.mobile || "-"}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge value={item.status || "-"} />
                </td>
                =<td className="px-4 py-3">{item.gradeName || "-"}</td>
                <td className="px-4 py-3">{item.classroomName || "-"}</td>
                <td className="px-4 py-3">
                  {item.assignedAt
                    ? new Date(item.assignedAt).toLocaleDateString()
                    : "-"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <TableActionButton
                      icon={L.Eye}
                      onClick={() => onViewDetail(item.id)}
                      label={t(
                        "dashboard.counselor.student.table.actions.view",
                      )}
                    />
                    <TableActionButton
                      variant="brandSoft"
                      icon={L.CalendarPlus2}
                      onClick={() => onSchedule(item.id)}
                      label={t(
                        "dashboard.counselor.student.table.actions.schedule",
                      )}
                    />

                    <TableActionButton
                      icon={L.Download}
                      variant="brandSoft"
                      onClick={() => onExport(item.id)}
                      label={t(
                        "dashboard.counselor.student.table.actions.export",
                      )}
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
