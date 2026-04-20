"use client";

import { DashboardSection } from "@modules/Dashboard/parts/dashboard-section";
import { TChildrenSummary } from "@/types/modules";
import { useI18n } from "@/hooks/useI18n";

export const ParentChildrenSummaryCards = ({
  totalChildren,
  withEmailCount,
  withMobileCount,
}: TChildrenSummary) => {
  const { t } = useI18n();

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <DashboardSection
        title={t("dashboard.parent.children.kpis.total.title")}
        description={t("dashboard.parent.children.kpis.total.description")}
      >
        <p className="text-3xl font-bold text-foreground">{totalChildren}</p>
      </DashboardSection>

      <DashboardSection
        title={t("dashboard.parent.children.kpis.email.title")}
        description={t("dashboard.parent.children.kpis.email.description")}
      >
        <p className="text-3xl font-bold text-foreground">{withEmailCount}</p>
      </DashboardSection>

      <DashboardSection
        title={t("dashboard.parent.children.kpis.mobile.title")}
        description={t("dashboard.parent.children.kpis.mobile.description")}
      >
        <p className="text-3xl font-bold text-foreground">{withMobileCount}</p>
      </DashboardSection>
    </div>
  );
};
