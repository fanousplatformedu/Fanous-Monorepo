"use client";

import { TProgressPoint, TSimpleChartItem } from "@/types/modules";
import { useStudentDashboardSummaryQuery } from "@/lib/redux/api/endpoints/student.api";
import { StudentProgressTimelineChart } from "@modules/Dashboard/Student/parts/progress-timeline-chart";
import { StudentAssignmentFlowChart } from "@modules/Dashboard/Student/parts/assignment-chart";
import { StudentPerformanceSummary } from "@modules/Dashboard/Student/parts/performance-summary";
import { StudentActionCenterChart } from "@modules/Dashboard/Student/parts/action-center-chart";
import { useSchoolUserMeQuery } from "@/lib/redux/api";
import { StudentOverviewStats } from "@modules/Dashboard/Student/parts/overview-stats";
import { DashboardLoadingCard } from "@modules/Dashboard/parts/dashboard-loading-card";
import { DashboardEmptyState } from "@modules/Dashboard/parts/dashboard-empty-state";
import { useI18n } from "@/hooks/useI18n";
import { useMemo } from "react";

import * as L from "lucide-react";

const StudentOverview = () => {
  const { t } = useI18n();

  const { data: me, isLoading: isMeLoading } = useSchoolUserMeQuery();
  const { data: summary, isLoading: isSummaryLoading } =
    useStudentDashboardSummaryQuery();

  const isLoading = isMeLoading || isSummaryLoading;

  const roleLabel = useMemo(() => {
    const role = me?.role;
    if (!role) return "-";
    const map: Record<string, string> = {
      STUDENT: t("roles.student"),
      PARENT: t("roles.parent"),
      COUNSELOR: t("roles.counselor"),
      SCHOOL_ADMIN: t("roles.schoolAdmin"),
      SUPER_ADMIN: t("roles.superAdmin"),
    };
    return map[role] ?? role;
  }, [me?.role, t]);

  const statusLabel = useMemo(() => {
    const status = me?.status;
    if (!status) return "-";
    const map: Record<string, string> = {
      ACTIVE: t("status.active"),
      DISABLED: t("status.disabled"),
      DELETED: t("status.deleted"),
    };
    return map[status] ?? status;
  }, [me?.status, t]);

  const assignmentFlowData = useMemo<TSimpleChartItem[]>(
    () => [
      {
        name: t("dashboard.student.overview.charts.assignmentFlow.pending"),
        value: summary?.pendingAssignments ?? 0,
      },
      {
        name: t("dashboard.student.overview.charts.assignmentFlow.inProgress"),
        value: summary?.inProgressAssignments ?? 0,
      },
      {
        name: t("dashboard.student.overview.charts.assignmentFlow.submitted"),
        value: summary?.submittedAssignments ?? 0,
      },
      {
        name: t("dashboard.student.overview.charts.assignmentFlow.evaluated"),
        value: summary?.evaluatedAssignments ?? 0,
      },
    ],
    [summary, t],
  );

  const actionCenterData = useMemo<TSimpleChartItem[]>(
    () => [
      {
        name: t("dashboard.student.overview.charts.actionCenter.notifications"),
        value: summary?.unreadNotifications ?? 0,
      },
      {
        name: t("dashboard.student.overview.charts.actionCenter.counseling"),
        value: summary?.pendingCounselingSessions ?? 0,
      },
      {
        name: t("dashboard.student.overview.charts.actionCenter.pending"),
        value: summary?.pendingAssignments ?? 0,
      },
    ],
    [summary, t],
  );

  const progressTimeline = useMemo<TProgressPoint[]>(
    () =>
      (summary?.progressTimeline ?? []).map((item) => ({
        label: item.label,
        overall: Number(item.overall ?? 0),
      })),
    [summary?.progressTimeline],
  );

  const dominantIntelligenceLabel = useMemo(() => {
    const value = summary?.dominantIntelligence;
    if (!value) return t("dashboard.student.overview.common.notAvailable");
    const map: Record<string, string> = {
      MUSICAL: t("dashboard.student.overview.intelligences.MUSICAL"),
      LINGUISTIC: t("dashboard.student.overview.intelligences.LINGUISTIC"),
      NATURALISTIC: t("dashboard.student.overview.intelligences.NATURALISTIC"),
      INTERPERSONAL: t(
        "dashboard.student.overview.intelligences.INTERPERSONAL",
      ),
      INTRAPERSONAL: t(
        "dashboard.student.overview.intelligences.INTRAPERSONAL",
      ),
      VISUAL_SPATIAL: t(
        "dashboard.student.overview.intelligences.VISUAL_SPATIAL",
      ),
      BODILY_KINESTHETIC: t(
        "dashboard.student.overview.intelligences.BODILY_KINESTHETIC",
      ),
      LOGICAL_MATHEMATICAL: t(
        "dashboard.student.overview.intelligences.LOGICAL_MATHEMATICAL",
      ),
    };
    return map[value] ?? value;
  }, [summary?.dominantIntelligence, t]);

  if (isLoading) return <DashboardLoadingCard rows={10} />;

  if (!me && !summary)
    return (
      <DashboardEmptyState
        icon={L.LayoutDashboard}
        title={t("dashboard.student.overview.empty.title")}
        description={t("dashboard.student.overview.empty.description")}
      />
    );

  return (
    <div className="space-y-6">
      <StudentOverviewStats
        roleLabel={roleLabel}
        statusLabel={statusLabel}
        totalAssignments={summary?.totalAssignments ?? 0}
        pendingAssignments={summary?.pendingAssignments ?? 0}
        unreadNotifications={summary?.unreadNotifications ?? 0}
        evaluatedAssignments={summary?.evaluatedAssignments ?? 0}
        inProgressAssignments={summary?.inProgressAssignments ?? 0}
      />

      <div className="grid gap-5 xl:grid-cols-2">
        <StudentAssignmentFlowChart data={assignmentFlowData} />
        <StudentProgressTimelineChart data={progressTimeline} />
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <StudentActionCenterChart data={actionCenterData} />
        <StudentPerformanceSummary
          latestOverallScore={summary?.latestOverallScore ?? 0}
          dominantIntelligenceLabel={dominantIntelligenceLabel}
          submittedAssignments={summary?.submittedAssignments ?? 0}
          pendingCounselingSessions={summary?.pendingCounselingSessions ?? 0}
        />
      </div>
    </div>
  );
};

export default StudentOverview;
