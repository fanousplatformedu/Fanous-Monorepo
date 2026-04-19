"use client";

import { DashboardSidebar } from "@/components/modules/Dashboard/parts/dashboard-sidebar";
import { DashboardHeader } from "@/components/modules/Dashboard/parts/dashboard-header";
import { DashboardShell } from "@/components/modules/Dashboard/parts/dashboard-shell";
import { schoolAdminNav } from "@/utils/dashboard-nav.config";
import { Background } from "@elements/background";
import { useI18n } from "@/hooks/useI18n";

import SchoolAdminSettingsPage from "@modules/Dashboard/SchoolAdmin/Settings";

const SettingSchoolAdminDashboard = () => {
  const { t } = useI18n();

  return (
    <DashboardShell
      header={
        <DashboardHeader
          title={t(
            "dashboard.schoolAdmin.settings.header.title",
            {},
            "Settings",
          )}
          description={t(
            "dashboard.schoolAdmin.settings.header.description",
            {},
            "Your current school admin profile.",
          )}
        />
      }
      sidebar={
        <DashboardSidebar
          title={t("dashboard.schoolAdmin.sidebar.title", {}, "School Admin")}
          subtitle={t(
            "dashboard.schoolAdmin.sidebar.subtitle",
            {},
            "School operations panel",
          )}
          items={schoolAdminNav}
        />
      }
    >
      <Background />
      <SchoolAdminSettingsPage />
    </DashboardShell>
  );
};

export default SettingSchoolAdminDashboard;
