"use client";

import { DashboardSidebar } from "@modules/Dashboard/parts/dashboard-sidebar";
import { DashboardHeader } from "@modules/Dashboard/parts/dashboard-header";
import { DashboardShell } from "@modules/Dashboard/parts/dashboard-shell";
import { schoolAdminNav } from "@/utils/dashboard-nav.config";
import { Background } from "@elements/background";
import { useI18n } from "@/hooks/useI18n";

import SchoolAdminEnrollmentsPage from "@modules/Dashboard/SchoolAdmin/Enrollments";

const EnrollmentsSchoolAdminDashboard = () => {
  const { t } = useI18n();

  return (
    <DashboardShell
      header={
        <DashboardHeader
          title={t("dashboard.schoolAdmin.enrollments.page.title")}
          description={t("dashboard.schoolAdmin.enrollments.page.description")}
        />
      }
      sidebar={
        <DashboardSidebar
          title={t("dashboard.schoolAdmin.layout.title")}
          subtitle={t("dashboard.schoolAdmin.layout.subtitle")}
          items={schoolAdminNav}
        />
      }
    >
      <Background />
      <SchoolAdminEnrollmentsPage />
    </DashboardShell>
  );
};

export default EnrollmentsSchoolAdminDashboard;
