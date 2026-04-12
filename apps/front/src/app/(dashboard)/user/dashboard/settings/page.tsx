import { DashboardHeader } from "@elements/dashboard-header";
import { DashboardShell } from "@elements/dashboard-shell";
import { DashboardSidebar } from "@elements/dashboard-sidebar";
import { schoolUserNav } from "@/utils/dashboard-nav.config";
import { Background } from "@elements/background";

import SchoolUserSettingsPage from "@modules/Dashboard/SchoolUser/Settings";

const SettingsSchoolUserDashboard = () => {
  return (
    <DashboardShell
      header={
        <DashboardHeader
          title="Settings"
          description="Profile settings and account preferences."
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
      <SchoolUserSettingsPage />
    </DashboardShell>
  );
};

export default SettingsSchoolUserDashboard;
