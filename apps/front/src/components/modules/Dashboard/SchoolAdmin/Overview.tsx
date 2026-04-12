"use client";

import { AssignmentCompletionBars } from "@modules/Dashboard/Charts/AssignmentCompletionBars";
import { IntelligenceAverageBars } from "@modules/Dashboard/Charts/IntelligenceAvaragBars";
import { AssignmentStatusDonut } from "@modules/Dashboard/Charts/AssessmentStatusDonut";
import { DashboardChartCard } from "@elements/dashboard-chart-card";
import { DashboardStatCard } from "@elements/dashboard-stat-card";

import * as API from "@/lib/redux/api";
import * as L from "lucide-react";

const SchoolAdminOverview = () => {
  const { data: membersData } = API.useSchoolMembersQuery({
    take: 100,
    skip: 0,
  });

  const { data: requestsData } = API.useSchoolAdminAccessRequestsQuery({
    take: 100,
    skip: 0,
  });

  const { data: auditData } = API.useSchoolAdminAuditLogsQuery({
    take: 100,
    skip: 0,
  });

  const { data: assignmentsData } = API.useAssignmentsQuery({
    take: 100,
    skip: 0,
  });

  const { data: summary } = API.useSchoolAssessmentSummaryQuery();

  const members = membersData?.items ?? [];
  const requests = requestsData?.items ?? [];
  const assignments = assignmentsData?.items ?? [];

  const students = members.filter((m) => m.role === "STUDENT").length;
  const counselors = members.filter((m) => m.role === "COUNSELOR").length;
  const teachers = members.filter((m) => m.role === "TEACHER").length;
  const parents = members.filter((m) => m.role === "PARENT").length;
  const pendingRequests = requests.filter((r) => r.status === "PENDING").length;

  const assignmentStatusData = [
    {
      name: "Draft",
      value: assignments.filter((a) => a.status === "DRAFT").length,
    },
    {
      name: "Published",
      value: assignments.filter((a) => a.status === "PUBLISHED").length,
    },
    {
      name: "Closed",
      value: assignments.filter((a) => a.status === "CLOSED").length,
    },
  ].filter((item) => item.value > 0);

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

  const completionBars = summary
    ? [
        {
          name: "Assessment Flow",
          pending: summary.pendingStudentAssignments,
          submitted: summary.submittedStudentAssignments,
          evaluated: summary.evaluatedStudentAssignments,
        },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardStatCard
          value={students}
          title="Total Students"
          icon={L.GraduationCap}
        />
        <DashboardStatCard
          title="Counselors"
          value={counselors}
          icon={L.BadgeHelp}
        />
        <DashboardStatCard
          icon={L.UserPlus2}
          title="Pending Requests"
          value={pendingRequests}
        />
        <DashboardStatCard
          title="Completion Rate"
          icon={L.ChartColumnBig}
          value={`${summary?.completionRate ?? 0}%`}
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <DashboardChartCard
          title="Assignment Status"
          description="Distribution of draft, published, and closed assignments."
        >
          <AssignmentStatusDonut data={assignmentStatusData} />
        </DashboardChartCard>

        <DashboardChartCard
          title="Assessment Progress"
          description="Pending, submitted, and evaluated student assignments."
        >
          <AssignmentCompletionBars data={completionBars} />
        </DashboardChartCard>
      </div>

      <DashboardChartCard
        title="Average Intelligence Profile"
        description="School-wide average score by intelligence dimension."
      >
        <IntelligenceAverageBars data={intelligenceData} />
      </DashboardChartCard>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardStatCard
          icon={L.FileText}
          title="Assignments"
          value={summary?.totalAssignments ?? assignments.length}
        />
        <DashboardStatCard
          icon={L.Send}
          title="Published"
          value={summary?.publishedAssignments ?? 0}
        />
        <DashboardStatCard
          title="Evaluated"
          icon={L.CheckCircle2}
          value={summary?.evaluatedStudentAssignments ?? 0}
        />
        <DashboardStatCard
          title="Audit Logs"
          icon={L.ScrollText}
          value={auditData?.total ?? 0}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <DashboardStatCard title="Teachers" value={teachers} icon={L.Users} />
        <DashboardStatCard title="Parents" value={parents} icon={L.UserRound} />
        <DashboardStatCard
          title="Submitted"
          value={summary?.submittedStudentAssignments ?? 0}
          icon={L.SendHorizontal}
        />
      </div>
    </div>
  );
};

export default SchoolAdminOverview;
