"use client";

import { FloatingPasswordField } from "@elements/floating-password-field";
import { TPasswordFormValues } from "@/types/modules";
import { getApiErrorMessage } from "@/utils/function-helper";
import { DashboardSection } from "@elements/dashboard-section";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useI18n } from "@/hooks/useI18n";
import { Button } from "@ui/button";
import { toast } from "sonner";

import * as API from "@/lib/redux/api";
import * as FP from "@/utils/force-password";
import * as F from "@ui/form";

const SchoolAdminSettingsPage = () => {
  const router = useRouter();
  const { t } = useI18n();

  const [changePassword, { isLoading }] =
    API.useSchoolAdminChangePasswordMutation();

  const form = useForm<TPasswordFormValues>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  });

  const { data: me, refetch: refetchMe } = API.useSchoolAdminMeQuery();
  const { refetch: refetchHeaderUser } = API.useCurrentUserHeaderQuery();

  const onSubmit = async (values: TPasswordFormValues) => {
    try {
      await changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      }).unwrap();
      await Promise.all([refetchHeaderUser(), refetchMe()]);
      FP.clearForcePasswordFlow();
      form.reset();
      toast.success(
        t(
          "dashboard.schoolAdmin.settings.toasts.passwordUpdated",
          {},
          "Password updated successfully.",
        ),
      );
      const returnTo = FP.getForcePasswordReturnTo();
      if (returnTo) router.replace(returnTo);
      else router.replace(FP.getDashboardPathByRole("SCHOOL_ADMIN"));
      router.refresh();
    } catch (error: unknown) {
      toast.error(
        getApiErrorMessage(
          error,
          t(
            "dashboard.schoolAdmin.settings.toasts.passwordUpdateFailed",
            {},
            "Failed to update password.",
          ),
        ),
      );
    }
  };

  const forcePasswordChange = me?.forcePasswordChange;

  return (
    <div className="space-y-5">
      <DashboardSection
        title={t(
          "dashboard.schoolAdmin.settings.account.title",
          {},
          "My Account",
        )}
        description={t(
          "dashboard.schoolAdmin.settings.account.description",
          {},
          "Current school admin profile",
        )}
      >
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl bg-secondary/25 p-4">
            <p className="text-xs text-muted-foreground">
              {t(
                "dashboard.schoolAdmin.settings.fields.fullName",
                {},
                "Full Name",
              )}
            </p>
            <p className="mt-1 font-medium">{me?.fullName || "-"}</p>
          </div>

          <div className="rounded-2xl bg-secondary/25 p-4">
            <p className="text-xs text-muted-foreground">
              {t(
                "dashboard.schoolAdmin.settings.fields.username",
                {},
                "Username",
              )}
            </p>
            <p className="mt-1 font-medium">{me?.username || "-"}</p>
          </div>

          <div className="rounded-2xl bg-secondary/25 p-4">
            <p className="text-xs text-muted-foreground">
              {t("dashboard.schoolAdmin.settings.fields.email", {}, "Email")}
            </p>
            <p className="mt-1 font-medium">{me?.email || "-"}</p>
          </div>

          <div className="rounded-2xl bg-secondary/25 p-4">
            <p className="text-xs text-muted-foreground">
              {t("dashboard.schoolAdmin.settings.fields.role", {}, "Role")}
            </p>
            <p className="mt-1 font-medium">{me?.role || "-"}</p>
          </div>
        </div>
      </DashboardSection>

      <DashboardSection
        title={t(
          "dashboard.schoolAdmin.settings.password.title",
          {},
          "Change Password",
        )}
        description={t(
          "dashboard.schoolAdmin.settings.password.description",
          {},
          "Update your admin password securely",
        )}
      >
        {forcePasswordChange ? (
          <div className="mb-4 rounded-2xl border border-amber-500/25 bg-amber-500/10 p-4 text-sm text-amber-700 dark:text-amber-300">
            {t(
              "dashboard.schoolAdmin.settings.password.forceNotice",
              {},
              "You are using a temporary password. Please set a new password before continuing.",
            )}
          </div>
        ) : null}

        <F.Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <FloatingPasswordField
                control={form.control}
                name="currentPassword"
                label={t(
                  "dashboard.schoolAdmin.settings.fields.currentPassword",
                  {},
                  "Current Password",
                )}
              />

              <FloatingPasswordField
                control={form.control}
                name="newPassword"
                label={t(
                  "dashboard.schoolAdmin.settings.fields.newPassword",
                  {},
                  "New Password",
                )}
              />
            </div>

            <div className="mt-4 flex justify-end">
              <Button
                type="submit"
                variant="brand"
                disabled={isLoading}
                className="rounded-2xl"
              >
                {isLoading
                  ? t("common.loading")
                  : t(
                      "dashboard.schoolAdmin.settings.actions.updatePassword",
                      {},
                      "Update Password",
                    )}
              </Button>
            </div>
          </form>
        </F.Form>
      </DashboardSection>
    </div>
  );
};

export default SchoolAdminSettingsPage;
