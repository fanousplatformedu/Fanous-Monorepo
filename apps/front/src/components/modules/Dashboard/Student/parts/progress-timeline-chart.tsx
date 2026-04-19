"use client";

import { ResponsiveContainer, AreaChart, Area } from "recharts";
import { CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import { DashboardEmptyState } from "@modules/Dashboard/parts/dashboard-empty-state";
import { DashboardChartCard } from "@modules/Dashboard/parts/dashboard-chart-card";
import { TProgressPoint } from "@/types/modules";
import { useI18n } from "@/hooks/useI18n";

import * as L from "lucide-react";

export const StudentProgressTimelineChart = ({
  data,
}: {
  data: TProgressPoint[];
}) => {
  const { t } = useI18n();

  const hasData = data.length > 0 && data.some((item) => item.overall > 0);

  return (
    <DashboardChartCard
      title={t("dashboard.student.overview.cards.progressTimeline.title")}
      description={t(
        "dashboard.student.overview.cards.progressTimeline.description",
      )}
    >
      {!hasData ? (
        <DashboardEmptyState
          icon={L.Activity}
          title={t(
            "dashboard.student.overview.emptyCharts.progressTimeline.title",
          )}
          description={t(
            "dashboard.student.overview.emptyCharts.progressTimeline.description",
          )}
        />
      ) : (
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="overall"
                stroke="#6366f1"
                fill="#6366f1"
                fillOpacity={0.18}
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </DashboardChartCard>
  );
};
