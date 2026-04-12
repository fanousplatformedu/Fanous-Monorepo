import { DashboardSidebar } from "@elements/dashboard-sidebar";
import { DashboardHeader } from "@elements/dashboard-header";
import { DashboardShell } from "@elements/dashboard-shell";
import { schoolAdminNav } from "@/utils/dashboard-nav.config";
import { Background } from "@elements/background";

import SchoolAdminAssignmentsPage from "@modules/Dashboard/SchoolAdmin/Assignments";

const AssignmentsSchoolAdminDashboard = () => {
  return (
    <DashboardShell
      header={
        <DashboardHeader
          title="Assignments"
          description="Create, publish and distribute school assessments."
        />
      }
      sidebar={
        <DashboardSidebar
          title="School Admin"
          subtitle="School operations panel"
          items={schoolAdminNav}
        />
      }
    >
      <Background />
      <SchoolAdminAssignmentsPage />
    </DashboardShell>
  );
};

export default AssignmentsSchoolAdminDashboard;
