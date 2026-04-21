"use client";

import { ResponsiveContainer, PieChart } from "recharts";
import { Pie, Cell, Tooltip, Legend } from "recharts";
import { TOverviewActivitiesChart } from "@/types/modules";
import { useI18n } from "@/hooks/useI18n";

const COLORS = [
  "hsl(var(--primary))",
  "#60a5fa",
  "#34d399",
  "#f59e0b",
  "#a78bfa",
  "#f472b6",
  "#22c55e",
  "#f97316",
  "#06b6d4",
  "#eab308",
];

export const ParentOverviewActivityChart = ({
  data,
}: TOverviewActivitiesChart) => {
  const { t } = useI18n();

  if (!data.length)
    return (
      <div className="rounded-2xl border border-dashed border-border/60 bg-secondary/10 p-8 text-center">
        <p className="text-sm text-muted-foreground">
          {t("dashboard.parent.overview.common.emptyChart")}
        </p>
      </div>
    );

  return (
    <div className="rounded-2xl border border-border/60 bg-card/60 p-4">
      <div className="h-[320px] sm:h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="label"
              innerRadius={52}
              paddingAngle={3}
              outerRadius={110}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`${entry.key}-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip
              contentStyle={{
                fontSize: 12,
                borderRadius: 16,
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
