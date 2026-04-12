"use client";

import { CartesianGrid, Legend, ResponsiveContainer } from "recharts";
import { Bar, BarChart, Tooltip, XAxis, YAxis } from "recharts";

type TProps = {
  data: Array<{
    name: string;
    pending: number;
    submitted: number;
    evaluated: number;
  }>;
};

export const AssignmentCompletionBars = ({ data }: TProps) => {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="4 4" opacity={0.18} />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="pending" stackId="a" fill="rgba(147,197,253,0.95)" />
          <Bar dataKey="submitted" stackId="a" fill="rgba(59,130,246,0.85)" />
          <Bar dataKey="evaluated" stackId="a" fill="rgba(37,99,235,0.90)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
