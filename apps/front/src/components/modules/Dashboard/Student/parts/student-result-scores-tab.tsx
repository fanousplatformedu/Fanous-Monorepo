"use client";

import { StudentResultChartLegend } from "@modules/Dashboard/Student/parts/student-result-chart-legend";
import { StudentResultRadarChart } from "@modules/Dashboard/Student/parts/student-result-radar-chart";
import { TChartRow } from "@/types/modules";

export const StudentResultScoresTab = ({
  chartData,
}: {
  chartData: TChartRow[];
}) => {
  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_360px]">
      <StudentResultRadarChart data={chartData} />
      <StudentResultChartLegend data={chartData} />
    </div>
  );
};
