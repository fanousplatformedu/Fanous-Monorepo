"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { TDonutSummaryChartProps } from "@/types/modules";

const COLORS = [
  "rgba(59,130,246,0.92)",
  "rgba(147,197,253,0.95)",
  "rgba(96,165,250,0.78)",
  "rgba(37,99,235,0.85)",
];

export const DonutSummaryChart = ({ data }: TDonutSummaryChartProps) => {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip />
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={68}
            outerRadius={98}
            paddingAngle={3}
            stroke="transparent"
          >
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
