"use client";

import { DashboardSidebar } from "@modules/Dashboard/parts/dashboard-sidebar";
import { DashboardHeader } from "@modules/Dashboard/parts/dashboard-header";
import { DashboardShell } from "@modules/Dashboard/parts/dashboard-shell";
import { schoolAdminNav } from "@/utils/dashboard-nav.config";
import { Background } from "@elements/background";
import { useI18n } from "@/hooks/useI18n";

import SchoolAdminClassroomsPage from "@modules/Dashboard/SchoolAdmin/Classrooms";

const ClassroomsSchoolAdminDashboard = () => {
  const { t } = useI18n();

  return (
    <DashboardShell
      header={
        <DashboardHeader
          title={t("dashboard.schoolAdmin.classrooms.page.title")}
          description={t("dashboard.schoolAdmin.classrooms.page.description")}
        />
      }
      sidebar={
        <DashboardSidebar
          items={schoolAdminNav}
          title={t("dashboard.schoolAdmin.sidebar.title")}
          subtitle={t("dashboard.schoolAdmin.sidebar.subtitle")}
        />
      }
    >
      <Background />
      <SchoolAdminClassroomsPage />
    </DashboardShell>
  );
};

export default ClassroomsSchoolAdminDashboard;
