"use client";

import { AssignmentCompletionBars } from "@modules/Dashboard/Charts/AssignmentCompletionBars";
import { IntelligenceAverageBars } from "@modules/Dashboard/Charts/IntelligenceAvaragBars";
import { SchoolActivityTrendLine } from "@modules/Dashboard/SchoolAdmin/parts/activity-trend-line";
import { AssignmentStatusDonut } from "@modules/Dashboard/Charts/AssessmentStatusDonut";
import { SchoolMemberRoleDonut } from "@modules/Dashboard/SchoolAdmin/parts/member-role-donut";
import { DashboardLoadingCard } from "@modules/Dashboard/parts/dashboard-loading-card";
import { DashboardChartCard } from "@modules/Dashboard/parts/dashboard-chart-card";
import { DashboardStatCard } from "@modules/Dashboard/parts/dashboard-stat-card";
import { DashboardSection } from "@modules/Dashboard/parts/dashboard-section";
import { formatShortDate } from "@/utils/function-helper";
import { TTrendPoint } from "@/types/modules";
import { useI18n } from "@/hooks/useI18n";
import { useMemo } from "react";

import * as API from "@/lib/redux/api";
import * as L from "lucide-react";

const SchoolAdminOverview = () => {
  const { t } = useI18n();

  const { data: membersData, isLoading: isMembersLoading } =
    API.useSchoolMembersQuery({
      take: 200,
      skip: 0,
    });

  const { data: requestsData, isLoading: isRequestsLoading } =
    API.useSchoolAdminAccessRequestsQuery({
      take: 200,
      skip: 0,
    });

  const { data: auditData, isLoading: isAuditLoading } =
    API.useSchoolAdminAuditLogsQuery({
      take: 200,
      skip: 0,
    });

  const { data: assignmentsData, isLoading: isAssignmentsLoading } =
    API.useAssignmentsQuery({
      take: 200,
      skip: 0,
    });

  const { data: summary, isLoading: isSummaryLoading } =
    API.useSchoolAssessmentSummaryQuery({});

  const isLoading =
    isMembersLoading ||
    isRequestsLoading ||
    isAuditLoading ||
    isAssignmentsLoading ||
    isSummaryLoading;

  const members = useMemo(() => membersData?.items ?? [], [membersData]);
  const requests = useMemo(() => requestsData?.items ?? [], [requestsData]);
  const assignments = useMemo(
    () => assignmentsData?.items ?? [],
    [assignmentsData],
  );

  const studentsCount = members.filter(
    (member) => member.role === "STUDENT",
  ).length;
  const counselorsCount = members.filter(
    (member) => member.role === "COUNSELOR",
  ).length;
  const parentsCount = members.filter(
    (member) => member.role === "PARENT",
  ).length;

  const activeMembersCount = members.filter(
    (member) => member.status === "ACTIVE",
  ).length;

  const pendingRequestsCount = requests.filter(
    (request) => request.status === "PENDING",
  ).length;

  const approvedRequestsCount = requests.filter(
    (request) => request.status === "APPROVED",
  ).length;

  const rejectedRequestsCount = requests.filter(
    (request) => request.status === "REJECTED",
  ).length;

  const assignmentStatusData = [
    {
      name: t("dashboard.schoolAdmin.overview.charts.assignmentStatus.draft"),
      value: assignments.filter((item) => item.status === "DRAFT").length,
    },
    {
      name: t(
        "dashboard.schoolAdmin.overview.charts.assignmentStatus.published",
      ),
      value: assignments.filter((item) => item.status === "PUBLISHED").length,
    },
    {
      name: t("dashboard.schoolAdmin.overview.charts.assignmentStatus.closed"),
      value: assignments.filter((item) => item.status === "CLOSED").length,
    },
  ].filter((item) => item.value > 0);

  const memberRoleData = [
    {
      name: t("roles.student"),
      value: studentsCount,
    },
    {
      name: t("roles.parent"),
      value: parentsCount,
    },
    {
      name: t("roles.counselor"),
      value: counselorsCount,
    },
  ].filter((item) => item.value > 0);

  const intelligenceData = summary
    ? [
        {
          name: t(
            "dashboard.schoolAdmin.overview.charts.intelligence.linguistic",
          ),
          value: summary.avgLinguistic,
        },
        {
          name: t(
            "dashboard.schoolAdmin.overview.charts.intelligence.logicalMath",
          ),
          value: summary.avgLogicalMath,
        },
        {
          name: t("dashboard.schoolAdmin.overview.charts.intelligence.musical"),
          value: summary.avgMusical,
        },
        {
          name: t("dashboard.schoolAdmin.overview.charts.intelligence.bodily"),
          value: summary.avgBodilyKinesthetic,
        },
        {
          name: t("dashboard.schoolAdmin.overview.charts.intelligence.visual"),
          value: summary.avgVisualSpatial,
        },
        {
          name: t(
            "dashboard.schoolAdmin.overview.charts.intelligence.naturalistic",
          ),
          value: summary.avgNaturalistic,
        },
        {
          name: t(
            "dashboard.schoolAdmin.overview.charts.intelligence.interpersonal",
          ),
          value: summary.avgInterpersonal,
        },
        {
          name: t(
            "dashboard.schoolAdmin.overview.charts.intelligence.intrapersonal",
          ),
          value: summary.avgIntrapersonal,
        },
      ]
    : [];

  const completionBars = summary
    ? [
        {
          name: t("dashboard.schoolAdmin.overview.charts.assessmentFlow.name"),
          pending: summary.pendingStudentAssignments,
          submitted: summary.submittedStudentAssignments,
          evaluated: summary.evaluatedStudentAssignments,
        },
      ]
    : [];

  const trendMap = useMemo(() => {
    const map = new Map<string, TTrendPoint>();
    const ensure = (dateKey: string) => {
      if (!map.has(dateKey)) {
        map.set(dateKey, {
          audits: 0,
          requests: 0,
          name: dateKey,
          assignments: 0,
        });
      }
      return map.get(dateKey)!;
    };
    assignments.forEach((item) => {
      const key = formatShortDate(item.createdAt);
      ensure(key).assignments += 1;
    });
    requests.forEach((item) => {
      const key = formatShortDate(item.createdAt);
      ensure(key).requests += 1;
    });
    (auditData?.items ?? []).forEach((item) => {
      const key = formatShortDate(item.createdAt);
      ensure(key).audits += 1;
    });
    return Array.from(map.values()).slice(-7);
  }, [assignments, requests, auditData]);

  const recentActivity = useMemo(() => {
    const logs = auditData?.items ?? [];
    return logs.slice(0, 6);
  }, [auditData]);

  if (isLoading) return <DashboardLoadingCard rows={10} />;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardStatCard
          value={studentsCount}
          icon={L.GraduationCap}
          title={t("dashboard.schoolAdmin.overview.stats.students")}
        />

        <DashboardStatCard
          icon={L.UserCheck}
          value={activeMembersCount}
          title={t("dashboard.schoolAdmin.overview.stats.activeMembers")}
        />

        <DashboardStatCard
          icon={L.UserPlus2}
          value={pendingRequestsCount}
          title={t("dashboard.schoolAdmin.overview.stats.pendingRequests")}
        />

        <DashboardStatCard
          icon={L.ChartColumnBig}
          value={`${summary?.completionRate ?? 0}%`}
          title={t("dashboard.schoolAdmin.overview.stats.completionRate")}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardStatCard
          icon={L.FileText}
          value={summary?.totalAssignments ?? assignments.length}
          title={t("dashboard.schoolAdmin.overview.stats.totalAssignments")}
        />

        <DashboardStatCard
          icon={L.Send}
          value={summary?.publishedAssignments ?? 0}
          title={t("dashboard.schoolAdmin.overview.stats.publishedAssignments")}
        />

        <DashboardStatCard
          icon={L.CheckCircle2}
          value={summary?.evaluatedStudentAssignments ?? 0}
          title={t("dashboard.schoolAdmin.overview.stats.evaluatedAssignments")}
        />

        <DashboardStatCard
          icon={L.ScrollText}
          value={auditData?.total ?? 0}
          title={t("dashboard.schoolAdmin.overview.stats.auditLogs")}
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <DashboardChartCard
          title={t("dashboard.schoolAdmin.overview.charts.memberRoles.title")}
          description={t(
            "dashboard.schoolAdmin.overview.charts.memberRoles.description",
          )}
        >
          <SchoolMemberRoleDonut data={memberRoleData} />
        </DashboardChartCard>

        <DashboardChartCard
          title={t(
            "dashboard.schoolAdmin.overview.charts.assignmentStatus.title",
          )}
          description={t(
            "dashboard.schoolAdmin.overview.charts.assignmentStatus.description",
          )}
        >
          <AssignmentStatusDonut data={assignmentStatusData} />
        </DashboardChartCard>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <DashboardChartCard
          title={t(
            "dashboard.schoolAdmin.overview.charts.assessmentFlow.title",
          )}
          description={t(
            "dashboard.schoolAdmin.overview.charts.assessmentFlow.description",
          )}
        >
          <AssignmentCompletionBars data={completionBars} />
        </DashboardChartCard>

        <DashboardChartCard
          title={t("dashboard.schoolAdmin.overview.charts.activityTrend.title")}
          description={t(
            "dashboard.schoolAdmin.overview.charts.activityTrend.description",
          )}
        >
          <SchoolActivityTrendLine data={trendMap} />
        </DashboardChartCard>
      </div>

      <DashboardChartCard
        title={t("dashboard.schoolAdmin.overview.charts.intelligence.title")}
        description={t(
          "dashboard.schoolAdmin.overview.charts.intelligence.description",
        )}
      >
        <IntelligenceAverageBars data={intelligenceData} />
      </DashboardChartCard>

      <div className="grid gap-4 sm:grid-cols-3">
        <DashboardStatCard
          icon={L.UserRound}
          value={parentsCount}
          title={t("dashboard.schoolAdmin.overview.stats.parents")}
        />

        <DashboardStatCard
          icon={L.BadgeHelp}
          value={counselorsCount}
          title={t("dashboard.schoolAdmin.overview.stats.counselors")}
        />
      </div>

      <DashboardSection
        title={t("dashboard.schoolAdmin.overview.recentActivity.title")}
        description={t(
          "dashboard.schoolAdmin.overview.recentActivity.description",
        )}
      >
        {!recentActivity.length ? (
          <p className="text-sm text-muted-foreground">
            {t("dashboard.schoolAdmin.overview.recentActivity.empty")}
          </p>
        ) : (
          <div className="space-y-3">
            {recentActivity.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between rounded-2xl border border-border/60 bg-card/60 p-4"
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium">{item.action}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.entityType || "-"} / {item.entityId || "-"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t("dashboard.schoolAdmin.overview.recentActivity.actor")}:{" "}
                    {item.actorId || "-"}
                  </p>
                </div>

                <div className="text-right text-xs text-muted-foreground">
                  {new Date(item.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </DashboardSection>

      <div className="grid gap-4 sm:grid-cols-3">
        <DashboardStatCard
          icon={L.Clock3}
          value={summary?.pendingStudentAssignments ?? 0}
          title={t("dashboard.schoolAdmin.overview.stats.pending")}
        />

        <DashboardStatCard
          icon={L.SendHorizontal}
          value={summary?.submittedStudentAssignments ?? 0}
          title={t("dashboard.schoolAdmin.overview.stats.submitted")}
        />

        <DashboardStatCard
          icon={L.ThumbsUp}
          value={approvedRequestsCount}
          title={t("dashboard.schoolAdmin.overview.stats.approvedRequests")}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <DashboardStatCard
          icon={L.ThumbsDown}
          value={rejectedRequestsCount}
          title={t("dashboard.schoolAdmin.overview.stats.rejectedRequests")}
        />

        <DashboardStatCard
          icon={L.Users2}
          value={members.length}
          title={t("dashboard.schoolAdmin.overview.stats.totalMembers")}
        />
      </div>
    </div>
  );
};

export default SchoolAdminOverview;
