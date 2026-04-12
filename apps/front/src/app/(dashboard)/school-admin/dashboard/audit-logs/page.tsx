"use client";

import { DashboardSidebar } from "@elements/dashboard-sidebar";
import { DashboardHeader } from "@elements/dashboard-header";
import { DashboardShell } from "@elements/dashboard-shell";
import { schoolAdminNav } from "@/utils/dashboard-nav.config";
import { Background } from "@elements/background";
import { useI18n } from "@/hooks/useI18n";

import SchoolAdminAuditLogsPage from "@modules/Dashboard/SchoolAdmin/AuditLogs";

const AuditLogsSchoolAdminDashboard = () => {
  const { t } = useI18n();

  return (
    <DashboardShell
      header={
        <DashboardHeader
          title={t(
            "dashboard.schoolAdmin.auditLogs.header.title",
            {},
            "Audit Logs",
          )}
          description={t(
            "dashboard.schoolAdmin.auditLogs.header.description",
            {},
            "Track important actions inside your school.",
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
      <SchoolAdminAuditLogsPage />
    </DashboardShell>
  );
};

export default AuditLogsSchoolAdminDashboard;
