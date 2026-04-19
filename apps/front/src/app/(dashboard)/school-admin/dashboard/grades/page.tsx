"use client";

import { DashboardSidebar } from "@modules/Dashboard/parts/dashboard-sidebar";
import { DashboardHeader } from "@modules/Dashboard/parts/dashboard-header";
import { DashboardShell } from "@modules/Dashboard/parts/dashboard-shell";
import { schoolAdminNav } from "@/utils/dashboard-nav.config";
import { Background } from "@elements/background";
import { useI18n } from "@/hooks/useI18n";

import SchoolAdminGradesPage from "@modules/Dashboard/SchoolAdmin/Grades";

const GradesSchoolAdminDashboard = () => {
  const { t } = useI18n();

  return (
    <DashboardShell
      header={
        <DashboardHeader
          title={t("dashboard.schoolAdmin.grades.page.title")}
          description={t("dashboard.schoolAdmin.grades.page.description")}
        />
      }
      sidebar={
        <DashboardSidebar
          items={schoolAdminNav}
          title={t("dashboard.schoolAdmin.shell.title")}
          subtitle={t("dashboard.schoolAdmin.shell.subtitle")}
        />
      }
    >
      <Background />
      <SchoolAdminGradesPage />
    </DashboardShell>
  );
};

export default GradesSchoolAdminDashboard;
