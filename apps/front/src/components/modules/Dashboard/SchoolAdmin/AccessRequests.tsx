"use client";

import { TAccessRequestDialogMode, TAccessRequestRow } from "@/types/modules";
import { useSchoolAdminAccessRequestsQuery } from "@/lib/redux/api";
import { useReviewAccessRequestMutation } from "@/lib/redux/api";
import { TAccessRequestFilterValues } from "@/types/modules";
import { DashboardLoadingCard } from "@modules/Dashboard/parts/dashboard-loading-card";
import { AccessRequestFilters } from "@modules/Dashboard/SchoolAdmin/parts/access-filter";
import { DashboardEmptyState } from "@modules/Dashboard/parts/dashboard-empty-state";
import { AccessRequestDialog } from "@modules/Dashboard/SchoolAdmin/parts/access-dialog";
import { DashboardTableCard } from "@modules/Dashboard/parts/dashboard-table-card";
import { getApiErrorMessage } from "@/utils/function-helper";
import { useMemo, useState } from "react";
import { DashboardSection } from "@modules/Dashboard/parts/dashboard-section";
import { TablePagination } from "@elements/table-pagination";
import { StatusBadge } from "@elements/status-badge";
import { PAGE_SIZE } from "@/utils/constant";
import { useI18n } from "@/hooks/useI18n";
import { Button } from "@ui/button";
import { toast } from "sonner";

import * as L from "lucide-react";

const defaultFilters: TAccessRequestFilterValues = {
  query: "",
  status: "ALL",
  requestedRole: "ALL",
};

const castAccessRequestRow = (item: {
  id: string;
  status: string;
  createdAt: string;
  email: string | null;
  mobile: string | null;
  requestedRole: string;
  fullName: string | null;
  reviewedAt: string | null;
  rejectReason: string | null;
  reviewedById: string | null;
  approvedUserId: string | null;
}): TAccessRequestRow => {
  return {
    id: item.id,
    email: item.email,
    mobile: item.mobile,
    fullName: item.fullName,
    createdAt: item.createdAt,
    reviewedAt: item.reviewedAt,
    rejectReason: item.rejectReason,
    reviewedById: item.reviewedById,
    approvedUserId: item.approvedUserId,
    status: item.status as TAccessRequestRow["status"],
    requestedRole: item.requestedRole as TAccessRequestRow["requestedRole"],
  };
};

