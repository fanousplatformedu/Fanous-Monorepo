"use client";

import { DashboardSidebar } from "@modules/Dashboard/parts/dashboard-sidebar";
import { DashboardHeader } from "@modules/Dashboard/parts/dashboard-header";
import { DashboardShell } from "@modules/Dashboard/parts/dashboard-shell";
import { counselorNav } from "@/utils/dashboard-nav.config";
import { Background } from "@elements/background";
import { useI18n } from "@/hooks/useI18n";

import CounselorAssignmentsPage from "@modules/Dashboard/Counselor/Assignments";

const CounselorAssignmentsDashboardPage = () => {
  const { t } = useI18n();

  return (
    <DashboardShell
      header={
        <DashboardHeader
          title={t("dashboard.counselor.assignments.page.title")}
          description={t("dashboard.counselor.assignments.page.description")}
        />
      }
      sidebar={
        <DashboardSidebar
          items={counselorNav}
          title={t("dashboard.counselor.shell.title")}
          subtitle={t("dashboard.counselor.shell.subtitle")}
        />
      }
    >
      <Background />
      <CounselorAssignmentsPage />
    </DashboardShell>
  );
};

export default CounselorAssignmentsDashboardPage;
