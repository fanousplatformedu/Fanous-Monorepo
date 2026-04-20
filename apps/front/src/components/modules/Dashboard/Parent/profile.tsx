"use client";

import { useSchoolUserLogoutMutation } from "@/lib/redux/api/endpoints/school-user.api";
import { ParentProfileSummaryCard } from "@modules/Dashboard/Parent/parts/profile-summary-card";
import { useSchoolUserMeQuery } from "@/lib/redux/api/endpoints/school-user.api";
import { DashboardLoadingCard } from "@modules/Dashboard/parts/dashboard-loading-card";
import { useUpdateMeMutation } from "@/lib/redux/api/endpoints/school-user.api";
import { DashboardEmptyState } from "@modules/Dashboard/parts/dashboard-empty-state";
import { getApiErrorMessage } from "@/utils/function-helper";
import { ParentProfileForm } from "@modules/Dashboard/Parent/parts/profile-form";
import { ParentAccountCard } from "@modules/Dashboard/Parent/parts/profile-account-card";
import { ParentLogoutCard } from "@modules/Dashboard/Parent/parts/profile-logout-card";
import { DashboardSection } from "@modules/Dashboard/parts/dashboard-section";
import { useRouter } from "next/navigation";
import { useI18n } from "@/hooks/useI18n";
import { toast } from "sonner";

import * as L from "lucide-react";

const ParentProfilePage = () => {
  const { t } = useI18n();
  const router = useRouter();

  const { data: me, isLoading, isFetching } = useSchoolUserMeQuery();

  const [updateMe, { isLoading: isUpdating }] = useUpdateMeMutation();
  const [logout, { isLoading: isLoggingOut }] = useSchoolUserLogoutMutation();

  const handleSaveProfile = async (values: {
    email?: string;
    mobile?: string;
    fullName?: string;
  }) => {
    try {
      await updateMe({
        email: values.email?.trim() || undefined,
        mobile: values.mobile?.trim() || undefined,
        fullName: values.fullName?.trim() || undefined,
      }).unwrap();
      toast.success(t("dashboard.parent.profile.toasts.updateSuccess"));
    } catch (error: unknown) {
      toast.error(
        getApiErrorMessage(
          error,
          t("dashboard.parent.profile.toasts.updateFailed"),
        ),
      );
    }
  };

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      toast.success(t("dashboard.parent.profile.toasts.logoutSuccess"));
      router.replace("/auth/school-user");
    } catch (error: unknown) {
      toast.error(
        getApiErrorMessage(
          error,
          t("dashboard.parent.profile.toasts.logoutFailed"),
        ),
      );
    }
  };

  if (isLoading) return <DashboardLoadingCard rows={8} />;

  if (!me)
    return (
      <DashboardEmptyState
        icon={L.UserRound}
        title={t("dashboard.parent.profile.empty.title")}
        description={t("dashboard.parent.profile.empty.description")}
      />
    );

  return (
    <div className="space-y-6">
      <DashboardSection
        title={t("dashboard.parent.profile.summaryCard.title")}
        description={t("dashboard.parent.profile.summaryCard.description")}
      >
        <ParentProfileSummaryCard me={me} isFetching={isFetching} />
      </DashboardSection>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <DashboardSection
          title={t("dashboard.parent.profile.formCard.title")}
          description={t("dashboard.parent.profile.formCard.description")}
        >
          <ParentProfileForm
            me={me}
            isSubmitting={isUpdating}
            onSubmit={handleSaveProfile}
          />
        </DashboardSection>

        <div className="space-y-6">
          <DashboardSection
            title={t("dashboard.parent.profile.accountCard.title")}
            description={t("dashboard.parent.profile.accountCard.description")}
          >
            <ParentAccountCard me={me} />
          </DashboardSection>

          <DashboardSection
            title={t("dashboard.parent.profile.logoutCard.title")}
            description={t("dashboard.parent.profile.logoutCard.description")}
          >
            <ParentLogoutCard
              isSubmitting={isLoggingOut}
              onLogout={handleLogout}
            />
          </DashboardSection>
        </div>
      </div>
    </div>
  );
};

export default ParentProfilePage;
