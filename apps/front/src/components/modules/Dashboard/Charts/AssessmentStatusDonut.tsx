"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

type TProps = {
  data: Array<{ name: string; value: number }>;
};

const COLORS = [
  "rgba(59,130,246,0.95)",
  "rgba(147,197,253,0.95)",
  "rgba(37,99,235,0.82)",
  "rgba(99,102,241,0.78)",
];

export const AssignmentStatusDonut = ({ data }: TProps) => {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip />
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={72}
            outerRadius={100}
            paddingAngle={4}
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
