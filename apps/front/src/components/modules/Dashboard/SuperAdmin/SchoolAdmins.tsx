"use client";

import { useSetAdminStatusMutation } from "@/lib/redux/api";
import { SchoolAdminFormDialog } from "@elements/school-admin-form-dialog";
import { SuperAdminSectionCard } from "@elements/super-admin-section-card";
import { useSchoolAdminsQuery } from "@/lib/redux/api";
import { DashboardLoadingCard } from "@elements/dashboard-loading-card";
import { DashboardEmptyState } from "@elements/dashboard-empty-state";
import { getApiErrorMessage } from "@/utils/function-helper";
import { useMemo, useState } from "react";
import { TableActionButton } from "@elements/table-action-button";
import { TablePagination } from "@elements/table-pagination";
import { StatusBadge } from "@elements/status-badge";
import { PAGE_SIZE } from "@/utils/constant";
import { useI18n } from "@/hooks/useI18n";
import { Button } from "@ui/button";
import { toast } from "sonner";

import SchoolAdminsFilters from "@modules/Dashboard/SuperAdmin/SchoolAdminsFilters";

import * as L from "lucide-react";

const SchoolAdmins = () => {
  const { t } = useI18n();

  const [openCreate, setOpenCreate] = useState(false);
  const [page, setPage] = useState(1);

  const [filters, setFilters] = useState<{
    schoolId: string;
    status: "" | "ACTIVE" | "DISABLED" | "DELETED";
  }>({
    schoolId: "",
    status: "",
  });

  const skip = (page - 1) * PAGE_SIZE;

  const { data, isLoading, isFetching } = useSchoolAdminsQuery({
    take: PAGE_SIZE,
    skip,
    schoolId: filters.schoolId || undefined,
    status: filters.status || undefined,
  });

  const [setAdminStatus, { isLoading: isUpdating }] =
    useSetAdminStatusMutation();

  const admins = useMemo(() => data?.items ?? [], [data]);
  const total = data?.total ?? 0;

  const handleStatusChange = async (
    adminUserId: string,
    status: "ACTIVE" | "DISABLED" | "DELETED",
  ) => {
    try {
      await setAdminStatus({ adminUserId, status }).unwrap();
      toast.success(
        t("dashboard.superAdmin.schoolAdmins.toasts.statusUpdated"),
      );
    } catch (error: unknown) {
      toast.error(
        getApiErrorMessage(
          error,
          t("dashboard.superAdmin.schoolAdmins.toasts.statusUpdateFailed"),
        ),
      );
    }
  };

  const handleApplyFilters = (values: {
    schoolId: string;
    status: "" | "ACTIVE" | "DISABLED" | "DELETED";
  }) => {
    setPage(1);
    setFilters(values);
  };

  const handleResetFilters = () => {
    setPage(1);
    setFilters({
      schoolId: "",
      status: "",
    });
  };

  return (
    <>
      <div className="space-y-6">
        <SuperAdminSectionCard
          title={t("dashboard.superAdmin.schoolAdmins.filtersCard.title")}
          description={t(
            "dashboard.superAdmin.schoolAdmins.filtersCard.description",
          )}
        >
          <SchoolAdminsFilters
            value={filters}
            onApply={handleApplyFilters}
            onReset={handleResetFilters}
          />
        </SuperAdminSectionCard>

        <SuperAdminSectionCard
          title={t("dashboard.superAdmin.schoolAdmins.table.title")}
          description={t("dashboard.superAdmin.schoolAdmins.table.description")}
          action={
            <Button
              variant="brand"
              className="rounded-2xl"
              onClick={() => setOpenCreate(true)}
            >
              <L.Plus className="mr-2 h-4 w-4" />
              {t("dashboard.superAdmin.schoolAdmins.actions.createAdmin")}
            </Button>
          }
        >
          {isLoading ? (
            <DashboardLoadingCard rows={6} title={false} />
          ) : !admins.length ? (
            <DashboardEmptyState
              icon={L.UserCog}
              title={t("dashboard.superAdmin.schoolAdmins.empty.title")}
              description={t(
                "dashboard.superAdmin.schoolAdmins.empty.description",
              )}
            />
          ) : (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-secondary/30 text-left">
                    <tr>
                      <th className="px-4 py-3 font-medium">
                        {t("dashboard.superAdmin.schoolAdmins.columns.email")}
                      </th>
                      <th className="px-4 py-3 font-medium">
                        {t(
                          "dashboard.superAdmin.schoolAdmins.columns.username",
                        )}
                      </th>
                      <th className="px-4 py-3 font-medium">
                        {t("dashboard.superAdmin.schoolAdmins.columns.school")}
                      </th>
                      <th className="px-4 py-3 font-medium">
                        {t("dashboard.superAdmin.schoolAdmins.columns.status")}
                      </th>
                      <th className="px-4 py-3 font-medium">
                        {t(
                          "dashboard.superAdmin.schoolAdmins.columns.forcePasswordChange",
                        )}
                      </th>
                      <th className="px-4 py-3 font-medium">
                        {t("dashboard.superAdmin.schoolAdmins.columns.created")}
                      </th>
                      <th className="px-4 py-3 font-medium text-right">
                        {t("dashboard.superAdmin.schoolAdmins.columns.actions")}
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {admins.map((admin) => (
                      <tr key={admin.id} className="border-t border-border/40">
                        <td className="px-4 py-3">{admin.email || "-"}</td>
                        <td className="px-4 py-3">{admin.username || "-"}</td>
                        <td className="px-4 py-3">{admin.schoolName || "-"}</td>
                        <td className="px-4 py-3">
                          <StatusBadge value={admin.status} />
                        </td>
                        <td className="px-4 py-3">
                          {admin.forcePasswordChange
                            ? t("common.yes")
                            : t("common.no")}
                        </td>
                        <td className="px-4 py-3">
                          {new Date(admin.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-2">
                            {admin.status !== "ACTIVE" ? (
                              <TableActionButton
                                label={t(
                                  "dashboard.superAdmin.schoolAdmins.actions.activate",
                                )}
                                icon={L.BadgeCheck}
                                disabled={isUpdating}
                                variant={"brandChip"}
                                onClick={() =>
                                  handleStatusChange(admin.id, "ACTIVE")
                                }
                              />
                            ) : null}

                            {admin.status !== "DISABLED" ? (
                              <TableActionButton
                                label={t(
                                  "dashboard.superAdmin.schoolAdmins.actions.disable",
                                )}
                                icon={L.UserX}
                                disabled={isUpdating}
                                onClick={() =>
                                  handleStatusChange(admin.id, "DISABLED")
                                }
                              />
                            ) : null}

                            {admin.status !== "DELETED" ? (
                              <TableActionButton
                                label={t(
                                  "dashboard.superAdmin.schoolAdmins.actions.delete",
                                )}
                                icon={L.Trash2}
                                variant={"brandDanger"}
                                disabled={isUpdating}
                                onClick={() =>
                                  handleStatusChange(admin.id, "DELETED")
                                }
                              />
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <TablePagination
                page={page}
                pageSize={PAGE_SIZE}
                total={total}
                onPageChange={(nextPage) => {
                  if (isFetching) return;
                  setPage(nextPage);
                }}
              />
            </div>
          )}
        </SuperAdminSectionCard>
      </div>

      <SchoolAdminFormDialog open={openCreate} onOpenChange={setOpenCreate} />
    </>
  );
};

export default SchoolAdmins;
