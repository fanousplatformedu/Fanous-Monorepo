"use client";

import { TParentCounselingSummary } from "@/types/modules";
import { DashboardSection } from "@modules/Dashboard/parts/dashboard-section";
import { useI18n } from "@/hooks/useI18n";

export const ParentCounselingSummaryCards = ({
  requestedCount,
  confirmedCount,
  completedCount,
}: TParentCounselingSummary) => {
  const { t } = useI18n();

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <DashboardSection
        title={t("dashboard.parent.counseling.kpis.requested.title")}
        description={t(
          "dashboard.parent.counseling.kpis.requested.description",
        )}
      >
        <p className="text-3xl font-bold text-foreground">{requestedCount}</p>
      </DashboardSection>

      <DashboardSection
        title={t("dashboard.parent.counseling.kpis.confirmed.title")}
        description={t(
          "dashboard.parent.counseling.kpis.confirmed.description",
        )}
      >
        <p className="text-3xl font-bold text-foreground">{confirmedCount}</p>
      </DashboardSection>

      <DashboardSection
        title={t("dashboard.parent.counseling.kpis.completed.title")}
        description={t(
          "dashboard.parent.counseling.kpis.completed.description",
        )}
      >
        <p className="text-3xl font-bold text-foreground">{completedCount}</p>
      </DashboardSection>
    </div>
  );
};
