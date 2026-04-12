"use client";

import { useSchoolUserMeQuery } from "@/lib/redux/api";
import { DashboardSection } from "@elements/dashboard-section";

const SchoolUserProfilePage = () => {
  const { data: me } = useSchoolUserMeQuery();

  return (
    <DashboardSection
      title="My Profile"
      description="Your current account data"
    >
      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl bg-secondary/25 p-4">
          <p className="text-xs text-muted-foreground">Full Name</p>
          <p className="mt-1 font-medium">{me?.fullName || "-"}</p>
        </div>
        <div className="rounded-2xl bg-secondary/25 p-4">
          <p className="text-xs text-muted-foreground">Role</p>
          <p className="mt-1 font-medium">{me?.role || "-"}</p>
        </div>
        <div className="rounded-2xl bg-secondary/25 p-4">
          <p className="text-xs text-muted-foreground">Email</p>
          <p className="mt-1 font-medium">{me?.email || "-"}</p>
        </div>
        <div className="rounded-2xl bg-secondary/25 p-4">
          <p className="text-xs text-muted-foreground">Mobile</p>
          <p className="mt-1 font-medium">{me?.mobile || "-"}</p>
        </div>
      </div>
    </DashboardSection>
  );
};

export default SchoolUserProfilePage;
