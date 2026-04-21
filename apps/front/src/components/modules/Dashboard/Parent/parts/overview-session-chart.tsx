"use client";

import { CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import { ResponsiveContainer, AreaChart, Area } from "recharts";
import { TOverviewSessionChart } from "@/types/modules";
import { useI18n } from "@/hooks/useI18n";

export const ParentOverviewSessionChart = ({ data }: TOverviewSessionChart) => {
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
          <AreaChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="currentColor"
              className="text-border/40"
            />
            <XAxis
              dataKey="label"
              className="text-muted-foreground"
              tick={{ fontSize: 12, fill: "currentColor" }}
            />
            <YAxis
              allowDecimals={false}
              className="text-muted-foreground"
              tick={{ fontSize: 11, fill: "currentColor" }}
            />
            <Tooltip
              contentStyle={{
                fontSize: 12,
                borderRadius: 16,
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              strokeWidth={2.5}
              fillOpacity={0.22}
              fill="hsl(var(--primary))"
              stroke="hsl(var(--primary))"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
