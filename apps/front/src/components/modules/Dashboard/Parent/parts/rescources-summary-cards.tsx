"use client";

import { TResourcesSummaryCards } from "@/types/modules";
import { DashboardSection } from "@modules/Dashboard/parts/dashboard-section";
import { useI18n } from "@/hooks/useI18n";

export const ParentResourcesSummaryCards = ({
  careerCount,
  supportCount,
  totalResources,
  wellbeingCount,
}: TResourcesSummaryCards) => {
  const { t } = useI18n();

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <DashboardSection
        title={t("dashboard.parent.resources.kpis.total.title")}
        description={t("dashboard.parent.resources.kpis.total.description")}
      >
        <p className="text-3xl font-bold text-foreground">{totalResources}</p>
      </DashboardSection>

      <DashboardSection
        title={t("dashboard.parent.resources.kpis.wellbeing.title")}
        description={t("dashboard.parent.resources.kpis.wellbeing.description")}
      >
        <p className="text-3xl font-bold text-foreground">{wellbeingCount}</p>
      </DashboardSection>

      <DashboardSection
        title={t("dashboard.parent.resources.kpis.career.title")}
        description={t("dashboard.parent.resources.kpis.career.description")}
      >
        <p className="text-3xl font-bold text-foreground">{careerCount}</p>
      </DashboardSection>

      <DashboardSection
        title={t("dashboard.parent.resources.kpis.support.title")}
        description={t("dashboard.parent.resources.kpis.support.description")}
      >
        <p className="text-3xl font-bold text-foreground">{supportCount}</p>
      </DashboardSection>
    </div>
  );
};
