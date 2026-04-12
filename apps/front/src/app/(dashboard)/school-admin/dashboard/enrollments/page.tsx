import { DashboardSidebar } from "@elements/dashboard-sidebar";
import { DashboardHeader } from "@elements/dashboard-header";
import { DashboardShell } from "@elements/dashboard-shell";
import { schoolAdminNav } from "@/utils/dashboard-nav.config";
import { Background } from "@elements/background";

import SchoolAdminEnrollmentsPage from "@modules/Dashboard/SchoolAdmin/Enrollments";

const EnrollmentsSchoolAdminDashboard = () => {
  return (
    <DashboardShell
      header={
        <DashboardHeader
          title="Enrollments"
          description="Manage classroom enrollments and student assignments."
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
      <SchoolAdminEnrollmentsPage />
    </DashboardShell>
  );
};

export default EnrollmentsSchoolAdminDashboard;
