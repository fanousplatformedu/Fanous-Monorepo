"use client";

import { TResultSummaryCards } from "@/types/modules";
import { DashboardSection } from "@modules/Dashboard/parts/dashboard-section";
import { useI18n } from "@/hooks/useI18n";

export const ParentResultsSummaryCards = ({
  total,
  averageScore,
  compareCount,
}: TResultSummaryCards) => {
  const { t } = useI18n();

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <DashboardSection
        title={t("dashboard.parent.results.kpis.total.title")}
        description={t("dashboard.parent.results.kpis.total.description")}
      >
        <p className="text-3xl font-bold text-foreground">{total}</p>
      </DashboardSection>

      <DashboardSection
        title={t("dashboard.parent.results.kpis.average.title")}
        description={t("dashboard.parent.results.kpis.average.description")}
      >
        <p className="text-3xl font-bold text-foreground">{averageScore}%</p>
      </DashboardSection>

      <DashboardSection
        title={t("dashboard.parent.results.kpis.compare.title")}
        description={t("dashboard.parent.results.kpis.compare.description")}
      >
        <p className="text-3xl font-bold text-foreground">{compareCount}/2</p>
      </DashboardSection>
    </div>
  );
};
