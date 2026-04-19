"use client";

import { TPerformanceSummary } from "@/types/modules";
import { DashboardChartCard } from "@modules/Dashboard/parts/dashboard-chart-card";
import { useI18n } from "@/hooks/useI18n";

export const StudentPerformanceSummary = ({
  latestOverallScore,
  dominantIntelligenceLabel,
  pendingCounselingSessions,
  submittedAssignments,
}: TPerformanceSummary) => {
  const { t } = useI18n();

  return (
    <DashboardChartCard
      title={t("dashboard.student.overview.cards.performance.title")}
      description={t(
        "dashboard.student.overview.cards.performance.description",
      )}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-border/60 bg-card/70 p-5">
          <p className="text-xs text-muted-foreground">
            {t("dashboard.student.overview.performance.latestOverall")}
          </p>
          <p className="mt-2 text-3xl font-bold">{latestOverallScore}%</p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/70 p-5">
          <p className="text-xs text-muted-foreground">
            {t("dashboard.student.overview.performance.dominantIntelligence")}
          </p>
          <p className="mt-2 text-lg font-semibold">
            {dominantIntelligenceLabel}
          </p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/70 p-5">
          <p className="text-xs text-muted-foreground">
            {t("dashboard.student.overview.performance.pendingCounseling")}
          </p>
          <p className="mt-2 text-3xl font-bold">{pendingCounselingSessions}</p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/70 p-5">
          <p className="text-xs text-muted-foreground">
            {t("dashboard.student.overview.performance.submittedAssignments")}
          </p>
          <p className="mt-2 text-3xl font-bold">{submittedAssignments}</p>
        </div>
      </div>
    </DashboardChartCard>
  );
};
