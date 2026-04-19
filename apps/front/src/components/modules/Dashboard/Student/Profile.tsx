"use client";

import { useSchoolUserLogoutMutation } from "@/lib/redux/api/endpoints/school-user.api";
import { StudentProfileSummaryCard } from "@modules/Dashboard/Student/parts/profile-summary-card";
import { useSchoolUserMeQuery } from "@/lib/redux/api/endpoints/school-user.api";
import { DashboardLoadingCard } from "@modules/Dashboard/parts/dashboard-loading-card";
import { DashboardEmptyState } from "@modules/Dashboard/parts/dashboard-empty-state";
import { useUpdateMeMutation } from "@/lib/redux/api/endpoints/school-user.api";
import { StudentProfileForm } from "@modules/Dashboard/Student/parts/student-profile-form";
import { StudentAccountCard } from "@modules/Dashboard/Student/parts/student-account-card";
import { getApiErrorMessage } from "@/utils/function-helper";
import { StudentLogoutCard } from "@modules/Dashboard/Student/parts/student-logout-card";
import { DashboardSection } from "@modules/Dashboard/parts/dashboard-section";
import { useRouter } from "next/navigation";
import { useI18n } from "@/hooks/useI18n";
import { toast } from "sonner";

import * as L from "lucide-react";

const StudentProfilePage = () => {
  const { t } = useI18n();
  const router = useRouter();

  const { data: me, isLoading, isFetching } = useSchoolUserMeQuery();

  const [updateMe, { isLoading: isUpdating }] = useUpdateMeMutation();
  const [logout, { isLoading: isLoggingOut }] = useSchoolUserLogoutMutation();

  const handleSaveProfile = async (values: {
    fullName?: string;
    email?: string;
    mobile?: string;
    avatarUrl?: string;
  }) => {
    try {
      const response = await updateMe({
        fullName: values.fullName?.trim() || undefined,
        email: values.email?.trim() || undefined,
        mobile: values.mobile?.trim() || undefined,
        avatarUrl: values.avatarUrl?.trim() || undefined,
      }).unwrap();
      toast.success(
        response?.fullName
          ? t("dashboard.student.profile.toasts.updateSuccess")
          : t("dashboard.student.profile.toasts.updateSuccess"),
      );
    } catch (error: unknown) {
      toast.error(
        getApiErrorMessage(
          error,
          t("dashboard.student.profile.toasts.updateFailed"),
        ),
      );
    }
  };

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      toast.success(t("dashboard.student.profile.toasts.logoutSuccess"));
      router.replace("/auth/school-user");
    } catch (error: unknown) {
      toast.error(
        getApiErrorMessage(
          error,
          t("dashboard.student.profile.toasts.logoutFailed"),
        ),
      );
    }
  };

  if (isLoading) return <DashboardLoadingCard rows={8} />;

  if (!me)
    return (
      <DashboardEmptyState
        icon={L.UserRound}
        title={t("dashboard.student.profile.empty.title")}
        description={t("dashboard.student.profile.empty.description")}
      />
    );

  return (
    <div className="space-y-6">
      <DashboardSection
        title={t("dashboard.student.profile.summaryCard.title")}
        description={t("dashboard.student.profile.summaryCard.description")}
      >
        <StudentProfileSummaryCard me={me} isFetching={isFetching} />
      </DashboardSection>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <DashboardSection
          title={t("dashboard.student.profile.formCard.title")}
          description={t("dashboard.student.profile.formCard.description")}
        >
          <StudentProfileForm
            me={me}
            isSubmitting={isUpdating}
            onSubmit={handleSaveProfile}
          />
        </DashboardSection>

        <div className="space-y-6">
          <DashboardSection
            title={t("dashboard.student.profile.accountCard.title")}
            description={t("dashboard.student.profile.accountCard.description")}
          >
            <StudentAccountCard me={me} />
          </DashboardSection>

          <DashboardSection
            title={t("dashboard.student.profile.logoutCard.title")}
            description={t("dashboard.student.profile.logoutCard.description")}
          >
            <StudentLogoutCard
              isSubmitting={isLoggingOut}
              onLogout={handleLogout}
            />
          </DashboardSection>
        </div>
      </div>
    </div>
  );
};

export default StudentProfilePage;
