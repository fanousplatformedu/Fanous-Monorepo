"use client";

import { useSchoolsQuery, useSetSchoolStatusMutation } from "@/lib/redux/api";
import { SuperAdminSectionCard } from "@elements/super-admin-section-card";
import { DashboardLoadingCard } from "@elements/dashboard-loading-card";
import { DashboardEmptyState } from "@elements/dashboard-empty-state";
import { getApiErrorMessage } from "@/utils/function-helper";
import { useMemo, useState } from "react";
import { TableActionButton } from "@elements/table-action-button";
import { SchoolFormDialog } from "@elements/school-form-dialog";
import { TablePagination } from "@elements/table-pagination";
import { StatusBadge } from "@elements/status-badge";
import { PAGE_SIZE } from "@/utils/constant";
import { useI18n } from "@/hooks/useI18n";
import { Button } from "@ui/button";
import { toast } from "sonner";

import SchoolsFilters from "@modules/Dashboard/SuperAdmin/SchoolsFilters";

import * as L from "lucide-react";

const SchoolsPage = () => {
  const { t } = useI18n();

  const [openCreate, setOpenCreate] = useState(false);
  const [page, setPage] = useState(1);

  const [editingSchool, setEditingSchool] = useState<{
    id: string;
    name: string;
    code?: string | null;
  } | null>(null);

  const [filters, setFilters] = useState<{
    query: string;
    status: "" | "ACTIVE" | "SUSPENDED" | "ARCHIVED";
  }>({
    query: "",
    status: "",
  });

  const skip = (page - 1) * PAGE_SIZE;

  const { data, isLoading, isFetching } = useSchoolsQuery({
    take: PAGE_SIZE,
    skip,
    query: filters.query.trim() || undefined,
    status: filters.status || undefined,
  });

  const [setSchoolStatus, { isLoading: isUpdatingStatus }] =
    useSetSchoolStatusMutation();

  const schools = useMemo(() => data?.items ?? [], [data]);
  const total = data?.total ?? 0;

  const handleStatusChange = async (
    schoolId: string,
    status: "ACTIVE" | "SUSPENDED" | "ARCHIVED",
  ) => {
    try {
      await setSchoolStatus({ schoolId, status }).unwrap();
      toast.success(t("dashboard.superAdmin.schools.toasts.statusUpdated"));
    } catch (error: unknown) {
      toast.error(
        getApiErrorMessage(
          error,
          t("dashboard.superAdmin.schools.toasts.statusUpdateFailed"),
        ),
      );
    }
  };

  const handleApplyFilters = (values: {
    query: string;
    status: "" | "ACTIVE" | "SUSPENDED" | "ARCHIVED";
  }) => {
    setPage(1);
    setFilters(values);
  };

  const handleResetFilters = () => {
    setPage(1);
    setFilters({
      query: "",
      status: "",
    });
  };

  return (
    <>
      <div className="space-y-6">
        <SuperAdminSectionCard
          title={t("dashboard.superAdmin.schools.filtersCard.title")}
          description={t(
            "dashboard.superAdmin.schools.filtersCard.description",
          )}
        >
          <SchoolsFilters
            value={filters}
            onApply={handleApplyFilters}
            onReset={handleResetFilters}
          />
        </SuperAdminSectionCard>

        <SuperAdminSectionCard
          title={t("dashboard.superAdmin.schools.table.title")}
          description={t("dashboard.superAdmin.schools.table.description")}
          action={
            <Button
              variant="brand"
              className="rounded-2xl"
              onClick={() => setOpenCreate(true)}
            >
              <L.Plus className="mr-2 h-4 w-4" />
              {t("dashboard.superAdmin.schools.actions.createSchool")}
            </Button>
          }
        >
          {isLoading ? (
            <DashboardLoadingCard rows={6} title={false} />
          ) : !schools.length ? (
            <DashboardEmptyState
              icon={L.School}
              title={t("dashboard.superAdmin.schools.empty.title")}
              description={t("dashboard.superAdmin.schools.empty.description")}
            />
          ) : (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-secondary/30 text-left">
                    <tr>
                      <th className="px-4 py-3 font-medium">
                        {t("dashboard.superAdmin.schools.columns.name")}
                      </th>
                      <th className="px-4 py-3 font-medium">
                        {t("dashboard.superAdmin.schools.columns.code")}
                      </th>
                      <th className="px-4 py-3 font-medium">
                        {t("dashboard.superAdmin.schools.columns.status")}
                      </th>
                      <th className="px-4 py-3 font-medium">
                        {t("dashboard.superAdmin.schools.columns.created")}
                      </th>
                      <th className="px-4 py-3 font-medium text-right">
                        {t("dashboard.superAdmin.schools.columns.actions")}
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {schools.map((school) => (
                      <tr key={school.id} className="border-t border-border/40">
                        <td className="px-4 py-3">{school.name}</td>
                        <td className="px-4 py-3">{school.code || "-"}</td>
                        <td className="px-4 py-3">
                          <StatusBadge value={school.status} />
                        </td>
                        <td className="px-4 py-3">
                          {new Date(school.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-2">
                            <TableActionButton
                              label={t("common.edit")}
                              icon={L.Pencil}
                              onClick={() =>
                                setEditingSchool({
                                  id: school.id,
                                  name: school.name,
                                  code: school.code,
                                })
                              }
                            />

                            {school.status !== "ACTIVE" ? (
                              <TableActionButton
                                label={t(
                                  "dashboard.superAdmin.schools.actions.activate",
                                )}
                                icon={L.BadgeCheck}
                                disabled={isUpdatingStatus}
                                onClick={() =>
                                  handleStatusChange(school.id, "ACTIVE")
                                }
                              />
                            ) : null}

                            {school.status !== "SUSPENDED" ? (
                              <TableActionButton
                                label={t(
                                  "dashboard.superAdmin.schools.actions.suspend",
                                )}
                                icon={L.ShieldAlert}
                                disabled={isUpdatingStatus}
                                onClick={() =>
                                  handleStatusChange(school.id, "SUSPENDED")
                                }
                              />
                            ) : null}

                            {school.status !== "ARCHIVED" ? (
                              <TableActionButton
                                label={t(
                                  "dashboard.superAdmin.schools.actions.archive",
                                )}
                                icon={L.Archive}
                                disabled={isUpdatingStatus}
                                onClick={() =>
                                  handleStatusChange(school.id, "ARCHIVED")
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

      <SchoolFormDialog open={openCreate} onOpenChange={setOpenCreate} />

      <SchoolFormDialog
        open={Boolean(editingSchool)}
        onOpenChange={(open) => {
          if (!open) setEditingSchool(null);
        }}
        initialValues={editingSchool}
      />
    </>
  );
};

export default SchoolsPage;
