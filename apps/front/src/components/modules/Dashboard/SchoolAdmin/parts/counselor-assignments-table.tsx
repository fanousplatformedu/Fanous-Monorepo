"use client";

import { TCounselorAssignmentsTable } from "@/types/modules";
import { DashboardTableCard } from "@modules/Dashboard/parts/dashboard-table-card";
import { TableActionButton } from "@elements/table-action-button";
import { TablePagination } from "@elements/table-pagination";
import { StatusBadge } from "@elements/status-badge";
import { PAGE_SIZE } from "@/utils/constant";
import { useI18n } from "@/hooks/useI18n";

import * as L from "lucide-react";

export const CounselorAssignmentsTable = ({
  page,
  total,
  items,
  onArchive,
  onRestore,
  isFetching,
  isArchiving,
  isRestoring,
  onPageChange,
}: TCounselorAssignmentsTable) => {
  const { t } = useI18n();

  return (
    <DashboardTableCard
      title={t("dashboard.schoolAdmin.counselorAssignments.table.title")}
      description={t(
        "dashboard.schoolAdmin.counselorAssignments.table.description",
      )}
    >
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-secondary/30 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">
                {t(
                  "dashboard.schoolAdmin.counselorAssignments.table.columns.counselor",
                )}
              </th>
              <th className="px-4 py-3 font-medium">
                {t(
                  "dashboard.schoolAdmin.counselorAssignments.table.columns.student",
                )}
              </th>
              <th className="px-4 py-3 font-medium">
                {t(
                  "dashboard.schoolAdmin.counselorAssignments.table.columns.status",
                )}
              </th>
              <th className="px-4 py-3 font-medium">
                {t(
                  "dashboard.schoolAdmin.counselorAssignments.table.columns.assignedAt",
                )}
              </th>
              <th className="px-4 py-3 font-medium text-right">
                {t(
                  "dashboard.schoolAdmin.counselorAssignments.table.columns.actions",
                )}
              </th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t border-border/40">
                <td className="px-4 py-3">
                  <div className="font-medium">
                    {item.counselor?.fullName || "-"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {item.counselor?.email || item.counselor?.mobile || "-"}
                  </div>
                </td>

                <td className="px-4 py-3">
                  <div className="font-medium">
                    {item.student?.fullName || "-"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {item.student?.email || item.student?.mobile || "-"}
                  </div>
                </td>

                <td className="px-4 py-3">
                  <StatusBadge value={item.status} />
                </td>

                <td className="px-4 py-3">
                  {new Date(item.assignedAt).toLocaleString()}
                </td>

                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    {item.status === "ACTIVE" ? (
                      <TableActionButton
                        icon={L.Archive}
                        variant="brandSoft"
                        loading={isArchiving}
                        label={t(
                          "dashboard.schoolAdmin.counselorAssignments.table.archiveAction",
                        )}
                        onClick={() => onArchive(item.id)}
                      />
                    ) : (
                      <TableActionButton
                        icon={L.RotateCcw}
                        variant="brandChip"
                        loading={isRestoring}
                        label={t(
                          "dashboard.schoolAdmin.counselorAssignments.table.restoreAction",
                        )}
                        onClick={() => onRestore(item.id)}
                      />
                    )}
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
