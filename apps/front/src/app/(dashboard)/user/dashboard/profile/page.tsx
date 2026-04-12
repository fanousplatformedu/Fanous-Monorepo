import { DashboardSidebar } from "@elements/dashboard-sidebar";
import { DashboardHeader } from "@elements/dashboard-header";
import { DashboardShell } from "@elements/dashboard-shell";
import { schoolUserNav } from "@/utils/dashboard-nav.config";
import { Background } from "@elements/background";

import SchoolUserProfilePage from "@modules/Dashboard/SchoolUser/Profile";

const ProfileSchoolUserDashboard = () => {
  return (
    <DashboardShell
      header={
        <DashboardHeader
          title="My Profile"
          description="View your current user information."
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
      <SchoolUserProfilePage />
    </DashboardShell>
  );
};

export default ProfileSchoolUserDashboard;
