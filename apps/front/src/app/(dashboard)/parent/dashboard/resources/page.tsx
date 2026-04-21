"use client";

import { DashboardSidebar } from "@modules/Dashboard/parts/dashboard-sidebar";
import { DashboardHeader } from "@modules/Dashboard/parts/dashboard-header";
import { DashboardShell } from "@modules/Dashboard/parts/dashboard-shell";
import { Background } from "@elements/background";
import { parentNav } from "@/utils/dashboard-nav.config";
import { useI18n } from "@/hooks/useI18n";

import ParentResourcesPage from "@modules/Dashboard/Parent/Resources";

const ParentResourcesDashboardPage = () => {
  const { t } = useI18n();

  return (
    <DashboardShell
      header={
        <DashboardHeader
          title={t("dashboard.parent.resources.page.title")}
          description={t("dashboard.parent.resources.page.description")}
        />
      }
      sidebar={
        <DashboardSidebar
          items={parentNav}
          title={t("dashboard.parent.shell.title")}
          subtitle={t("dashboard.parent.shell.subtitle")}
        />
      }
    >
      <Background />
      <ParentResourcesPage />
    </DashboardShell>
  );
};

export default ParentResourcesDashboardPage;
