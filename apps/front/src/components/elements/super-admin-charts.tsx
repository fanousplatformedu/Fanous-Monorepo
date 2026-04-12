"use client";

import { TChartItem } from "@/types/elements";
import { useI18n } from "@/hooks/useI18n";

import * as R from "recharts";

const COLORS = [
  "rgba(59,130,246,0.92)",
  "rgba(147,197,253,0.95)",
  "rgba(96,165,250,0.78)",
];

export const SuperAdminStatusPieChart = ({ data }: { data: TChartItem[] }) => {
  const { t } = useI18n();

  const safeData = (data ?? []).filter((item) => Number(item.value) > 0);

  if (!safeData.length)
    return (
      <div className="flex h-72 items-center justify-center rounded-2xl border border-dashed border-border/60 bg-secondary/10 text-sm text-muted-foreground">
        {t("dashboard.superAdmin.charts.empty")}
      </div>
    );

  return (
    <div className="h-72 w-full">
      <R.ResponsiveContainer width="100%" height="100%">
        <R.PieChart>
          <R.Tooltip />
          <R.Legend />
          <R.Pie
            data={safeData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={90}
            paddingAngle={3}
          >
            {safeData.map((entry, index) => (
              <R.Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
            ))}
          </R.Pie>
        </R.PieChart>
      </R.ResponsiveContainer>
    </div>
  );
};

export const SuperAdminRequestBarChart = ({ data }: { data: TChartItem[] }) => {
  return (
    <div className="h-72">
      <R.ResponsiveContainer width="100%" height="100%">
        <R.BarChart data={data}>
          <R.CartesianGrid strokeDasharray="4 4" opacity={0.2} />
          <R.XAxis dataKey="name" />
          <R.YAxis />
          <R.Tooltip />
          <R.Bar
            dataKey="value"
            radius={[12, 12, 0, 0]}
            fill="rgba(59,130,246,0.88)"
          />
        </R.BarChart>
      </R.ResponsiveContainer>
    </div>
  );
};
