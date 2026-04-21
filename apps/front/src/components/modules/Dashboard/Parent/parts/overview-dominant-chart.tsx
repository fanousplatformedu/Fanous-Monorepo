"use client";

import { CartesianGrid, XAxis, YAxis, Tooltip, Bar } from "recharts";
import { ResponsiveContainer, BarChart } from "recharts";
import { TOverviewActivitiesChart } from "@/types/modules";
import { useI18n } from "@/hooks/useI18n";

export const ParentOverviewDominantChart = ({
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
          <BarChart data={data} barCategoryGap={20}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="currentColor"
              className="text-border/40"
            />
            <XAxis
              angle={-12}
              height={72}
              interval={0}
              dataKey="label"
              textAnchor="end"
              className="text-muted-foreground"
              tick={{ fontSize: 11, fill: "currentColor" }}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 11, fill: "currentColor" }}
              className="text-muted-foreground"
            />
            <Tooltip
              contentStyle={{
                fontSize: 12,
                borderRadius: 16,
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
              }}
            />
            <Bar
              dataKey="value"
              radius={[10, 10, 0, 0]}
              fill="hsl(var(--primary))"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
