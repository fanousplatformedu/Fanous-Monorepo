"use client";

import { Line, XAxis, YAxis, Tooltip, LineChart } from "recharts";
import { CartesianGrid, ResponsiveContainer } from "recharts";
import { TStudentProgressChart } from "@/types/modules";
import { useI18n } from "@/hooks/useI18n";

export const CounselorStudentProgressChart = ({
  data,
}: {
  data: TStudentProgressChart[];
}) => {
  const { t } = useI18n();

  if (!data.length)
    return (
      <p className="text-sm text-muted-foreground">
        {t("dashboard.counselor.student.detailDialog.noTimeline")}
      </p>
    );

  return (
    <div className="space-y-4">
      <div className="h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="text-border/60" />
            <XAxis
              dataKey="label"
              className="text-muted-foreground"
              tick={{ fontSize: 11, fill: "currentColor" }}
            />
            <YAxis
              className="text-muted-foreground"
              tick={{ fontSize: 11, fill: "currentColor" }}
            />
            <Tooltip
              formatter={(value) => [`${value}%`, t("common.score")]}
              contentStyle={{
                fontSize: 12,
                borderRadius: 16,
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
              }}
            />
            <Line
              dot={{ r: 4 }}
              type="monotone"
              strokeWidth={3}
              dataKey="overall"
              stroke="hsl(var(--primary))"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {data.map((item, index) => (
          <div
            key={`${item.label}-${index}`}
            className="flex items-center justify-between rounded-2xl border border-border/50 bg-secondary/15 px-4 py-3"
          >
            <span className="text-sm text-muted-foreground">{item.label}</span>
            <span className="text-sm font-semibold text-foreground">
              {item.overall}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
