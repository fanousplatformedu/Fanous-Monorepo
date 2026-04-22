"use client";

import { getBoolean, getDateValue, getString } from "@/utils/function-helper";
import { useCounselorDashboardSummaryQuery } from "@/lib/redux/api/endpoints/counselor.api";
import { getNullableString, getRecordValue } from "@/utils/function-helper";
import { useMyCounselorNotificationsQuery } from "@/lib/redux/api/endpoints/counselor.api";
import { useStudentAssessmentQueueQuery } from "@/lib/redux/api/endpoints/counselor.api";
import { CounselorOverviewSummaryCards } from "@modules/Dashboard/Counselor/parts/overview-summary-cards";
import { CounselorOverviewStatusChart } from "@modules/Dashboard/Counselor/parts/overview-status-chart";
import { useMyCounselorSessionsQuery } from "@/lib/redux/api/endpoints/counselor.api";
import { CounselorOverviewLatestList } from "@modules/Dashboard/Counselor/parts/overview-latest-list";
import { getStatusDistribution } from "@/utils/function-helper";
import { DashboardLoadingCard } from "@modules/Dashboard/parts/dashboard-loading-card";
import { DashboardEmptyState } from "@modules/Dashboard/parts/dashboard-empty-state";
import { useMyStudentsQuery } from "@/lib/redux/api/endpoints/counselor.api";
import { DashboardSection } from "@modules/Dashboard/parts/dashboard-section";
import { TLatestListItem } from "@/types/modules";
import { useI18n } from "@/hooks/useI18n";
import { useMemo } from "react";

import * as L from "lucide-react";

