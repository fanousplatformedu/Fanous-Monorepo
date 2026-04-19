"use client";

import { ResponsiveContainer, BarChart, CartesianGrid } from "recharts";
import { XAxis, YAxis, Tooltip, Bar } from "recharts";
import { DashboardEmptyState } from "@modules/Dashboard/parts/dashboard-empty-state";
import { DashboardChartCard } from "@modules/Dashboard/parts/dashboard-chart-card";
import { TSimpleChartItem } from "@/types/modules";
import { useI18n } from "@/hooks/useI18n";

import * as L from "lucide-react";

export const StudentActionCenterChart = ({
  data,
}: {
  data: TSimpleChartItem[];
}) => {
  const { t } = useI18n();

  const hasData = data.some((item) => item.value > 0);

  return (
    <DashboardChartCard
      title={t("dashboard.student.overview.cards.actionCenter.title")}
      description={t(
        "dashboard.student.overview.cards.actionCenter.description",
      )}
    >
      {!hasData ? (
        <DashboardEmptyState
          icon={L.BarChart3}
          title={t("dashboard.student.overview.emptyCharts.actionCenter.title")}
          description={t(
            "dashboard.student.overview.emptyCharts.actionCenter.description",
          )}
        />
      ) : (
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" width={140} />
              <Tooltip />
              <Bar dataKey="value" fill="#06b6d4" radius={[10, 10, 10, 10]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </DashboardChartCard>
  );
};
