import { DashboardSidebar } from "@elements/dashboard-sidebar";
import { DashboardHeader } from "@elements/dashboard-header";
import { DashboardShell } from "@elements/dashboard-shell";
import { schoolAdminNav } from "@/utils/dashboard-nav.config";
import { Background } from "@elements/background";

import SchoolAdminAccessRequestsPage from "@modules/Dashboard/SchoolAdmin/AccessRequests";

const AccessRequestSchoolAdmin = () => {
  return (
    <DashboardShell
      header={
        <DashboardHeader
          title="Access Requests"
          description="Review and manage school user requests."
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
      <SchoolAdminAccessRequestsPage />
    </DashboardShell>
  );
};

export default AccessRequestSchoolAdmin;
