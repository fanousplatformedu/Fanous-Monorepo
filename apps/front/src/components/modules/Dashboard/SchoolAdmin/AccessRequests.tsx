"use client";

import { useSchoolAdminAccessRequestsQuery } from "@/lib/redux/api";
import { useReviewAccessRequestMutation } from "@/lib/redux/api";
import { DashboardLoadingCard } from "@elements/dashboard-loading-card";
import { DashboardEmptyState } from "@elements/dashboard-empty-state";
import { DashboardTableCard } from "@elements/dashboard-table-card";
import { getApiErrorMessage } from "@/utils/function-helper";
import { useMemo, useState } from "react";
import { TablePagination } from "@elements/table-pagination";
import { StatusBadge } from "@elements/status-badge";
import { PAGE_SIZE } from "@/utils/constant";
import { Button } from "@ui/button";
import { toast } from "sonner";

import * as L from "lucide-react";

const SchoolAdminAccessRequestsPage = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching } = useSchoolAdminAccessRequestsQuery({
    take: PAGE_SIZE,
    skip: (page - 1) * PAGE_SIZE,
  });

  console.log("data", data);

  const [reviewRequest, { isLoading: isReviewing }] =
    useReviewAccessRequestMutation();

  const items = useMemo(() => data?.items ?? [], [data]);
  const total = data?.total ?? 0;

  const handleApprove = async (
    requestId: string,
    requestedRole: "STUDENT" | "PARENT" | "COUNSELOR" | "TEACHER",
  ) => {
    try {
      const res = await reviewRequest({
        requestId,
        approve: true,
        finalRole: requestedRole,
      }).unwrap();
      toast.success(res.message || "Request approved successfully.");
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Failed to approve request."));
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      const res = await reviewRequest({
        requestId,
        approve: false,
        rejectReason: "Rejected by school admin",
      }).unwrap();
      toast.success(res.message || "Request rejected successfully.");
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Failed to reject request."));
    }
  };

  if (isLoading) return <DashboardLoadingCard rows={8} />;

  if (!items.length)
    return (
      <DashboardEmptyState
        icon={L.UserCheck2}
        title="No access requests"
        description="Requests submitted to your school will appear here."
      />
    );

  return (
    <DashboardTableCard
      title="Access Requests"
      description="Review pending member access requests."
    >
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-secondary/30 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Full Name</th>
              <th className="px-4 py-3 font-medium">Requested Role</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Mobile</th>
              <th className="px-4 py-3 font-medium">Created</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {items.map((request) => (
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
                  {request.status === "PENDING" ? (
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="brand"
                        disabled={isReviewing}
                        onClick={() =>
                          handleApprove(
                            request.id,
                            request.requestedRole as
                              | "STUDENT"
                              | "PARENT"
                              | "COUNSELOR"
                              | "TEACHER",
                          )
                        }
                      >
                        Approve
                      </Button>

                      <Button
                        size="sm"
                        variant="brandOutline"
                        disabled={isReviewing}
                        onClick={() => handleReject(request.id)}
                      >
                        Reject
                      </Button>
                    </div>
                  ) : (
                    <div className="text-right text-muted-foreground">-</div>
                  )}
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
        onPageChange={setPage}
      />

      {isFetching ? (
        <p className="mt-3 text-xs text-muted-foreground">Refreshing...</p>
      ) : null}
    </DashboardTableCard>
  );
};

export default SchoolAdminAccessRequestsPage;
