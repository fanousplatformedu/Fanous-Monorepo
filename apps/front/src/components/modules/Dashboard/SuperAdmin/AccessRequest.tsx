"use client";

import { useSuperAdminReviewAccessRequestMutation } from "@/lib/redux/api";
import { useSuperAdminAccessRequestsQuery } from "@/lib/redux/api";
import { SuperAdminRequestBarChart } from "@modules/Dashboard/SuperAdmin/parts/super-charts";
import { SuperAdminSectionCard } from "@modules/Dashboard/SuperAdmin/parts/super-section-card";
import { DashboardLoadingCard } from "@modules/Dashboard/parts/dashboard-loading-card";
import { DashboardEmptyState } from "@modules/Dashboard/parts/dashboard-empty-state";
import { getApiErrorMessage } from "@/utils/function-helper";
import { useMemo, useState } from "react";
import { TableActionButton } from "@elements/table-action-button";
import { TablePagination } from "@elements/table-pagination";
import { TableSortButton } from "@elements/table-sort-btn";
import { DetailDrawer } from "@elements/detail-drawer";
import { StatusBadge } from "@elements/status-badge";
import { TrendWidget } from "@elements/trend-wighet";
import { useI18n } from "@/hooks/useI18n";
import { toast } from "sonner";

import * as L from "lucide-react";

type TSortKey = "fullName" | "requestedRole" | "status" | "createdAt";
type TSortDirection = "asc" | "desc";

