import { DashboardSidebar } from "@elements/dashboard-sidebar";
import { DashboardHeader } from "@elements/dashboard-header";
import { DashboardShell } from "@elements/dashboard-shell";
import { schoolAdminNav } from "@/utils/dashboard-nav.config";
import { Background } from "@elements/background";

import SchoolAdminSettingsPage from "@modules/Dashboard/SchoolAdmin/Settings";

const SettingSchoolAdminDashboard = () => {
  return (
    <DashboardShell
      header={
        <DashboardHeader
          title="Settings"
          description="Your current school admin profile."
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
      <SchoolAdminSettingsPage />
    </DashboardShell>
  );
};

export default SettingSchoolAdminDashboard;
