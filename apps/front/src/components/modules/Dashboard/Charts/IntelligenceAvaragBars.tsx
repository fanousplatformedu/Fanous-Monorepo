"use client";

import { Bar, BarChart, Tooltip, XAxis, YAxis } from "recharts";
import { CartesianGrid, ResponsiveContainer } from "recharts";

type TProps = {
  data: Array<{ name: string; value: number }>;
};

export const IntelligenceAverageBars = ({ data }: TProps) => {
  return (
    <div className="h-[360px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ left: 16, right: 16 }}
        >
          <CartesianGrid strokeDasharray="4 4" opacity={0.18} />
          <XAxis type="number" domain={[0, 100]} />
          <YAxis
            type="category"
            dataKey="name"
            width={120}
            tick={{ fontSize: 12 }}
          />
          <Tooltip />
          <Bar
            dataKey="value"
            radius={[0, 10, 10, 0]}
            fill="rgba(59,130,246,0.88)"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
