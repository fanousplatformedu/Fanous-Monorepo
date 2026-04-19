"use client";

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { DashboardEmptyState } from "@modules/Dashboard/parts/dashboard-empty-state";
import { DashboardChartCard } from "@modules/Dashboard/parts/dashboard-chart-card";
import { TSimpleChartItem } from "@/types/modules";
import { useI18n } from "@/hooks/useI18n";

import * as L from "lucide-react";

const COLORS = ["#6366f1", "#06b6d4", "#f59e0b", "#22c55e"];

export const StudentAssignmentFlowChart = ({
  data,
}: {
  data: TSimpleChartItem[];
}) => {
  const { t } = useI18n();

  const hasData = data.some((item) => item.value > 0);

  return (
    <DashboardChartCard
      title={t("dashboard.student.overview.cards.assignmentFlow.title")}
      description={t(
        "dashboard.student.overview.cards.assignmentFlow.description",
      )}
    >
      {!hasData ? (
        <DashboardEmptyState
          icon={L.PieChart}
          title={t(
            "dashboard.student.overview.emptyCharts.assignmentFlow.title",
          )}
          description={t(
            "dashboard.student.overview.emptyCharts.assignmentFlow.description",
          )}
        />
      ) : (
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={72}
                outerRadius={108}
                paddingAngle={3}
              >
                {data.map((item, index) => (
                  <Cell key={item.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </DashboardChartCard>
  );
};
