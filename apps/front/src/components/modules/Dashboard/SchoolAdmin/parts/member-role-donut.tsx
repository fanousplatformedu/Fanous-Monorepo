"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { TDonutItem } from "@/types/modules";

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--chart-2, 220 70% 50%))",
  "hsl(var(--chart-3, 160 60% 45%))",
  "hsl(var(--chart-4, 35 90% 55%))",
];

export const SchoolMemberRoleDonut = ({ data }: { data: TDonutItem[] }) => {
  if (!data.length)
    return (
      <div className="flex h-[280px] items-center justify-center text-sm text-muted-foreground">
        No data
      </div>
    );

  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip />
          <Pie
            data={data}
            nameKey="name"
            dataKey="value"
            innerRadius={70}
            paddingAngle={3}
            outerRadius={105}
          >
            {data.map((entry, index) => (
              <Cell
                key={`${entry.name}-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
