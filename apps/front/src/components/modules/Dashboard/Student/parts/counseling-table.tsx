"use client";

import { TStudentCounselingTable } from "@/types/modules";
import { DashboardTableCard } from "@modules/Dashboard/parts/dashboard-table-card";
import { TablePagination } from "@elements/table-pagination";
import { PAGE_SIZE } from "@/utils/constant";
import { useI18n } from "@/hooks/useI18n";
import { Button } from "@ui/button";

import Link from "next/link";

export const StudentCounselingTable = ({
  items,
  total,
  page,
  isFetching,
  onPageChange,
  onCancelSession,
}: TStudentCounselingTable) => {
  const { t } = useI18n();

  const getStatusLabel = (status: string) => {
    return t(`dashboard.student.counseling.status.${status}`);
  };

  const canCancel = (status: string) =>
    status === "REQUESTED" || status === "CONFIRMED";

  return (
    <DashboardTableCard
      title={t("dashboard.student.counseling.table.title")}
      description={t("dashboard.student.counseling.table.description")}
    >
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-secondary/30 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">
                {t("dashboard.student.counseling.table.columns.title")}
              </th>
              <th className="px-4 py-3 font-medium">
                {t("dashboard.student.counseling.table.columns.status")}
              </th>
              <th className="px-4 py-3 font-medium">
                {t("dashboard.student.counseling.table.columns.scheduledAt")}
              </th>
              <th className="px-4 py-3 font-medium">
                {t("dashboard.student.counseling.table.columns.meetingUrl")}
              </th>
              <th className="px-4 py-3 font-medium text-right">
                {t("dashboard.student.counseling.table.columns.actions")}
              </th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t border-border/40">
                <td className="px-4 py-3">
                  <div className="font-medium">{item.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {item.note || "-"}
                  </div>
                </td>

                <td className="px-4 py-3">{getStatusLabel(item.status)}</td>

                <td className="px-4 py-3">
                  {item.scheduledAt
                    ? new Date(item.scheduledAt).toLocaleString()
                    : "-"}
                </td>

                <td className="px-4 py-3">
                  {item.meetingUrl ? (
                    <Link
                      target="_blank"
                      rel="noreferrer"
                      href={item.meetingUrl}
                      className="text-primary underline underline-offset-4"
                    >
                      {t("dashboard.student.counseling.actions.openLink")}
                    </Link>
                  ) : (
                    "-"
                  )}
                </td>

                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    {canCancel(item.status) ? (
                      <Button
                        size="sm"
                        variant="brandSoft"
                        className="rounded-2xl"
                        onClick={() => onCancelSession(item)}
                      >
                        {t("dashboard.student.counseling.actions.cancel")}
                      </Button>
                    ) : (
                      <span className="text-xs text-muted-foreground">-</span>
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
          {t("common.refreshing", {}, "Refreshing...")}
        </p>
      ) : null}
    </DashboardTableCard>
  );
};
