"use client";
import { schoolAdminNav } from "@/utils/dashboard-nav.config";
import { DashboardEmptyState } from "../parts/dashboard-empty-state";
import { DashboardHeader } from "../parts/dashboard-header";
import { DashboardShell } from "../parts/dashboard-shell";
import { DashboardSidebar } from "../parts/dashboard-sidebar";
import { useI18n } from "@/hooks/useI18n";
import type * as TAPI from "@lib/graphql/generated";
import { AssignmentStudentsTable } from "./parts/assignment-students-table";
import { useState } from "react";
import * as T from "@/lib/redux/api";
import { useParams } from "next/navigation";

export default function AssignmentDetail() {
  const params = useParams();
  const { t } = useI18n();
  const [page, setPage] = useState(1);

  const {
    isLoading,
    data: assignmentData,
    isFetching,
  } = T.useAssignmentDetailQuery({
    skip: page,
    take: 15,
    assignmentId: params.assignmentId as string,
  });

  if (assignmentData === undefined) return <div>loading...</div>;

  return (
    <DashboardShell
      header={
        <DashboardHeader
          title={`${t("dashboard.schoolAdmin.assessment.page.title")} ${assignmentData.title}`}
          description={t("dashboard.schoolAdmin.assessment.page.description")}
        />
      }
      sidebar={
        <DashboardSidebar
          title={t("dashboard.schoolAdmin.shell.title")}
          subtitle={t("dashboard.schoolAdmin.shell.subtitle")}
          items={schoolAdminNav}
        />
      }
    >
      <AssignmentStudentsTable
        page={page}
        items={assignmentData.studentAssignments}
        total={assignmentData!.studentAssignments.length}
        onPageChange={setPage}
        isLoading={isLoading}
        isFetching={isFetching}
        assignmentId={assignmentData.id}
      />
    </DashboardShell>
  );
}
