"use client";

import { CartesianGrid, XAxis, YAxis, Tooltip, Bar } from "recharts";
import { ResponsiveContainer, BarChart } from "recharts";
import { TParentDistributionChart } from "@/types/modules";
import { useI18n } from "@/hooks/useI18n";

export const ParentResultsDistributionChart = ({
  data,
}: TParentDistributionChart) => {
  const { t } = useI18n();

  if (!data.length)
    return (
      <div className="rounded-2xl border border-dashed border-border/60 bg-secondary/10 p-8 text-center">
        <p className="text-sm text-muted-foreground">
          {t("dashboard.parent.results.chartCard.empty")}
        </p>
      </div>
    );

  return (
    <div className="rounded-2xl border border-border/60 bg-card/60 p-4">
      <div className="h-[320px] sm:h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barCategoryGap={24}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="currentColor"
              className="text-border/40"
            />
            <XAxis
              height={72}
              angle={-12}
              interval={0}
              dataKey="label"
              textAnchor="end"
              className="text-muted-foreground"
              tick={{ fontSize: 11, fill: "currentColor" }}
            />
            <YAxis
              allowDecimals={false}
              className="text-muted-foreground"
              tick={{ fontSize: 11, fill: "currentColor" }}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 16,
                border: "1px solid hsl(var(--border))",
                background: "hsl(var(--card))",
                fontSize: 12,
              }}
            />
            <Bar
              dataKey="value"
              fill="hsl(var(--primary))"
              radius={[10, 10, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
