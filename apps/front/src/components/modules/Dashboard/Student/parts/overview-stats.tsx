"use client";

import { DashboardStatCard } from "@modules/Dashboard/parts/dashboard-stat-card";
import { TOverviewStats } from "@/types/modules";
import { useI18n } from "@/hooks/useI18n";

import * as L from "lucide-react";

export const StudentOverviewStats = ({
  roleLabel,
  statusLabel,
  totalAssignments,
  pendingAssignments,
  unreadNotifications,
  evaluatedAssignments,
  inProgressAssignments,
}: TOverviewStats) => {
  const { t } = useI18n();

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardStatCard
          value={roleLabel}
          icon={L.BadgeCheck}
          title={t("dashboard.student.overview.stats.role")}
        />
        <DashboardStatCard
          value={statusLabel}
          icon={L.ShieldCheck}
          title={t("dashboard.student.overview.stats.accountStatus")}
        />
        <DashboardStatCard
          icon={L.NotebookPen}
          value={totalAssignments}
          title={t("dashboard.student.overview.stats.totalAssignments")}
        />
        <DashboardStatCard
          icon={L.Bell}
          value={unreadNotifications}
          title={t("dashboard.student.overview.stats.unreadNotifications")}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <DashboardStatCard
          icon={L.Clock3}
          value={pendingAssignments}
          title={t("dashboard.student.overview.stats.pendingAssignments")}
        />
        <DashboardStatCard
          icon={L.PlayCircle}
          value={inProgressAssignments}
          title={t("dashboard.student.overview.stats.inProgressAssignments")}
        />
        <DashboardStatCard
          icon={L.CheckCircle2}
          value={evaluatedAssignments}
          title={t("dashboard.student.overview.stats.evaluatedAssignments")}
        />
      </div>
    </>
  );
};
