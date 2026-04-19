"use client";

import { CartesianGrid, Legend, Tooltip, XAxis, YAxis } from "recharts";
import { Line, LineChart, ResponsiveContainer } from "recharts";
import { TTrendPoint } from "@/types/modules";

export const SchoolActivityTrendLine = ({ data }: { data: TTrendPoint[] }) => {
  if (!data.length)
    return (
      <div className="flex h-[320px] items-center justify-center text-sm text-muted-foreground">
        No data
      </div>
    );

  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Line
            dot={{ r: 3 }}
            type="monotone"
            strokeWidth={2}
            dataKey="assignments"
            stroke="hsl(var(--primary))"
          />
          <Line
            dot={{ r: 3 }}
            strokeWidth={2}
            type="monotone"
            dataKey="requests"
            stroke="hsl(220 70% 55%)"
          />
          <Line
            dot={{ r: 3 }}
            strokeWidth={2}
            type="monotone"
            dataKey="audits"
            stroke="hsl(160 60% 45%)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
