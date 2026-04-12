"use client";

import { useSchoolAdminAuditLogsQuery } from "@/lib/redux/api";
import { DashboardLoadingCard } from "@elements/dashboard-loading-card";
import { DashboardEmptyState } from "@elements/dashboard-empty-state";
import { DashboardTableCard } from "@elements/dashboard-table-card";
import { TablePagination } from "@elements/table-pagination";
import { PAGE_SIZE } from "@/utils/constant";
import { useState } from "react";
import { useI18n } from "@/hooks/useI18n";

import * as L from "lucide-react";

const SchoolAdminAuditLogsPage = () => {
  const { t } = useI18n();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useSchoolAdminAuditLogsQuery({
    take: PAGE_SIZE,
    skip: (page - 1) * PAGE_SIZE,
  });

  const items = data?.items ?? [];
  const total = data?.total ?? 0;

  if (isLoading) return <DashboardLoadingCard rows={8} />;

  if (!items.length)
    return (
      <DashboardEmptyState
        icon={L.ScrollText}
        title={t(
          "dashboard.schoolAdmin.auditLogs.empty.title",
          {},
          "No audit logs",
        )}
        description={t(
          "dashboard.schoolAdmin.auditLogs.empty.description",
          {},
          "Audit records for your school will appear here.",
        )}
      />
    );

  return (
    <DashboardTableCard
      title={t("dashboard.schoolAdmin.auditLogs.table.title", {}, "Audit Logs")}
      description={t(
        "dashboard.schoolAdmin.auditLogs.table.description",
        {},
        "School-level audit history.",
      )}
    >
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-secondary/30 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">
                {t(
                  "dashboard.schoolAdmin.auditLogs.columns.action",
                  {},
                  "Action",
                )}
              </th>
              <th className="px-4 py-3 font-medium">
                {t(
                  "dashboard.schoolAdmin.auditLogs.columns.actor",
                  {},
                  "Actor",
                )}
              </th>
              <th className="px-4 py-3 font-medium">
                {t(
                  "dashboard.schoolAdmin.auditLogs.columns.entity",
                  {},
                  "Entity",
                )}
              </th>
              <th className="px-4 py-3 font-medium">
                {t("dashboard.schoolAdmin.auditLogs.columns.ip", {}, "IP")}
              </th>
              <th className="px-4 py-3 font-medium">
                {t(
                  "dashboard.schoolAdmin.auditLogs.columns.created",
                  {},
                  "Created",
                )}
              </th>
            </tr>
          </thead>

          <tbody>
            {items.map((log) => (
              <tr key={log.id} className="border-t border-border/40">
                <td className="px-4 py-3">{log.action}</td>
                <td className="px-4 py-3">{log.actorId || "-"}</td>
                <td className="px-4 py-3">
                  {log.entityType || "-"} / {log.entityId || "-"}
                </td>
                <td className="px-4 py-3">{log.ip || "-"}</td>
                <td className="px-4 py-3">
                  {new Date(log.createdAt).toLocaleString()}
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
        onPageChange={setPage}
      />
    </DashboardTableCard>
  );
};

export default SchoolAdminAuditLogsPage;
