"use client";

import { DashboardSidebar } from "@modules/Dashboard/parts/dashboard-sidebar";
import { DashboardHeader } from "@modules/Dashboard/parts/dashboard-header";
import { DashboardShell } from "@modules/Dashboard/parts/dashboard-shell";
import { schoolAdminNav } from "@/utils/dashboard-nav.config";
import { Background } from "@elements/background";
import { useI18n } from "@/hooks/useI18n";

import SchoolAdminCounselorAssignmentsPage from "@modules/Dashboard/SchoolAdmin/CounselorAssignments";

const CounselorAssignmentsSchoolAdminDashboardPage = () => {
  const { t } = useI18n();

  return (
    <DashboardShell
      header={
        <DashboardHeader
          title={t("dashboard.schoolAdmin.counselorAssignments.page.title")}
          description={t(
            "dashboard.schoolAdmin.counselorAssignments.page.description",
          )}
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
      <SchoolAdminCounselorAssignmentsPage />
    </DashboardShell>
  );
};

export default CounselorAssignmentsSchoolAdminDashboardPage;
