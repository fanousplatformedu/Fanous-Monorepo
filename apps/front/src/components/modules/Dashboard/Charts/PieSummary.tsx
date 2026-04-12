"use client";

import { ResponsiveContainer, Tooltip } from "recharts";
import { PieChart, Pie, Cell, Legend } from "recharts";
import { TPieSummaryChartProps } from "@/types/modules";

const COLORS = [
  "rgba(59,130,246,0.9)",
  "rgba(147,197,253,0.95)",
  "rgba(96,165,250,0.75)",
  "rgba(37,99,235,0.85)",
];

export const PieSummaryChart = ({ data }: TPieSummaryChartProps) => {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip />
          <Legend />
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={55}
            outerRadius={90}
            paddingAngle={3}
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
