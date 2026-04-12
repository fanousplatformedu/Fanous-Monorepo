import { DashboardSidebar } from "@elements/dashboard-sidebar";
import { DashboardHeader } from "@elements/dashboard-header";
import { DashboardShell } from "@elements/dashboard-shell";
import { schoolUserNav } from "@/utils/dashboard-nav.config";
import { Background } from "@elements/background";

import SchoolUserOverview from "@modules/Dashboard/SchoolUser/Overview";

const SchoolUserDashboardPage = () => {
  return (
    <DashboardShell
      header={
        <DashboardHeader
          title="User Dashboard"
          description="Overview of your current account and profile."
        />
      }
      sidebar={
        <DashboardSidebar
          title="School User"
          subtitle="Your account panel"
          items={schoolUserNav}
        />
      }
    >
      <Background />
      <SchoolUserOverview />
    </DashboardShell>
  );
};

export default SchoolUserDashboardPage;
