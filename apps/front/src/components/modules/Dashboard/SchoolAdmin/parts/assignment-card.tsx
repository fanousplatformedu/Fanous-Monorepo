"use client";

import { TAssignmentSummaryCardsProps } from "@/types/modules";
import { DashboardSection } from "@modules/Dashboard/parts/dashboard-section";
import { useI18n } from "@/hooks/useI18n";

export const AssignmentSummaryCards = ({
  summary,
  isFetching,
  questionCount,
}: TAssignmentSummaryCardsProps) => {
  const { t } = useI18n();

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      <DashboardSection
        title={t("dashboard.schoolAdmin.assignments.summary.totalAssignments")}
        description={t(
          "dashboard.schoolAdmin.assignments.summary.totalAssignmentsDescription",
        )}
      >
        <p className="text-2xl font-bold">{summary?.totalAssignments ?? 0}</p>
      </DashboardSection>

      <DashboardSection
        title={t(
          "dashboard.schoolAdmin.assignments.summary.publishedAssignments",
        )}
        description={t(
          "dashboard.schoolAdmin.assignments.summary.publishedAssignmentsDescription",
        )}
      >
        <p className="text-2xl font-bold">
          {summary?.publishedAssignments ?? 0}
        </p>
      </DashboardSection>

      <DashboardSection
        title={t("dashboard.schoolAdmin.assignments.summary.totalStudents")}
        description={t(
          "dashboard.schoolAdmin.assignments.summary.totalStudentsDescription",
        )}
      >
        <p className="text-2xl font-bold">{summary?.totalStudents ?? 0}</p>
      </DashboardSection>

      <DashboardSection
        title={t(
          "dashboard.schoolAdmin.assignments.summary.pendingAssignments",
        )}
        description={t(
          "dashboard.schoolAdmin.assignments.summary.pendingAssignmentsDescription",
        )}
      >
        <p className="text-2xl font-bold">
          {summary?.pendingStudentAssignments ?? 0}
        </p>
      </DashboardSection>

      <DashboardSection
        title={t("dashboard.schoolAdmin.assignments.summary.activeQuestions")}
        description={t(
          "dashboard.schoolAdmin.assignments.summary.activeQuestionsDescription",
        )}
      >
        <p className="text-2xl font-bold">{questionCount}</p>
      </DashboardSection>

      {isFetching ? (
        <p className="col-span-full text-xs text-muted-foreground">
          {t("common.refreshing")}
        </p>
      ) : null}
    </div>
  );
};
