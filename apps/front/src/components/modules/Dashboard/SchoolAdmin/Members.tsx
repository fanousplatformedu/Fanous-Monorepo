"use client";

import {
  useRemoveSchoolMemberMutation,
  useSchoolMembersQuery,
} from "@/lib/redux/api";
import { DashboardLoadingCard } from "@modules/Dashboard/parts/dashboard-loading-card";
import { MemberDisableDialog } from "@modules/Dashboard/SchoolAdmin/parts/member-dialog";
import { DashboardEmptyState } from "@modules/Dashboard/parts/dashboard-empty-state";
import { DashboardTableCard } from "@modules/Dashboard/parts/dashboard-table-card";
import { DashboardSection } from "@modules/Dashboard/parts/dashboard-section";
import { MembersFilters } from "@modules/Dashboard/SchoolAdmin/parts/member-filter";
import { TablePagination } from "@elements/table-pagination";
import { getApiErrorMessage } from "@/utils/function-helper";
import { BACKEND_URL, PAGE_SIZE } from "@/utils/constant";
import { useCallback, useRef, useMemo, useState } from "react";
import { useI18n } from "@/hooks/useI18n";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@ui/button";
import { toast } from "sonner";

import * as L from "lucide-react";
import * as T from "@/types/modules";
import BulkUploadDialog from "./parts/BulkUploadDialog";

const DEFAULT_FILTERS: T.TSchoolMemberFilterValues = {
  query: "",
  role: "ALL",
  status: "ALL",
};

// ─── Main Page ─────────────────────────────────────────────────────────────────

