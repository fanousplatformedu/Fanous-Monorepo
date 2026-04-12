import { DashboardSidebar } from "@elements/dashboard-sidebar";
import { DashboardHeader } from "@elements/dashboard-header";
import { DashboardShell } from "@elements/dashboard-shell";
import { schoolAdminNav } from "@/utils/dashboard-nav.config";
import { Background } from "@elements/background";

import SchoolAdminClassroomsPage from "@modules/Dashboard/SchoolAdmin/Classrooms";

const ClassroomsSchoolAdminDashboard = () => {
  return (
    <DashboardShell
      header={
        <DashboardHeader
          title="Classrooms"
          description="Create and manage school classrooms."
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
      <SchoolAdminClassroomsPage />
    </DashboardShell>
  );
};

export default ClassroomsSchoolAdminDashboard;
