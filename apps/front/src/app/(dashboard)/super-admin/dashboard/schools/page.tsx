"use client";

import { DashboardSidebar } from "@modules/Dashboard/parts/dashboard-sidebar";
import { DashboardHeader } from "@modules/Dashboard/parts/dashboard-header";
import { DashboardShell } from "@modules/Dashboard/parts/dashboard-shell";
import { superAdminNav } from "@/utils/dashboard-nav.config";
import { Background } from "@elements/background";
import { useI18n } from "@/hooks/useI18n";

import SuperAdminSchoolsPage from "@modules/Dashboard/SuperAdmin/SchoolsPage";

const SchoolsSuperAdminDashboard = () => {
  const { t } = useI18n();
  return (
    <DashboardShell
      header={
        <DashboardHeader
          title={t("dashboard.superAdmin.schoolsPage.header.title")}
          description={t("dashboard.superAdmin.schoolsPage.header.description")}
        />
      }
      sidebar={
        <DashboardSidebar
          title={t("dashboard.superAdmin.sidebar.title")}
          subtitle={t("dashboard.superAdmin.sidebar.subtitle")}
          items={superAdminNav}
        />
      }
    >
      <Background />
      <SuperAdminSchoolsPage />
    </DashboardShell>
  );
};

export default SchoolsSuperAdminDashboard;
