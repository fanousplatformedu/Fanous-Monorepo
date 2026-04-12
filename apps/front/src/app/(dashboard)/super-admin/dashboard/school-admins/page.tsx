"use client";

import { DashboardSidebar } from "@elements/dashboard-sidebar";
import { DashboardHeader } from "@elements/dashboard-header";
import { DashboardShell } from "@elements/dashboard-shell";
import { superAdminNav } from "@/utils/dashboard-nav.config";
import { Background } from "@elements/background";
import { useI18n } from "@/hooks/useI18n";

import SuperAdminSchoolAdminsPage from "@modules/Dashboard/SuperAdmin/SchoolAdmins";

const SchoolAdminSuperAdminDashboard = () => {
  const { t } = useI18n();

  return (
    <DashboardShell
      header={
        <DashboardHeader
          title={t("dashboard.superAdmin.schoolAdminsPage.header.title")}
          description={t(
            "dashboard.superAdmin.schoolAdminsPage.header.description",
          )}
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
      <SuperAdminSchoolAdminsPage />
    </DashboardShell>
  );
};

export default SchoolAdminSuperAdminDashboard;
