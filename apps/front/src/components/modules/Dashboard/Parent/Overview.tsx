"use client";

import { useParentCounselingSessionsQuery } from "@/lib/redux/api/endpoints/parent.api";
import { ParentOverviewLatestActivities } from "@modules/Dashboard/Parent/parts/overview-latest-activities";
import { useParentChildActivitiesQuery } from "@/lib/redux/api/endpoints/parent.api";
import { ParentOverviewLatestSessions } from "@modules/Dashboard/Parent/parts/overview-latest-session";
import { ParentOverviewDominantChart } from "@modules/Dashboard/Parent/parts/overview-dominant-chart";
import { ParentOverviewActivityChart } from "@modules/Dashboard/Parent/parts/overview-activity-chart";
import { ParentOverviewLatestResults } from "@modules/Dashboard/Parent/parts/overview-latest-results";
import { ParentOverviewSummaryCards } from "@modules/Dashboard/Parent/parts/overview-summary-cards";
import { useParentChildResultsQuery } from "@/lib/redux/api/endpoints/parent.api";
import { ParentOverviewSessionChart } from "@modules/Dashboard/Parent/parts/overview-session-chart";
import { DashboardLoadingCard } from "@modules/Dashboard/parts/dashboard-loading-card";
import { useMyChildrenQuery } from "@/lib/redux/api/endpoints/parent.api";
import { DashboardSection } from "@modules/Dashboard/parts/dashboard-section";
import { useI18n } from "@/hooks/useI18n";
import { useMemo } from "react";

const ParentOverviewPage = () => {
  const { t } = useI18n();

  // ============== Api Hooks ===============
  const { data: childrenData, isLoading: isChildrenLoading } =
    useMyChildrenQuery({
      take: 100,
      skip: 0,
    });
  const { data: resultsData, isLoading: isResultsLoading } =
    useParentChildResultsQuery({
      take: 100,
      skip: 0,
    });
  const { data: activitiesData, isLoading: isActivitiesLoading } =
    useParentChildActivitiesQuery({
      take: 100,
      skip: 0,
    });
  const { data: sessionsData, isLoading: isSessionsLoading } =
    useParentCounselingSessionsQuery({
      take: 100,
      skip: 0,
    });

  const isLoading =
    isChildrenLoading ||
    isResultsLoading ||
    isActivitiesLoading ||
    isSessionsLoading;

  // =============== Use Memo ================
  const results = useMemo(() => resultsData?.items ?? [], [resultsData]);
  const activities = useMemo(
    () => activitiesData?.items ?? [],
    [activitiesData],
  );
  const sessions = useMemo(() => sessionsData?.items ?? [], [sessionsData]);
  const dominantDistribution = useMemo(() => {
    const map = new Map<string, number>();
    for (const item of results) {
      const key = item.dominantIntelligence || "UNKNOWN";
      map.set(key, (map.get(key) ?? 0) + 1);
    }
    return Array.from(map.entries()).map(([key, value]) => ({
      key,
      value,
      label:
        key === "UNKNOWN"
          ? t("dashboard.parent.overview.common.notAvailable")
          : t(`dashboard.parent.results.intelligences.${key}`),
    }));
  }, [results, t]);

  const activityDistribution = useMemo(() => {
    const map = new Map<string, number>();
    for (const item of activities) {
      map.set(item.type, (map.get(item.type) ?? 0) + 1);
    }
    return Array.from(map.entries()).map(([key, value]) => ({
      key,
      value,
      label: t(`dashboard.parent.activities.types.${key}`),
    }));
  }, [activities, t]);
  const sessionDistribution = useMemo(() => {
    const map = new Map<string, number>();
    for (const item of sessions) {
      map.set(item.status, (map.get(item.status) ?? 0) + 1);
    }
    return Array.from(map.entries()).map(([key, value]) => ({
      key,
      value,
      label: t(`dashboard.parent.counseling.table.status.${key}`),
    }));
  }, [sessions, t]);
  const latestResults = useMemo(
    () =>
      [...results]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        .slice(0, 5),
    [results],
  );
  const latestActivities = useMemo(
    () =>
      [...activities]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        .slice(0, 6),
    [activities],
  );

  const latestSessions = useMemo(
    () =>
      [...sessions]
        .sort((a, b) => {
          const aTime = a.scheduledAt
            ? new Date(a.scheduledAt).getTime()
            : new Date(a.createdAt).getTime();
          const bTime = b.scheduledAt
            ? new Date(b.scheduledAt).getTime()
            : new Date(b.createdAt).getTime();
          return bTime - aTime;
        })
        .slice(0, 5),
    [sessions],
  );

  // ================ Guards ==================
  if (isLoading) return <DashboardLoadingCard rows={10} />;

  return (
    <div className="space-y-6">
      <ParentOverviewSummaryCards
        totalResults={resultsData?.total ?? 0}
        totalChildren={childrenData?.total ?? 0}
        totalSessions={sessionsData?.total ?? 0}
        totalActivities={activitiesData?.total ?? 0}
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <DashboardSection
          title={t("dashboard.parent.overview.charts.dominant.title")}
          description={t(
            "dashboard.parent.overview.charts.dominant.description",
          )}
        >
          <ParentOverviewDominantChart data={dominantDistribution} />
        </DashboardSection>

        <DashboardSection
          title={t("dashboard.parent.overview.charts.activities.title")}
          description={t(
            "dashboard.parent.overview.charts.activities.description",
          )}
        >
          <ParentOverviewActivityChart data={activityDistribution} />
        </DashboardSection>
      </div>

      <DashboardSection
        title={t("dashboard.parent.overview.charts.sessions.title")}
        description={t("dashboard.parent.overview.charts.sessions.description")}
      >
        <ParentOverviewSessionChart data={sessionDistribution} />
      </DashboardSection>

      <div className="grid gap-6 xl:grid-cols-3">
        <DashboardSection
          title={t("dashboard.parent.overview.latestResults.title")}
          description={t("dashboard.parent.overview.latestResults.description")}
        >
          <ParentOverviewLatestResults items={latestResults} />
        </DashboardSection>

        <DashboardSection
          title={t("dashboard.parent.overview.latestActivities.title")}
          description={t(
            "dashboard.parent.overview.latestActivities.description",
          )}
        >
          <ParentOverviewLatestActivities items={latestActivities} />
        </DashboardSection>

        <DashboardSection
          title={t("dashboard.parent.overview.latestSessions.title")}
          description={t(
            "dashboard.parent.overview.latestSessions.description",
          )}
        >
          <ParentOverviewLatestSessions items={latestSessions} />
        </DashboardSection>
      </div>
    </div>
  );
};

export default ParentOverviewPage;
