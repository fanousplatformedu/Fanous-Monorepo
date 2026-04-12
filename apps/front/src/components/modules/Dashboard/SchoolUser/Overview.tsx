"use client";

import { useSchoolUserMeQuery } from "@/lib/redux/api";
import { DashboardChartCard } from "@elements/dashboard-chart-card";
import { DashboardStatCard } from "@elements/dashboard-stat-card";
import { DonutSummaryChart } from "@modules/Dashboard/Charts/DonutSummary";

import * as L from "lucide-react";

const SchoolUserOverview = () => {
  const { data: me } = useSchoolUserMeQuery();

  const completionParts = [
    Boolean(me?.fullName),
    Boolean(me?.email),
    Boolean(me?.mobile),
  ];

  const completed = completionParts.filter(Boolean).length;
  const total = completionParts.length;

  const chartData = [
    { name: "Completed", value: completed },
    { name: "Missing", value: total - completed },
  ];

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardStatCard
          title="My Role"
          value={me?.role ?? "-"}
          icon={L.BadgeCheck}
        />
        <DashboardStatCard
          title="Account Status"
          value={me?.status ?? "-"}
          icon={L.ShieldCheck}
        />
        <DashboardStatCard
          title="School ID"
          value={me?.schoolId ?? "-"}
          icon={L.School}
        />
        <DashboardStatCard
          title="Profile Completion"
          value={`${Math.round((completed / total) * 100)}%`}
          icon={L.UserRound}
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <DashboardChartCard
          title="Profile Completion"
          description="Based on your current profile information"
        >
          <DonutSummaryChart data={chartData} />
        </DashboardChartCard>

        <DashboardChartCard
          title="Account Summary"
          description="Quick snapshot of your current profile"
        >
          <div className="space-y-3 rounded-2xl bg-secondary/25 p-4">
            <div className="flex items-center justify-between rounded-xl bg-card/60 px-4 py-3">
              <span className="text-sm text-muted-foreground">Full Name</span>
              <span className="text-sm font-medium text-foreground">
                {me?.fullName || "Not set"}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-card/60 px-4 py-3">
              <span className="text-sm text-muted-foreground">Email</span>
              <span className="text-sm font-medium text-foreground">
                {me?.email || "Not set"}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-card/60 px-4 py-3">
              <span className="text-sm text-muted-foreground">Mobile</span>
              <span className="text-sm font-medium text-foreground">
                {me?.mobile || "Not set"}
              </span>
            </div>
          </div>
        </DashboardChartCard>
      </div>
    </div>
  );
};

export default SchoolUserOverview;
