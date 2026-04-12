"use client";

import { DashboardSidebar } from "@elements/dashboard-sidebar";
import { DashboardHeader } from "@elements/dashboard-header";
import { DashboardShell } from "@elements/dashboard-shell";
import { schoolAdminNav } from "@/utils/dashboard-nav.config";
import { Background } from "@elements/background";
import { useI18n } from "@/hooks/useI18n";

import SchoolAdminMembersPage from "@modules/Dashboard/SchoolAdmin/Members";

const MembersSchoolAdminDashboard = () => {
  const { t } = useI18n();

  return (
    <DashboardShell
      header={
        <DashboardHeader
          title={t("dashboard.schoolAdmin.members.header.title", {}, "Members")}
          description={t(
            "dashboard.schoolAdmin.members.header.description",
            {},
            "List and manage members in your school.",
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
      <SchoolAdminMembersPage />
    </DashboardShell>
  );
};

export default MembersSchoolAdminDashboard;
