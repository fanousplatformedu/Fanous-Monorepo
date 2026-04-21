"use client";

import { TOverviewSummaryCards } from "@/types/modules";
import { DashboardSection } from "@modules/Dashboard/parts/dashboard-section";
import { useI18n } from "@/hooks/useI18n";

export const ParentOverviewSummaryCards = ({
  totalChildren,
  totalResults,
  totalActivities,
  totalSessions,
}: TOverviewSummaryCards) => {
  const { t } = useI18n();

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <DashboardSection
        title={t("dashboard.parent.overview.kpis.children.title")}
        description={t("dashboard.parent.overview.kpis.children.description")}
      >
        <p className="text-3xl font-bold text-foreground">{totalChildren}</p>
      </DashboardSection>

      <DashboardSection
        title={t("dashboard.parent.overview.kpis.results.title")}
        description={t("dashboard.parent.overview.kpis.results.description")}
      >
        <p className="text-3xl font-bold text-foreground">{totalResults}</p>
      </DashboardSection>

      <DashboardSection
        title={t("dashboard.parent.overview.kpis.activities.title")}
        description={t("dashboard.parent.overview.kpis.activities.description")}
      >
        <p className="text-3xl font-bold text-foreground">{totalActivities}</p>
      </DashboardSection>

      <DashboardSection
        title={t("dashboard.parent.overview.kpis.sessions.title")}
        description={t("dashboard.parent.overview.kpis.sessions.description")}
      >
        <p className="text-3xl font-bold text-foreground">{totalSessions}</p>
      </DashboardSection>
    </div>
  );
};
