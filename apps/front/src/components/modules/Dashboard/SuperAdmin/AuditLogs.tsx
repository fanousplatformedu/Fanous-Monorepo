"use client";

import { useSuperAdminAuditLogsQuery } from "@/lib/redux/api";
import { SuperAdminSectionCard } from "@elements/super-admin-section-card";
import { DashboardLoadingCard } from "@elements/dashboard-loading-card";
import { CreateAuditLogDialog } from "@elements/super-admin-audit-dialog";
import { DashboardEmptyState } from "@elements/dashboard-empty-state";
import { useMemo, useState } from "react";
import { TablePagination } from "@elements/table-pagination";
import { TrendWidget } from "@elements/trend-wighet";
import { PAGE_SIZE } from "@/utils/constant";
import { useI18n } from "@/hooks/useI18n";
import { Button } from "@ui/button";

import AuditLogsFilters from "@modules/Dashboard/SuperAdmin/AuditLogsFilters";

import * as L from "lucide-react";

const AuditLogs = () => {
  const { t } = useI18n();

  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);

  const [filters, setFilters] = useState({
    schoolId: "",
    actorId: "",
    action: "",
    entityType: "",
  });

  const skip = (page - 1) * PAGE_SIZE;

  const { data, isLoading } = useSuperAdminAuditLogsQuery({
    take: PAGE_SIZE,
    skip,
    schoolId: filters.schoolId || undefined,
    actorId: filters.actorId || undefined,
    action: filters.action || undefined,
    entityType: filters.entityType || undefined,
  });

  const items = useMemo(() => data?.items ?? [], [data]);

  const createCount = items.filter((item) =>
    item.action.includes("CREATE"),
  ).length;
  const updateCount = items.filter((item) =>
    item.action.includes("UPDATE"),
  ).length;
  const adminCount = items.filter((item) =>
    item.action.includes("ADMIN"),
  ).length;

  return (
    <>
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <TrendWidget
            title={t("dashboard.superAdmin.auditLogs.kpis.createActions")}
            value={createCount}
          />
          <TrendWidget
            title={t("dashboard.superAdmin.auditLogs.kpis.updateActions")}
            value={updateCount}
          />
          <TrendWidget
            title={t("dashboard.superAdmin.auditLogs.kpis.adminActions")}
            value={adminCount}
          />
        </div>

        <SuperAdminSectionCard
          title={t("dashboard.superAdmin.auditLogs.filtersCard.title")}
          description={t(
            "dashboard.superAdmin.auditLogs.filtersCard.description",
          )}
        >
          <AuditLogsFilters
            value={filters}
            onApply={(values) => {
              setPage(1);
              setFilters(values);
            }}
            onReset={() => {
              setPage(1);
              setFilters({
                schoolId: "",
                actorId: "",
                action: "",
                entityType: "",
              });
            }}
          />
        </SuperAdminSectionCard>

        <SuperAdminSectionCard
          title={t("dashboard.superAdmin.auditLogs.table.title")}
          description={t("dashboard.superAdmin.auditLogs.table.description")}
          action={
            <Button
              variant="brand"
              className="rounded-2xl"
              onClick={() => setOpen(true)}
            >
              <L.Plus className="mr-2 h-4 w-4" />
              {t("dashboard.superAdmin.auditLogs.actions.create")}
            </Button>
          }
        >
          {isLoading ? (
            <DashboardLoadingCard rows={7} title={false} />
          ) : !items.length ? (
            <DashboardEmptyState
              icon={L.ScrollText}
              title={t("dashboard.superAdmin.auditLogs.empty.title")}
              description={t(
                "dashboard.superAdmin.auditLogs.empty.description",
              )}
            />
          ) : (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-secondary/30 text-left">
                    <tr>
                      <th className="px-4 py-3 font-medium">
                        {t("dashboard.superAdmin.auditLogs.columns.action")}
                      </th>
                      <th className="px-4 py-3 font-medium">
                        {t("dashboard.superAdmin.auditLogs.columns.actor")}
                      </th>
                      <th className="px-4 py-3 font-medium">
                        {t("dashboard.superAdmin.auditLogs.columns.school")}
                      </th>
                      <th className="px-4 py-3 font-medium">
                        {t("dashboard.superAdmin.auditLogs.columns.entity")}
                      </th>
                      <th className="px-4 py-3 font-medium">
                        {t("dashboard.superAdmin.auditLogs.columns.created")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((log) => (
                      <tr key={log.id} className="border-t border-border/40">
                        <td className="px-4 py-3">{log.action}</td>
                        <td className="px-4 py-3">{log.actorId || "-"}</td>
                        <td className="px-4 py-3">{log.schoolId || "-"}</td>
                        <td className="px-4 py-3">
                          {log.entityType || "-"} / {log.entityId || "-"}
                        </td>
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
                pageSize={PAGE_SIZE}
                total={data?.total ?? 0}
                onPageChange={setPage}
              />
            </div>
          )}
        </SuperAdminSectionCard>
      </div>

      <CreateAuditLogDialog open={open} onOpenChange={setOpen} />
    </>
  );
};

export default AuditLogs;
