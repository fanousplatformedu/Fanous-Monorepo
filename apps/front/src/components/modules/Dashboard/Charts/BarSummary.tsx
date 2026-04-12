"use client";

import { CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import { Bar, ResponsiveContainer, BarChart } from "recharts";
import { TBarSummaryChartProps } from "@/types/modules";

export const BarSummaryChart = ({ data }: TBarSummaryChartProps) => {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barCategoryGap={28}>
          <CartesianGrid
            vertical={false}
            strokeDasharray="3 3"
            opacity={0.12}
          />
          <XAxis dataKey="name" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} />
          <Tooltip />
          <Bar
            dataKey="value"
            radius={[12, 12, 4, 4]}
            fill="rgba(59,130,246,0.88)"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
