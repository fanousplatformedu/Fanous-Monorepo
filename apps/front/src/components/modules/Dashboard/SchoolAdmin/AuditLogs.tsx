"use client";

import { TSchoolAdminAuditLogFilterValues } from "@/types/modules";
import { useSchoolAdminAuditLogsQuery } from "@/lib/redux/api";
import { SchoolAuditLogsFilters } from "@modules/Dashboard/SchoolAdmin/parts/audit-filter";
import { DashboardLoadingCard } from "@modules/Dashboard/parts/dashboard-loading-card";
import { DashboardEmptyState } from "@modules/Dashboard/parts/dashboard-empty-state";
import { DashboardTableCard } from "@modules/Dashboard/parts/dashboard-table-card";
import { useMemo, useState } from "react";
import { DashboardSection } from "@modules/Dashboard/parts/dashboard-section";
import { TablePagination } from "@elements/table-pagination";
import { PAGE_SIZE } from "@/utils/constant";
import { useI18n } from "@/hooks/useI18n";

import * as L from "lucide-react";

const SchoolAdminAuditLogsPage = () => {
  const { t } = useI18n();

  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<TSchoolAdminAuditLogFilterValues>({
    actorId: "",
    action: "",
    entityType: "",
  });

  const skip = (page - 1) * PAGE_SIZE;

  const { data, isLoading, isFetching } = useSchoolAdminAuditLogsQuery({
    take: PAGE_SIZE,
    skip,
    actorId: filters.actorId || undefined,
    action: filters.action || undefined,
    entityType: filters.entityType || undefined,
  });

  const items = useMemo(() => data?.items ?? [], [data]);
  const total = data?.total ?? 0;

  const createCount = items.filter((item) =>
    String(item.action ?? "").includes("CREATE"),
  ).length;

  const updateCount = items.filter((item) =>
    String(item.action ?? "").includes("UPDATE"),
  ).length;

  const deleteOrArchiveCount = items.filter((item) => {
    const action = String(item.action ?? "");
    return action.includes("DELETE") || action.includes("ARCHIVE");
  }).length;

  if (isLoading) return <DashboardLoadingCard rows={8} />;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[1.75rem] border border-border/60 bg-card/70 p-5 backdrop-blur-xl">
          <p className="text-sm text-muted-foreground">
            {t(
              "dashboard.schoolAdmin.auditLogs.kpis.createActions",
              {},
              "Create Actions",
            )}
          </p>
          <p className="mt-2 text-3xl font-bold">{createCount}</p>
        </div>

        <div className="rounded-[1.75rem] border border-border/60 bg-card/70 p-5 backdrop-blur-xl">
          <p className="text-sm text-muted-foreground">
            {t(
              "dashboard.schoolAdmin.auditLogs.kpis.updateActions",
              {},
              "Update Actions",
            )}
          </p>
          <p className="mt-2 text-3xl font-bold">{updateCount}</p>
        </div>

        <div className="rounded-[1.75rem] border border-border/60 bg-card/70 p-5 backdrop-blur-xl">
          <p className="text-sm text-muted-foreground">
            {t(
              "dashboard.schoolAdmin.auditLogs.kpis.deleteArchiveActions",
              {},
              "Delete / Archive Actions",
            )}
          </p>
          <p className="mt-2 text-3xl font-bold">{deleteOrArchiveCount}</p>
        </div>
      </div>

      <DashboardSection
        title={t(
          "dashboard.schoolAdmin.auditLogs.filtersCard.title",
          {},
          "Audit Log Filters",
        )}
        description={t(
          "dashboard.schoolAdmin.auditLogs.filtersCard.description",
          {},
          "Filter school audit logs by actor, action, and entity type.",
        )}
      >
        <SchoolAuditLogsFilters
          value={filters}
          onApply={(values) => {
            setPage(1);
            setFilters(values);
          }}
          onReset={() => {
            setPage(1);
            setFilters({
              actorId: "",
              action: "",
              entityType: "",
            });
          }}
        />
      </DashboardSection>

      {!items.length ? (
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
      ) : (
        <DashboardTableCard
          title={t(
            "dashboard.schoolAdmin.auditLogs.table.title",
            {},
            "Audit Logs",
          )}
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
                    <td className="px-4 py-3">{log.action || "-"}</td>
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

          {isFetching ? (
            <p className="mt-3 text-xs text-muted-foreground">
              {t("common.refreshing", {}, "Refreshing...")}
            </p>
          ) : null}
        </DashboardTableCard>
      )}
    </div>
  );
};

export default SchoolAdminAuditLogsPage;