const CounselorOverviewPage = () => {
  const { t } = useI18n();

  // ================ API Hooks ==================
  const {
    data: summaryData,
    isLoading: isSummaryLoading,
    isFetching: isSummaryFetching,
  } = useCounselorDashboardSummaryQuery();

  const {
    data: studentsData,
    isLoading: isStudentsLoading,
    isFetching: isStudentsFetching,
  } = useMyStudentsQuery({
    page: 1,
    limit: 100,
  });

  const {
    data: reviewsData,
    isLoading: isReviewsLoading,
    isFetching: isReviewsFetching,
  } = useStudentAssessmentQueueQuery({
    page: 1,
    limit: 100,
  });

  const {
    data: sessionsData,
    isLoading: isSessionsLoading,
    isFetching: isSessionsFetching,
  } = useMyCounselorSessionsQuery({
    page: 1,
    limit: 100,
  });

  const {
    data: notificationsData,
    isLoading: isNotificationsLoading,
    isFetching: isNotificationsFetching,
  } = useMyCounselorNotificationsQuery({
    page: 1,
    limit: 100,
    unreadOnly: false,
  });

  const isLoading =
    isSummaryLoading ||
    isStudentsLoading ||
    isReviewsLoading ||
    isSessionsLoading ||
    isNotificationsLoading;

  // ================ Use Memo ===================
  const students = useMemo(() => studentsData?.items ?? [], [studentsData]);
  const reviews = useMemo(() => reviewsData?.items ?? [], [reviewsData]);
  const sessions = useMemo(() => sessionsData?.items ?? [], [sessionsData]);
  const notifications = useMemo(
    () => notificationsData?.items ?? [],
    [notificationsData],
  );
  const totalStudents = summaryData?.totalStudents ?? studentsData?.total ?? 0;
  const pendingReviews = summaryData?.pendingReviews ?? reviewsData?.total ?? 0;
  const totalSessions = sessionsData?.total ?? 0;
  const unreadNotifications =
    summaryData?.unreadNotifications ??
    notifications.filter((item) => !getBoolean(getRecordValue(item, "isRead")))
      .length;
  const studentStatusData = useMemo(
    () =>
      getStatusDistribution(
        students as unknown[],
        "linkStatus",
        "dashboard.counselor.students.status",
        t,
      ),
    [students, t],
  );
  const reviewStatusData = useMemo(
    () =>
      getStatusDistribution(
        reviews as unknown[],
        "status",
        "dashboard.counselor.reviews.status",
        t,
      ),
    [reviews, t],
  );
  const sessionStatusData = useMemo(
    () =>
      getStatusDistribution(
        sessions as unknown[],
        "status",
        "dashboard.counselor.sessions.status",
        t,
      ),
    [sessions, t],
  );
  const latestStudents = useMemo<TLatestListItem[]>(() => {
    return [...students]
      .sort(
        (a, b) =>
          getDateValue(b, ["assignedAt", "createdAt", "updatedAt"]) -
          getDateValue(a, ["assignedAt", "createdAt", "updatedAt"]),
      )
      .slice(0, 5)
      .map((item) => ({
        id: getString(getRecordValue(item, "id")) || crypto.randomUUID(),
        title:
          getString(getRecordValue(item, "fullName")) ||
          getString(getRecordValue(item, "email")) ||
          getString(getRecordValue(item, "mobile")) ||
          t("dashboard.counselor.overview.common.unknownStudent"),
        subtitle:
          getString(getRecordValue(item, "email")) ||
          getString(getRecordValue(item, "mobile")) ||
          t("dashboard.counselor.overview.common.notAvailable"),
        meta: getNullableString(getRecordValue(item, "assignedAt"))
          ? new Date(
              getNullableString(getRecordValue(item, "assignedAt"))!,
            ).toLocaleDateString()
          : undefined,
        badge: getString(getRecordValue(item, "linkStatus")) ?? undefined,
      }));
  }, [students, t]);

  const latestReviews = useMemo<TLatestListItem[]>(() => {
    return [...reviews]
      .sort(
        (a, b) =>
          getDateValue(b, ["createdAt", "submittedAt", "updatedAt"]) -
          getDateValue(a, ["createdAt", "submittedAt", "updatedAt"]),
      )
      .slice(0, 5)
      .map((item) => ({
        id:
          getString(getRecordValue(item, "reviewId")) ||
          getString(getRecordValue(item, "id")) ||
          crypto.randomUUID(),
        title:
          getString(getRecordValue(item, "studentName")) ||
          getString(getRecordValue(item, "assignmentTitle")) ||
          t("dashboard.counselor.overview.common.reviewItem"),
        subtitle:
          getString(getRecordValue(item, "assignmentTitle")) ||
          t("dashboard.counselor.overview.common.notAvailable"),
        meta: getNullableString(getRecordValue(item, "createdAt"))
          ? new Date(
              getNullableString(getRecordValue(item, "createdAt"))!,
            ).toLocaleDateString()
          : undefined,
        badge: getString(getRecordValue(item, "status")) ?? undefined,
      }));
  }, [reviews, t]);
  const latestSessions = useMemo<TLatestListItem[]>(() => {
    return [...sessions]
      .sort(
        (a, b) =>
          getDateValue(b, ["scheduledAt", "createdAt", "updatedAt"]) -
          getDateValue(a, ["scheduledAt", "createdAt", "updatedAt"]),
      )
      .slice(0, 5)
      .map((item) => ({
        id: getString(getRecordValue(item, "id")) || crypto.randomUUID(),
        title:
          getString(getRecordValue(item, "title")) ||
          t("dashboard.counselor.overview.common.sessionItem"),
        subtitle:
          getString(getRecordValue(item, "studentName")) ||
          t("dashboard.counselor.overview.common.notAvailable"),
        meta: getNullableString(getRecordValue(item, "scheduledAt"))
          ? new Date(
              getNullableString(getRecordValue(item, "scheduledAt"))!,
            ).toLocaleString()
          : getNullableString(getRecordValue(item, "createdAt"))
            ? new Date(
                getNullableString(getRecordValue(item, "createdAt"))!,
              ).toLocaleDateString()
            : undefined,
        badge: getString(getRecordValue(item, "status")) ?? undefined,
      }));
  }, [sessions, t]);
  const latestNotifications = useMemo<TLatestListItem[]>(() => {
    return [...notifications]
      .sort(
        (a, b) =>
          getDateValue(b, ["createdAt", "readAt"]) -
          getDateValue(a, ["createdAt", "readAt"]),
      )
      .slice(0, 5)
      .map((item) => ({
        id: getString(getRecordValue(item, "id")) || crypto.randomUUID(),
        title:
          getString(getRecordValue(item, "title")) ||
          t("dashboard.counselor.overview.common.notificationItem"),
        subtitle:
          getString(getRecordValue(item, "body")) ||
          t("dashboard.counselor.overview.common.notAvailable"),
        meta: getNullableString(getRecordValue(item, "createdAt"))
          ? new Date(
              getNullableString(getRecordValue(item, "createdAt"))!,
            ).toLocaleDateString()
          : undefined,
        badge: getBoolean(getRecordValue(item, "isRead"))
          ? t("dashboard.counselor.notifications.status.read")
          : t("dashboard.counselor.notifications.status.unread"),
      }));
  }, [notifications, t]);

  if (isLoading) return <DashboardLoadingCard rows={10} />;

  const hasAnyData =
    totalStudents > 0 ||
    pendingReviews > 0 ||
    totalSessions > 0 ||
    notifications.length > 0;

  if (!hasAnyData)
    return (
      <DashboardEmptyState
        icon={L.LayoutDashboard}
        title={t("dashboard.counselor.overview.empty.title")}
        description={t("dashboard.counselor.overview.empty.description")}
      />
    );

  return (
    <div className="space-y-6">
      <CounselorOverviewSummaryCards
        totalStudents={totalStudents}
        totalSessions={totalSessions}
        pendingReviews={pendingReviews}
        unreadNotifications={unreadNotifications}
        isFetching={
          isSummaryFetching ||
          isStudentsFetching ||
          isReviewsFetching ||
          isSessionsFetching ||
          isNotificationsFetching
        }
      />

      <div className="grid gap-6 xl:grid-cols-3">
        <DashboardSection
          title={t("dashboard.counselor.overview.charts.students.title")}
          description={t(
            "dashboard.counselor.overview.charts.students.description",
          )}
        >
          <CounselorOverviewStatusChart
            data={studentStatusData}
            emptyText={t("dashboard.counselor.overview.common.noChartData")}
          />
        </DashboardSection>

        <DashboardSection
          title={t("dashboard.counselor.overview.charts.reviews.title")}
          description={t(
            "dashboard.counselor.overview.charts.reviews.description",
          )}
        >
          <CounselorOverviewStatusChart
            data={reviewStatusData}
            emptyText={t("dashboard.counselor.overview.common.noChartData")}
          />
        </DashboardSection>

        <DashboardSection
          title={t("dashboard.counselor.overview.charts.sessions.title")}
          description={t(
            "dashboard.counselor.overview.charts.sessions.description",
          )}
        >
          <CounselorOverviewStatusChart
            data={sessionStatusData}
            emptyText={t("dashboard.counselor.overview.common.noChartData")}
          />
        </DashboardSection>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <DashboardSection
          title={t("dashboard.counselor.overview.latest.students.title")}
          description={t(
            "dashboard.counselor.overview.latest.students.description",
          )}
        >
          <CounselorOverviewLatestList
            items={latestStudents}
            emptyText={t("dashboard.counselor.overview.common.noItems")}
          />
        </DashboardSection>

        <DashboardSection
          title={t("dashboard.counselor.overview.latest.reviews.title")}
          description={t(
            "dashboard.counselor.overview.latest.reviews.description",
          )}
        >
          <CounselorOverviewLatestList
            items={latestReviews}
            emptyText={t("dashboard.counselor.overview.common.noItems")}
          />
        </DashboardSection>

        <DashboardSection
          title={t("dashboard.counselor.overview.latest.sessions.title")}
          description={t(
            "dashboard.counselor.overview.latest.sessions.description",
          )}
        >
          <CounselorOverviewLatestList
            items={latestSessions}
            emptyText={t("dashboard.counselor.overview.common.noItems")}
          />
        </DashboardSection>

        <DashboardSection
          title={t("dashboard.counselor.overview.latest.notifications.title")}
          description={t(
            "dashboard.counselor.overview.latest.notifications.description",
          )}
        >
          <CounselorOverviewLatestList
            items={latestNotifications}
            emptyText={t("dashboard.counselor.overview.common.noItems")}
          />
        </DashboardSection>
      </div>
    </div>
  );
};

export default CounselorOverviewPage;