const SchoolAdminAccessRequestsPage = () => {
  const { t } = useI18n();

  const [page, setPage] = useState(1);
  const [filters, setFilters] =
    useState<TAccessRequestFilterValues>(defaultFilters);

  const [dialogMode, setDialogMode] = useState<TAccessRequestDialogMode | null>(
    null,
  );
  const [selectedRequest, setSelectedRequest] =
    useState<TAccessRequestRow | null>(null);

  const skip = (page - 1) * PAGE_SIZE;

  const { data, isLoading, isFetching } = useSchoolAdminAccessRequestsQuery({
    take: PAGE_SIZE,
    skip,
    query: filters.query.trim() || undefined,
    status: filters.status === "ALL" ? undefined : filters.status,
    requestedRole:
      filters.requestedRole === "ALL" ? undefined : filters.requestedRole,
  });

  const [reviewRequest, { isLoading: isReviewing }] =
    useReviewAccessRequestMutation();

  const items = useMemo<TAccessRequestRow[]>(
    () => (data?.items ?? []).map(castAccessRequestRow),
    [data],
  );

  const total = data?.total ?? 0;

  const pendingCount = useMemo(
    () => items.filter((item) => item.status === "PENDING").length,
    [items],
  );

  const approvedCount = useMemo(
    () => items.filter((item) => item.status === "APPROVED").length,
    [items],
  );

  const rejectedCount = useMemo(
    () => items.filter((item) => item.status === "REJECTED").length,
    [items],
  );

  const handleOpenApprove = (request: TAccessRequestRow) => {
    setDialogMode("approve");
    setSelectedRequest(request);
  };

  const handleOpenReject = (request: TAccessRequestRow) => {
    setDialogMode("reject");
    setSelectedRequest(request);
  };

  const handleCloseDialog = (open: boolean) => {
    if (!open) {
      setSelectedRequest(null);
      setDialogMode(null);
    }
  };

  const handleConfirmReview = async (payload: {
    rejectReason?: string;
    finalRole?: TAccessRequestRow["requestedRole"];
  }) => {
    if (!selectedRequest || !dialogMode) return;
    try {
      if (dialogMode === "approve") {
        const response = await reviewRequest({
          requestId: selectedRequest.id,
          approve: true,
          finalRole: payload.finalRole ?? selectedRequest.requestedRole,
        }).unwrap();
        toast.success(
          response.message ||
            t("dashboard.schoolAdmin.accessRequests.toasts.approveSuccess"),
        );
      } else {
        const response = await reviewRequest({
          requestId: selectedRequest.id,
          approve: false,
          rejectReason:
            payload.rejectReason?.trim() ||
            t(
              "dashboard.schoolAdmin.accessRequests.dialog.reject.defaultReason",
            ),
        }).unwrap();
        toast.success(
          response.message ||
            t("dashboard.schoolAdmin.accessRequests.toasts.rejectSuccess"),
        );
      }
      setSelectedRequest(null);
      setDialogMode(null);
    } catch (error: unknown) {
      toast.error(
        getApiErrorMessage(
          error,
          dialogMode === "approve"
            ? t("dashboard.schoolAdmin.accessRequests.toasts.approveFailed")
            : t("dashboard.schoolAdmin.accessRequests.toasts.rejectFailed"),
        ),
      );
    }
  };

  if (isLoading) return <DashboardLoadingCard rows={8} />;

  return (
    <>
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <DashboardSection
            title={t("dashboard.schoolAdmin.accessRequests.kpis.pending.title")}
          >
            <p className="text-3xl font-bold text-foreground">{pendingCount}</p>
          </DashboardSection>

          <DashboardSection
            title={t(
              "dashboard.schoolAdmin.accessRequests.kpis.approved.title",
            )}
          >
            <p className="text-3xl font-bold text-foreground">
              {approvedCount}
            </p>
          </DashboardSection>

          <DashboardSection
            title={t(
              "dashboard.schoolAdmin.accessRequests.kpis.rejected.title",
            )}
          >
            <p className="text-3xl font-bold text-foreground">
              {rejectedCount}
            </p>
          </DashboardSection>
        </div>

        <DashboardSection
          title={t("dashboard.schoolAdmin.accessRequests.filtersCard.title")}
          description={t(
            "dashboard.schoolAdmin.accessRequests.filtersCard.description",
          )}
        >
          <AccessRequestFilters
            value={filters}
            onApply={(nextFilters) => {
              setPage(1);
              setFilters(nextFilters);
            }}
            onReset={() => {
              setPage(1);
              setFilters(defaultFilters);
            }}
          />
        </DashboardSection>

        {!items.length ? (
          <DashboardEmptyState
            icon={L.UserCheck2}
            title={t("dashboard.schoolAdmin.accessRequests.empty.title")}
            description={t(
              "dashboard.schoolAdmin.accessRequests.empty.description",
            )}
          />
        ) : (
          <DashboardTableCard
            title={t("dashboard.schoolAdmin.accessRequests.table.title")}
            description={t(
              "dashboard.schoolAdmin.accessRequests.table.description",
            )}
          >
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-secondary/30 text-left">
                  <tr>
                    <th className="px-4 py-3 font-medium">
                      {t(
                        "dashboard.schoolAdmin.accessRequests.table.columns.fullName",
                      )}
                    </th>
                    <th className="px-4 py-3 font-medium">
                      {t(
                        "dashboard.schoolAdmin.accessRequests.table.columns.requestedRole",
                      )}
                    </th>
                    <th className="px-4 py-3 font-medium">
                      {t(
                        "dashboard.schoolAdmin.accessRequests.table.columns.status",
                      )}
                    </th>
                    <th className="px-4 py-3 font-medium">
                      {t(
                        "dashboard.schoolAdmin.accessRequests.table.columns.email",
                      )}
                    </th>
                    <th className="px-4 py-3 font-medium">
                      {t(
                        "dashboard.schoolAdmin.accessRequests.table.columns.mobile",
                      )}
                    </th>
                    <th className="px-4 py-3 font-medium">
                      {t(
                        "dashboard.schoolAdmin.accessRequests.table.columns.createdAt",
                      )}
                    </th>
                    <th className="px-4 py-3 font-medium">
                      {t(
                        "dashboard.schoolAdmin.accessRequests.table.columns.reviewedAt",
                      )}
                    </th>
                    <th className="px-4 py-3 font-medium text-right">
                      {t(
                        "dashboard.schoolAdmin.accessRequests.table.columns.actions",
                      )}
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {items.map((request) => (
                    <tr key={request.id} className="border-t border-border/40">
                      <td className="px-4 py-3">{request.fullName || "-"}</td>

                      <td className="px-4 py-3">
                        {t(
                          `dashboard.schoolAdmin.accessRequests.roles.${request.requestedRole}`,
                        )}
                      </td>

                      <td className="px-4 py-3">
                        <StatusBadge value={request.status} />
                      </td>

                      <td className="px-4 py-3">{request.email || "-"}</td>

                      <td className="px-4 py-3">{request.mobile || "-"}</td>

                      <td className="px-4 py-3">
                        {new Date(request.createdAt).toLocaleString()}
                      </td>

                      <td className="px-4 py-3">
                        {request.reviewedAt
                          ? new Date(request.reviewedAt).toLocaleString()
                          : "-"}
                      </td>

                      <td className="px-4 py-3">
                        {request.status === "PENDING" ? (
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="brand"
                              className="rounded-2xl"
                              disabled={isReviewing}
                              onClick={() => handleOpenApprove(request)}
                            >
                              {t(
                                "dashboard.schoolAdmin.accessRequests.actions.approve",
                              )}
                            </Button>

                            <Button
                              size="sm"
                              variant="brandSoft"
                              disabled={isReviewing}
                              className="rounded-2xl"
                              onClick={() => handleOpenReject(request)}
                            >
                              {t(
                                "dashboard.schoolAdmin.accessRequests.actions.reject",
                              )}
                            </Button>
                          </div>
                        ) : (
                          <div className="text-right text-muted-foreground">
                            -
                          </div>
                        )}
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

      <AccessRequestDialog
        mode={dialogMode}
        isLoading={isReviewing}
        request={selectedRequest}
        onConfirm={handleConfirmReview}
        onOpenChange={handleCloseDialog}
        open={Boolean(selectedRequest && dialogMode)}
      />
    </>
  );
};

export default SchoolAdminAccessRequestsPage;