const SuperAdminAccessRequestsPage = () => {
  const { t } = useI18n();

  const [page, setPage] = useState(1);
  const pageSize = 12;

  const [sortKey, setSortKey] = useState<TSortKey>("createdAt");
  const [sortDirection, setSortDirection] = useState<TSortDirection>("desc");

  const [selected, setSelected] = useState<{
    id: string;
    status: string;
    createdAt: string;
    requestedRole: string;
    email?: string | null;
    mobile?: string | null;
    fullName?: string | null;
    reviewedAt?: string | null;
    reviewedById?: string | null;
    rejectReason?: string | null;
    approvedUserId?: string | null;
  } | null>(null);

  const { data, isLoading } = useSuperAdminAccessRequestsQuery({
    take: 200,
    skip: 0,
  });

  const [reviewAccessRequest, { isLoading: isReviewing }] =
    useSuperAdminReviewAccessRequestMutation();

  const items = useMemo(() => {
    const rawItems = data?.items ?? [];

    const sorted = [...rawItems].sort((a, b) => {
      let value = 0;
      switch (sortKey) {
        case "fullName":
          value = (a.fullName || "").localeCompare(b.fullName || "");
          break;
        case "requestedRole":
          value = a.requestedRole.localeCompare(b.requestedRole);
          break;
        case "status":
          value = a.status.localeCompare(b.status);
          break;
        case "createdAt":
        default:
          value =
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
      }
      return sortDirection === "asc" ? value : value * -1;
    });
    return sorted;
  }, [data?.items, sortDirection, sortKey]);

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page]);

  const pending = items.filter((item) => item.status === "PENDING").length;
  const approved = items.filter((item) => item.status === "APPROVED").length;
  const rejected = items.filter((item) => item.status === "REJECTED").length;

  const chartData = [
    {
      name: t("dashboard.superAdmin.requests.pending"),
      value: pending,
    },
    {
      name: t("dashboard.superAdmin.requests.approved"),
      value: approved,
    },
    {
      name: t("dashboard.superAdmin.requests.rejected"),
      value: rejected,
    },
  ].filter((item) => item.value > 0);

  const toggleSort = (key: TSortKey) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(key);
    setSortDirection("asc");
  };

  const handleApprove = async (requestId: string) => {
    try {
      await reviewAccessRequest({
        requestId,
        approve: true,
      }).unwrap();
      toast.success(
        t("dashboard.superAdmin.accessRequests.toasts.approveSuccess"),
      );
    } catch (error: unknown) {
      toast.error(
        getApiErrorMessage(
          error,
          t("dashboard.superAdmin.accessRequests.toasts.approveFailed"),
        ),
      );
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      await reviewAccessRequest({
        requestId,
        approve: false,
        rejectReason: t(
          "dashboard.superAdmin.accessRequests.actions.defaultRejectReason",
        ),
      }).unwrap();
      toast.success(
        t("dashboard.superAdmin.accessRequests.toasts.rejectSuccess"),
      );
    } catch (error: unknown) {
      toast.error(
        getApiErrorMessage(
          error,
          t("dashboard.superAdmin.accessRequests.toasts.rejectFailed"),
        ),
      );
    }
  };

  if (isLoading) return <DashboardLoadingCard rows={8} />;

  if (!items.length)
    return (
      <DashboardEmptyState
        icon={L.UserSearch}
        title={t("dashboard.superAdmin.accessRequests.empty.title")}
        description={t("dashboard.superAdmin.accessRequests.empty.description")}
      />
    );

  return (
    <>
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <TrendWidget
            value={items.length}
            title={t("dashboard.superAdmin.accessRequests.kpis.total")}
          />
          <TrendWidget
            value={pending}
            title={t("dashboard.superAdmin.accessRequests.kpis.pending")}
          />
          <TrendWidget
            value={approved}
            title={t("dashboard.superAdmin.accessRequests.kpis.approved")}
          />
          <TrendWidget
            value={rejected}
            title={t("dashboard.superAdmin.accessRequests.kpis.rejected")}
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
          <SuperAdminSectionCard
            title={t("dashboard.superAdmin.accessRequests.chart.title")}
            description={t(
              "dashboard.superAdmin.accessRequests.chart.description",
            )}
          >
            <SuperAdminRequestBarChart data={chartData} />
          </SuperAdminSectionCard>

          <SuperAdminSectionCard
            title={t("dashboard.superAdmin.accessRequests.table.title")}
            description={t(
              "dashboard.superAdmin.accessRequests.table.description",
            )}
          >
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-secondary/30 text-left">
                  <tr>
                    <th className="px-4 py-3 font-medium">
                      <TableSortButton
                        label={t(
                          "dashboard.superAdmin.accessRequests.columns.fullName",
                        )}
                        direction={sortDirection}
                        active={sortKey === "fullName"}
                        onClick={() => toggleSort("fullName")}
                      />
                    </th>

                    <th className="px-4 py-3 font-medium">
                      <TableSortButton
                        label={t(
                          "dashboard.superAdmin.accessRequests.columns.role",
                        )}
                        direction={sortDirection}
                        active={sortKey === "requestedRole"}
                        onClick={() => toggleSort("requestedRole")}
                      />
                    </th>

                    <th className="px-4 py-3 font-medium">
                      <TableSortButton
                        label={t(
                          "dashboard.superAdmin.accessRequests.columns.status",
                        )}
                        direction={sortDirection}
                        active={sortKey === "status"}
                        onClick={() => toggleSort("status")}
                      />
                    </th>

                    <th className="px-4 py-3 font-medium">
                      {t("dashboard.superAdmin.accessRequests.columns.email")}
                    </th>

                    <th className="px-4 py-3 font-medium">
                      {t("dashboard.superAdmin.accessRequests.columns.mobile")}
                    </th>

                    <th className="px-4 py-3 font-medium">
                      <TableSortButton
                        label={t(
                          "dashboard.superAdmin.accessRequests.columns.created",
                        )}
                        direction={sortDirection}
                        active={sortKey === "createdAt"}
                        onClick={() => toggleSort("createdAt")}
                      />
                    </th>

                    <th className="px-4 py-3 font-medium text-right">
                      {t("dashboard.superAdmin.accessRequests.columns.actions")}
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {paginated.map((request) => (
                    <tr key={request.id} className="border-t border-border/40">
                      <td className="px-4 py-3">{request.fullName || "-"}</td>
                      <td className="px-4 py-3">{request.requestedRole}</td>
                      <td className="px-4 py-3">
                        <StatusBadge value={request.status} />
                      </td>
                      <td className="px-4 py-3">{request.email || "-"}</td>
                      <td className="px-4 py-3">{request.mobile || "-"}</td>
                      <td className="px-4 py-3">
                        {new Date(request.createdAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <TableActionButton
                            label={t(
                              "dashboard.superAdmin.accessRequests.actions.view",
                            )}
                            icon={L.Eye}
                            onClick={() => setSelected(request)}
                          />

                          {request.status === "PENDING" ? (
                            <>
                              <TableActionButton
                                label={t(
                                  "dashboard.superAdmin.accessRequests.actions.approve",
                                )}
                                icon={L.CheckCircle2}
                                disabled={isReviewing}
                                onClick={() => handleApprove(request.id)}
                              />

                              <TableActionButton
                                label={t(
                                  "dashboard.superAdmin.accessRequests.actions.reject",
                                )}
                                icon={L.XCircle}
                                variant="brandDanger"
                                disabled={isReviewing}
                                onClick={() => handleReject(request.id)}
                              />
                            </>
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
              pageSize={pageSize}
              total={items.length}
              onPageChange={setPage}
            />
          </SuperAdminSectionCard>
        </div>
      </div>

      <DetailDrawer
        open={Boolean(selected)}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
        title={t("dashboard.superAdmin.accessRequests.drawer.title")}
        description={t(
          "dashboard.superAdmin.accessRequests.drawer.description",
        )}
      >
        {selected ? (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-secondary/25 p-4">
              <p className="text-xs text-muted-foreground">
                {t("dashboard.superAdmin.accessRequests.drawer.fullName")}
              </p>
              <p className="mt-1 font-medium">{selected.fullName || "-"}</p>
            </div>

            <div className="rounded-2xl bg-secondary/25 p-4">
              <p className="text-xs text-muted-foreground">
                {t("dashboard.superAdmin.accessRequests.drawer.requestedRole")}
              </p>
              <p className="mt-1 font-medium">{selected.requestedRole}</p>
            </div>

            <div className="rounded-2xl bg-secondary/25 p-4">
              <p className="text-xs text-muted-foreground">
                {t("dashboard.superAdmin.accessRequests.drawer.status")}
              </p>
              <div className="mt-2">
                <StatusBadge value={selected.status} />
              </div>
            </div>

            <div className="rounded-2xl bg-secondary/25 p-4">
              <p className="text-xs text-muted-foreground">
                {t("dashboard.superAdmin.accessRequests.drawer.createdAt")}
              </p>
              <p className="mt-1 font-medium">
                {new Date(selected.createdAt).toLocaleString()}
              </p>
            </div>

            <div className="rounded-2xl bg-secondary/25 p-4">
              <p className="text-xs text-muted-foreground">
                {t("dashboard.superAdmin.accessRequests.drawer.email")}
              </p>
              <p className="mt-1 font-medium">{selected.email || "-"}</p>
            </div>

            <div className="rounded-2xl bg-secondary/25 p-4">
              <p className="text-xs text-muted-foreground">
                {t("dashboard.superAdmin.accessRequests.drawer.mobile")}
              </p>
              <p className="mt-1 font-medium">{selected.mobile || "-"}</p>
            </div>

            <div className="rounded-2xl bg-secondary/25 p-4">
              <p className="text-xs text-muted-foreground">
                {t("dashboard.superAdmin.accessRequests.drawer.reviewedBy")}
              </p>
              <p className="mt-1 font-medium">{selected.reviewedById || "-"}</p>
            </div>

            <div className="rounded-2xl bg-secondary/25 p-4">
              <p className="text-xs text-muted-foreground">
                {t("dashboard.superAdmin.accessRequests.drawer.reviewedAt")}
              </p>
              <p className="mt-1 font-medium">{selected.reviewedAt || "-"}</p>
            </div>

            <div className="rounded-2xl bg-secondary/25 p-4 md:col-span-2">
              <p className="text-xs text-muted-foreground">
                {t("dashboard.superAdmin.accessRequests.drawer.rejectReason")}
              </p>
              <p className="mt-1 font-medium">{selected.rejectReason || "-"}</p>
            </div>
          </div>
        ) : null}
      </DetailDrawer>
    </>
  );
};

export default SuperAdminAccessRequestsPage;
