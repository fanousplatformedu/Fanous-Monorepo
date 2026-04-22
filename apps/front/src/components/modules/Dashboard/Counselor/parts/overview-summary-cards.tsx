"use client";

import { TOverviewSummaryDashboardCards } from "@/types/modules";
import { DashboardSection } from "@modules/Dashboard/parts/dashboard-section";
import { useI18n } from "@/hooks/useI18n";

import * as L from "lucide-react";

export const CounselorOverviewSummaryCards = ({
  isFetching,
  totalStudents,
  totalSessions,
  pendingReviews,
  unreadNotifications,
}: TOverviewSummaryDashboardCards) => {
  const { t } = useI18n();

  const items = [
    {
      key: "students",
      value: totalStudents,
      icon: L.UsersRound,
      title: t("dashboard.counselor.overview.kpis.students.title"),
      description: t("dashboard.counselor.overview.kpis.students.description"),
    },
    {
      key: "reviews",
      value: pendingReviews,
      icon: L.ClipboardList,
      title: t("dashboard.counselor.overview.kpis.reviews.title"),
      description: t("dashboard.counselor.overview.kpis.reviews.description"),
    },
    {
      key: "sessions",
      value: totalSessions,
      icon: L.MessagesSquare,
      title: t("dashboard.counselor.overview.kpis.sessions.title"),
      description: t("dashboard.counselor.overview.kpis.sessions.description"),
    },
    {
      key: "notifications",
      value: unreadNotifications,
      icon: L.Bell,
      title: t("dashboard.counselor.overview.kpis.notifications.title"),
      description: t(
        "dashboard.counselor.overview.kpis.notifications.description",
      ),
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <DashboardSection
            key={item.key}
            title={item.title}
            description={item.description}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-3xl font-bold text-foreground">
                  {item.value}
                </p>
                {isFetching ? (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {t("common.refreshing")}
                  </p>
                ) : null}
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/30">
                <Icon className="h-5 w-5 text-primary" />
              </div>
            </div>
          </DashboardSection>
        );
      })}
    </div>
  );
};
