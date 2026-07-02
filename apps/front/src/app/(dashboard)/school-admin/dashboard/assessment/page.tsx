"use client";

import { DashboardSidebar } from "@modules/Dashboard/parts/dashboard-sidebar";
import { DashboardHeader } from "@modules/Dashboard/parts/dashboard-header";
import { DashboardShell } from "@modules/Dashboard/parts/dashboard-shell";
import { schoolAdminNav } from "@/utils/dashboard-nav.config";
import { Background } from "@elements/background";
import { useI18n } from "@/hooks/useI18n";

import SchoolAdminAssignmentsPage from "@modules/Dashboard/SchoolAdmin/Assignments";

const AssignmentsSchoolAdminDashboard = () => {
  const { t } = useI18n();

  return (
    <DashboardShell
      header={
        <DashboardHeader
          title={t("dashboard.schoolAdmin.assignments.page.title")}
          description={t("dashboard.schoolAdmin.assignments.page.description")}
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
      <Background />
      <SchoolAdminAssignmentsPage />
    </DashboardShell>
  );
};

export default AssignmentsSchoolAdminDashboard;
