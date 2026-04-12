"use client";

import { DashboardSection } from "@elements/dashboard-section";

const SchoolUserSettingsPage = () => {
  return (
    <DashboardSection
      title="Settings"
      description="User-level account settings will be expanded here later"
    >
      <div className="rounded-2xl bg-secondary/25 p-4 text-sm text-muted-foreground">
        Profile update is currently supported through the existing updateMe
        flow.
      </div>
    </DashboardSection>
  );
};

export default SchoolUserSettingsPage;
