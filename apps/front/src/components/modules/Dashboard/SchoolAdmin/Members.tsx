"use client";

import { useRemoveSchoolMemberMutation } from "@/lib/redux/api";
import { useSchoolMembersQuery } from "@/lib/redux/api";
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

const SchoolAdminMembersPage = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useSchoolMembersQuery({
    take: PAGE_SIZE,
    skip: (page - 1) * PAGE_SIZE,
  });

  const [removeMember, { isLoading: isRemoving }] =
    useRemoveSchoolMemberMutation();

  const items = useMemo(() => data?.items ?? [], [data]);
  const total = data?.total ?? 0;

  const handleDisableMember = async (userId: string) => {
    try {
      await removeMember({
        userId,
        hardDelete: false,
      }).unwrap();
      toast.success("Member disabled successfully.");
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Failed to disable member."));
    }
  };

  if (isLoading) return <DashboardLoadingCard rows={8} />;

  if (!items.length)
    return (
      <DashboardEmptyState
        icon={L.Users}
        title="No members found"
        description="School members will appear here."
      />
    );

  return (
    <DashboardTableCard
      title="School Members"
      description="Users currently assigned to your school."
    >
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-secondary/30 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Full Name</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Mobile</th>
              <th className="px-4 py-3 font-medium">Created</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {items.map((member) => (
              <tr key={member.id} className="border-t border-border/40">
                <td className="px-4 py-3">{member.fullName || "-"}</td>
                <td className="px-4 py-3">{member.role}</td>
                <td className="px-4 py-3">
                  <StatusBadge value={member.status} />
                </td>
                <td className="px-4 py-3">{member.email || "-"}</td>
                <td className="px-4 py-3">{member.mobile || "-"}</td>
                <td className="px-4 py-3">
                  {new Date(member.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      variant="brandOutline"
                      disabled={isRemoving || member.status !== "ACTIVE"}
                      onClick={() => handleDisableMember(member.id)}
                    >
                      Disable
                    </Button>
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
        onPageChange={setPage}
      />
    </DashboardTableCard>
  );
};

export default SchoolAdminMembersPage;
