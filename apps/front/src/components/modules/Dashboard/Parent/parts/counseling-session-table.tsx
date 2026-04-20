"use client";

import { TCounselingSessionTable } from "@/types/modules";
import { DashboardTableCard } from "@modules/Dashboard/parts/dashboard-table-card";
import { TableActionButton } from "@elements/table-action-button";
import { TablePagination } from "@elements/table-pagination";
import { PAGE_SIZE } from "@/utils/constant";
import { useI18n } from "@/hooks/useI18n";

import * as L from "lucide-react";

const getStatusLabelKey = (status: string) => {
  return `dashboard.parent.counseling.table.status.${status}`;
};

export const ParentCounselingSessionTable = ({
  page,
  total,
  items,
  isFetching,
  onPageChange,
  onCancelSession,
}: TCounselingSessionTable) => {
  const { t } = useI18n();

  return (
    <DashboardTableCard
      title={t("dashboard.parent.counseling.table.title")}
      description={t("dashboard.parent.counseling.table.description")}
    >
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-secondary/30 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">
                {t("dashboard.parent.counseling.table.columns.child")}
              </th>
              <th className="px-4 py-3 font-medium">
                {t("dashboard.parent.counseling.table.columns.title")}
              </th>
              <th className="px-4 py-3 font-medium">
                {t("dashboard.parent.counseling.table.columns.status")}
              </th>
              <th className="px-4 py-3 font-medium">
                {t("dashboard.parent.counseling.table.columns.scheduledAt")}
              </th>
              <th className="px-4 py-3 font-medium">
                {t("dashboard.parent.counseling.table.columns.meetingUrl")}
              </th>
              <th className="px-4 py-3 font-medium text-right">
                {t("dashboard.parent.counseling.table.columns.actions")}
              </th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t border-border/40">
                <td className="px-4 py-3">
                  <div className="font-medium">
                    {item.student?.fullName || item.studentId || "-"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {item.student?.email || item.student?.mobile || "-"}
                  </div>
                </td>

                <td className="px-4 py-3">
                  <div className="font-medium">{item.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {item.note || "-"}
                  </div>
                </td>

                <td className="px-4 py-3">
                  <span className="inline-flex rounded-full bg-secondary/40 px-3 py-1 text-xs font-medium text-foreground">
                    {t(getStatusLabelKey(item.status))}
                  </span>
                </td>

                <td className="px-4 py-3">
                  {item.scheduledAt
                    ? new Date(item.scheduledAt).toLocaleString()
                    : "-"}
                </td>

                <td className="px-4 py-3">
                  {item.meetingUrl ? (
                    <a
                      href={item.meetingUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary underline underline-offset-4"
                    >
                      {t("dashboard.parent.counseling.table.joinLink")}
                    </a>
                  ) : (
                    "-"
                  )}
                </td>

                <td className="px-4 py-3">
                  <div className="flex justify-end">
                    {item.status === "REQUESTED" ||
                    item.status === "CONFIRMED" ? (
                      <TableActionButton
                        icon={L.XCircle}
                        variant="brandSoft"
                        label={t(
                          "dashboard.parent.counseling.table.cancelAction",
                        )}
                        onClick={() => onCancelSession(item.id)}
                      />
                    ) : (
                      <span className="text-muted-foreground">-</span>
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
