"use client";

import { PolarAngleAxis, PolarGrid, Radar, Tooltip } from "recharts";
import { RadarChart, ResponsiveContainer } from "recharts";
import { TChartRow } from "@/types/modules";
import { useI18n } from "@/hooks/useI18n";

export const StudentResultRadarChart = ({ data }: { data: TChartRow[] }) => {
  const { t } = useI18n();

  return (
    <div className="rounded-2xl border border-border/60 bg-card/60 p-4">
      <div className="mb-4 flex items-center gap-2">
        <h4 className="text-sm font-semibold text-foreground">
          {t("dashboard.student.results.detail.radarChart")}
        </h4>
      </div>

      <div className="h-[360px] sm:h-[420px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} outerRadius="72%" cx="50%" cy="50%">
            <PolarGrid stroke="currentColor" className="text-border/60" />
            <PolarAngleAxis
              dataKey="shortLabel"
              tick={{
                fontSize: 11,
                fill: "currentColor",
              }}
              className="text-foreground"
            />
            <Tooltip
              contentStyle={{
                fontSize: 12,
                borderRadius: 16,
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
              }}
            />
            <Radar
              dataKey="value"
              strokeWidth={2.5}
              fillOpacity={0.24}
              fill="hsl(var(--primary))"
              stroke="hsl(var(--primary))"
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-3 text-xs leading-6 text-muted-foreground">
        {t("dashboard.student.results.detail.chartHint")}
      </p>
    </div>
  );
};
