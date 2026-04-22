"use client";

import { Bar, XAxis, YAxis, Tooltip, BarChart } from "recharts";
import { CartesianGrid, ResponsiveContainer } from "recharts";
import { TOverviewStatus } from "@/types/modules";
import { useI18n } from "@/hooks/useI18n";

export const CounselorOverviewStatusChart = ({
  data,
  emptyText,
}: TOverviewStatus) => {
  const { t } = useI18n();

  if (!data.length)
    return <p className="text-sm text-muted-foreground">{emptyText}</p>;

  return (
    <div className="space-y-4">
      <div className="h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barCategoryGap={24}>
            <defs>
              <linearGradient id="blueBarGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#60A5FA" />
                <stop offset="50%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#1D4ED8" />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" className="text-border/60" />

            <XAxis
              dataKey="label"
              className="text-muted-foreground"
              tick={{ fontSize: 11, fill: "currentColor" }}
            />

            <YAxis
              allowDecimals={false}
              className="text-muted-foreground"
              tick={{ fontSize: 11, fill: "currentColor" }}
            />

            <Tooltip
              formatter={(value) => [value, t("common.count")]}
              contentStyle={{
                fontSize: 12,
                borderRadius: 16,
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
              }}
            />

            <Bar
              dataKey="value"
              radius={[12, 12, 0, 0]}
              fill="url(#blueBarGradient)"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {data.map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between rounded-2xl border border-border/50 bg-secondary/15 px-4 py-3"
          >
            <span className="text-sm text-muted-foreground">{item.label}</span>
            <span className="text-sm font-semibold text-foreground">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