const SchoolAdminMembersPage = () => {
  const { t } = useI18n();

  const [page, setPage] = useState(1);
  const [filters, setFilters] =
    useState<T.TSchoolMemberFilterValues>(DEFAULT_FILTERS);
  const [selectedMember, setSelectedMember] =
    useState<T.TSchoolMemberRow | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);

  const skip = (page - 1) * PAGE_SIZE;
  const { data, isLoading, isFetching, refetch } = useSchoolMembersQuery({
    skip,
    take: PAGE_SIZE,
    query: filters.query.trim() || undefined,
    role: filters.role === "ALL" ? undefined : filters.role,
    status: filters.status === "ALL" ? undefined : filters.status,
  });
  const [removeMember, { isLoading: isRemoving }] =
    useRemoveSchoolMemberMutation();

  const items = useMemo<T.TSchoolMemberRow[]>(
    () => (data?.items ?? []) as T.TSchoolMemberRow[],
    [data],
  );
  const total = data?.total ?? 0;
  const activeCount = useMemo(
    () => items.filter((i) => i.status === "ACTIVE").length,
    [items],
  );
  const disabledCount = useMemo(
    () => items.filter((i) => i.status === "DISABLED").length,
    [items],
  );

  const getRoleLabel = (role: T.TSchoolMemberRole) =>
    t(`dashboard.schoolAdmin.members.roles.${role}`);

  const handleDisableConfirm = async () => {
    if (!selectedMember) return;
    try {
      await removeMember({
        userId: selectedMember.id,
        hardDelete: false,
      }).unwrap();
      toast.success(t("dashboard.schoolAdmin.members.toasts.disableSuccess"));
      setSelectedMember(null);
    } catch (error: unknown) {
      toast.error(
        getApiErrorMessage(
          error,
          t("dashboard.schoolAdmin.members.toasts.disableFailed"),
        ),
      );
    }
  };

  const handleUploadSuccess = () => {
    toast.success(t("dashboard.schoolAdmin.members.bulkUpload.toasts.success"));
    refetch();
  };

  if (isLoading) return <DashboardLoadingCard rows={8} />;

  return (
    <>
      <div className="space-y-6">
        {/* ── KPI cards ── */}
        <div className="grid gap-4 md:grid-cols-3">
          <DashboardSection
            title={t("dashboard.schoolAdmin.members.kpis.total.title")}
            description={t(
              "dashboard.schoolAdmin.members.kpis.total.description",
            )}
          >
            <p className="text-2xl font-bold">{total}</p>
          </DashboardSection>

          <DashboardSection
            title={t("dashboard.schoolAdmin.members.kpis.active.title")}
            description={t(
              "dashboard.schoolAdmin.members.kpis.active.description",
            )}
          >
            <p className="text-2xl font-bold">{activeCount}</p>
          </DashboardSection>

          <DashboardSection
            title={t("dashboard.schoolAdmin.members.kpis.disabled.title")}
            description={t(
              "dashboard.schoolAdmin.members.kpis.disabled.description",
            )}
          >
            <p className="text-2xl font-bold">{disabledCount}</p>
          </DashboardSection>
        </div>

        {/* ── Filters ── */}
        <DashboardSection
          title={t("dashboard.schoolAdmin.members.filters.title")}
          description={t("dashboard.schoolAdmin.members.filters.description")}
        >
          <MembersFilters
            value={filters}
            onApply={(next) => {
              setPage(1);
              setFilters(next);
            }}
            onReset={() => {
              setPage(1);
              setFilters(DEFAULT_FILTERS);
            }}
          />
        </DashboardSection>

        {/* ── Table ── */}
        {!items.length ? (
          <DashboardEmptyState
            icon={L.Users}
            title={t("dashboard.schoolAdmin.members.empty.title")}
            description={t("dashboard.schoolAdmin.members.empty.description")}
          />
        ) : (
          <DashboardTableCard
            title={t("dashboard.schoolAdmin.members.table.title")}
            description={t("dashboard.schoolAdmin.members.table.description")}
            
          >
            <div className="flex justify-end absolute top-5 left-5">
              <Button
                type="button"
                variant="brand"
                className="rounded-2xl gap-2"
                onClick={() => setUploadOpen(true)}
              >
                <L.FileSpreadsheet className="size-4" />
                {t("dashboard.schoolAdmin.members.bulkUpload.button")}
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-secondary/30 text-left">
                  <tr>
                    <th className="px-4 py-3 font-medium">
                      {t("dashboard.schoolAdmin.members.columns.fullName")}
                    </th>
                    <th className="px-4 py-3 font-medium">
                      {t("dashboard.schoolAdmin.members.columns.role")}
                    </th>
                    <th className="px-4 py-3 font-medium">
                      {t("dashboard.schoolAdmin.members.columns.status")}
                    </th>
                    <th className="px-4 py-3 font-medium">
                      {t("dashboard.schoolAdmin.members.columns.email")}
                    </th>
                    <th className="px-4 py-3 font-medium">
                      {t("dashboard.schoolAdmin.members.columns.mobile")}
                    </th>
                    <th className="px-4 py-3 font-medium">
                      {t("dashboard.schoolAdmin.members.columns.created")}
                    </th>
                    <th className="px-4 py-3 text-right font-medium">
                      {t("dashboard.schoolAdmin.members.columns.actions")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((member) => {
                    const canDisable = member.status === "ACTIVE";
                    return (
                      <tr key={member.id} className="border-t border-border/40">
                        <td className="px-4 py-3">
                          <div className="font-medium">
                            {member.fullName || "-"}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {getRoleLabel(member.role)}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={
                              member.status === "ACTIVE"
                                ? "inline-flex rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300"
                                : "inline-flex rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
                            }
                          >
                            {t(
                              `dashboard.schoolAdmin.members.status.${member.status}`,
                            )}
                          </span>
                        </td>
                        <td className="px-4 py-3">{member.email || "-"}</td>
                        <td className="px-4 py-3">{member.mobile || "-"}</td>
                        <td className="px-4 py-3">
                          {new Date(member.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end">
                            <button
                              type="button"
                              disabled={isRemoving || !canDisable}
                              onClick={() => setSelectedMember(member)}
                              className="inline-flex items-center rounded-2xl border border-border/60 bg-secondary/40 px-3 py-2 text-xs font-medium transition hover:bg-secondary/70 disabled:pointer-events-none disabled:opacity-50"
                            >
                              {t(
                                "dashboard.schoolAdmin.members.actions.disable",
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <TablePagination
              page={page}
              total={total}
              pageSize={PAGE_SIZE}
              onPageChange={setPage}
            />
            {isFetching && (
              <p className="mt-3 text-xs text-muted-foreground">
                {t("common.refreshing")}
              </p>
            )}
          </DashboardTableCard>
        )}
      </div>

      <MemberDisableDialog
        isLoading={isRemoving}
        member={selectedMember}
        open={Boolean(selectedMember)}
        onConfirm={handleDisableConfirm}
        onOpenChange={(open) => {
          if (!open) setSelectedMember(null);
        }}
      />

      <BulkUploadDialog
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        onSuccess={handleUploadSuccess}
      />
    </>
  );
};

export default SchoolAdminMembersPage;
