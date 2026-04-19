"use client";

import { DashboardSidebar } from "@/components/modules/Dashboard/parts/dashboard-sidebar";
import { DashboardHeader } from "@/components/modules/Dashboard/parts/dashboard-header";
import { DashboardShell } from "@/components/modules/Dashboard/parts/dashboard-shell";
import { superAdminNav } from "@/utils/dashboard-nav.config";
import { Background } from "@elements/background";
import { useI18n } from "@/hooks/useI18n";

import SuperAdminOverview from "@modules/Dashboard/SuperAdmin/Overview";

const SuperAdminDashboardPage = () => {
  const { t } = useI18n();

  return (
    <DashboardShell
      header={
        <DashboardHeader
          title={t("dashboard.superAdmin.header.title")}
          description={t("dashboard.superAdmin.header.description")}
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
      <SuperAdminOverview />
    </DashboardShell>
  );
};

export default SuperAdminDashboardPage;
