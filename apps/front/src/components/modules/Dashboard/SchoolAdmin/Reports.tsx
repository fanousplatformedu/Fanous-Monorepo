"use client";

import { useSchoolAssessmentSummaryQuery } from "@/lib/redux/api";
import { useAssessmentResultsQuery } from "@/lib/redux/api";
import { IntelligenceAverageBars } from "@modules/Dashboard/Charts/IntelligenceAvaragBars";
import { DashboardLoadingCard } from "@elements/dashboard-loading-card";
import { DashboardEmptyState } from "@elements/dashboard-empty-state";
import { DashboardChartCard } from "@elements/dashboard-chart-card";
import { DashboardTableCard } from "@elements/dashboard-table-card";
import { DashboardStatCard } from "@elements/dashboard-stat-card";
import { useMemo, useState } from "react";
import { TablePagination } from "@elements/table-pagination";
import { PAGE_SIZE } from "@/utils/constant";

import * as L from "lucide-react";

const SchoolAdminReportsPage = () => {
  const [page, setPage] = useState(1);

  const { data: resultsData, isLoading } = useAssessmentResultsQuery({
    take: PAGE_SIZE,
    skip: (page - 1) * PAGE_SIZE,
  });

  const { data: summary } = useSchoolAssessmentSummaryQuery();

  const intelligenceData = summary
    ? [
        { name: "Linguistic", value: summary.avgLinguistic },
        { name: "Logical", value: summary.avgLogicalMath },
        { name: "Musical", value: summary.avgMusical },
        { name: "Bodily", value: summary.avgBodilyKinesthetic },
        { name: "Visual", value: summary.avgVisualSpatial },
        { name: "Natural", value: summary.avgNaturalistic },
        { name: "Social", value: summary.avgInterpersonal },
        { name: "Self", value: summary.avgIntrapersonal },
      ]
    : [];

  const items = useMemo(() => resultsData?.items ?? [], [resultsData]);
  const total = resultsData?.total ?? 0;

  if (isLoading) return <DashboardLoadingCard rows={8} />;

  if (!items.length)
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <DashboardStatCard
            icon={L.FileCheck2}
            title="Evaluated Results"
            value={summary?.evaluatedStudentAssignments ?? 0}
          />
          <DashboardStatCard
            icon={L.Hourglass}
            title="Pending Evaluations"
            value={summary?.pendingStudentAssignments ?? 0}
          />
          <DashboardStatCard
            title="Submitted"
            value={summary?.submittedStudentAssignments ?? 0}
            icon={L.Send}
          />
          <DashboardStatCard
            title="Completion Rate"
            value={`${summary?.completionRate ?? 0}%`}
            icon={L.ChartNoAxesCombined}
          />
        </div>

        <DashboardEmptyState
          icon={L.FileSearch}
          title="No evaluation results"
          description="Assessment results will appear here after students submit assignments."
        />
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardStatCard
          icon={L.FileCheck2}
          title="Evaluated Results"
          value={summary?.evaluatedStudentAssignments ?? 0}
        />
        <DashboardStatCard
          icon={L.Hourglass}
          title="Pending Evaluations"
          value={summary?.pendingStudentAssignments ?? 0}
        />
        <DashboardStatCard
          icon={L.Send}
          title="Submitted"
          value={summary?.submittedStudentAssignments ?? 0}
        />
        <DashboardStatCard
          title="Completion Rate"
          icon={L.ChartNoAxesCombined}
          value={`${summary?.completionRate ?? 0}%`}
        />
      </div>

      <DashboardChartCard
        title="School Intelligence Average"
        description="Average intelligence scores across evaluated students."
      >
        <IntelligenceAverageBars data={intelligenceData} />
      </DashboardChartCard>

      <DashboardTableCard
        title="Evaluation Results"
        description="Latest evaluated student reports."
      >
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-secondary/30 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Student</th>
                <th className="px-4 py-3 font-medium">Assignment</th>
                <th className="px-4 py-3 font-medium">Dominant</th>
                <th className="px-4 py-3 font-medium">Top Score</th>
                <th className="px-4 py-3 font-medium">Created</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item) => {
                const scores = [
                  item.linguistic,
                  item.logicalMath,
                  item.musical,
                  item.bodilyKinesthetic,
                  item.visualSpatial,
                  item.naturalistic,
                  item.interpersonal,
                  item.intrapersonal,
                ];

                const topScore = Math.max(...scores);

                return (
                  <tr key={item.id} className="border-t border-border/40">
                    <td className="px-4 py-3">
                      {item.student?.fullName || item.student?.email || "-"}
                    </td>
                    <td className="px-4 py-3">
                      {item.studentAssignment?.assignment?.title || "-"}
                    </td>
                    <td className="px-4 py-3">{item.dominantKey || "-"}</td>
                    <td className="px-4 py-3">{topScore}%</td>
                    <td className="px-4 py-3">
                      {new Date(item.createdAt).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <TablePagination
          page={page}
          total={total}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
        />
      </DashboardTableCard>
    </div>
  );
};

export default SchoolAdminReportsPage;
