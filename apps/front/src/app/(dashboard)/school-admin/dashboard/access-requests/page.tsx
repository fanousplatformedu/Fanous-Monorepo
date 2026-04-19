"use client";

import { DashboardSidebar } from "@modules/Dashboard/parts/dashboard-sidebar";
import { DashboardHeader } from "@modules/Dashboard/parts/dashboard-header";
import { DashboardShell } from "@modules/Dashboard/parts/dashboard-shell";
import { schoolAdminNav } from "@/utils/dashboard-nav.config";
import { Background } from "@elements/background";
import { useI18n } from "@/hooks/useI18n";

import SchoolAdminAccessRequestsPage from "@modules/Dashboard/SchoolAdmin/AccessRequests";

const AccessRequestSchoolAdmin = () => {
  const { t } = useI18n();

  return (
    <DashboardShell
      header={
        <DashboardHeader
          title={t("dashboard.schoolAdmin.accessRequests.page.title")}
          description={t(
            "dashboard.schoolAdmin.accessRequests.page.description",
          )}
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
      <SchoolAdminAccessRequestsPage />
    </DashboardShell>
  );
};

export default AccessRequestSchoolAdmin;
