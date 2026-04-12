import { DashboardSidebar } from "@elements/dashboard-sidebar";
import { DashboardHeader } from "@elements/dashboard-header";
import { DashboardShell } from "@elements/dashboard-shell";
import { schoolAdminNav } from "@/utils/dashboard-nav.config";
import { Background } from "@elements/background";

import SchoolAdminMembersPage from "@modules/Dashboard/SchoolAdmin/Members";

const MembersSchoolAdminDashboard = () => {
  return (
    <DashboardShell
      header={
        <DashboardHeader
          title="Members"
          description="List and manage members in your school."
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
      <SchoolAdminMembersPage />
    </DashboardShell>
  );
};

export default MembersSchoolAdminDashboard;
