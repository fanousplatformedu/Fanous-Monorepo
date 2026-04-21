"use client";

import { TActivitiesSummaryCard } from "@/types/modules";
import { DashboardSection } from "@modules/Dashboard/parts/dashboard-section";
import { useI18n } from "@/hooks/useI18n";

export const ParentActivitiesSummaryCards = ({
  sessionsCount,
  totalActivities,
  completedAssessments,
  submittedAssignments,
}: TActivitiesSummaryCard) => {
  const { t } = useI18n();

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <DashboardSection
        title={t("dashboard.parent.activities.kpis.total.title")}
        description={t("dashboard.parent.activities.kpis.total.description")}
      >
        <p className="text-3xl font-bold text-foreground">{totalActivities}</p>
      </DashboardSection>

      <DashboardSection
        title={t("dashboard.parent.activities.kpis.assessments.title")}
        description={t(
          "dashboard.parent.activities.kpis.assessments.description",
        )}
      >
        <p className="text-3xl font-bold text-foreground">
          {completedAssessments}
        </p>
      </DashboardSection>

      <DashboardSection
        title={t("dashboard.parent.activities.kpis.assignments.title")}
        description={t(
          "dashboard.parent.activities.kpis.assignments.description",
        )}
      >
        <p className="text-3xl font-bold text-foreground">
          {submittedAssignments}
        </p>
      </DashboardSection>

      <DashboardSection
        title={t("dashboard.parent.activities.kpis.sessions.title")}
        description={t("dashboard.parent.activities.kpis.sessions.description")}
      >
        <p className="text-3xl font-bold text-foreground">{sessionsCount}</p>
      </DashboardSection>
    </div>
  );
};
