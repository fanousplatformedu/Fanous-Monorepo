"use client";

import {
  PasswordValues,
  ProfileValues,
  superAdminChangePasswordSchema,
} from "@/lib/validation/super-admin-schemas";
import { FloatingPasswordField } from "@elements/floating-password-field";
import { SuperAdminSectionCard } from "@modules/Dashboard/SuperAdmin/parts/super-section-card";
import { FloatingInputField } from "@elements/floating-input-field";
import { getApiErrorMessage } from "@/utils/function-helper";
import { profileSchema } from "@/lib/validation/super-admin-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useI18n } from "@/hooks/useI18n";
import { useForm } from "react-hook-form";
import { Button } from "@ui/button";
import { toast } from "sonner";

import * as API from "@/lib/redux/api";
import * as F from "@ui/form";

const Settings = () => {
  const { t } = useI18n();

  const { data: me } = API.useSuperAdminMeQuery();

  const [changePassword, { isLoading: isPasswordLoading }] =
    API.useSuperAdminChangePasswordMutation();

  const [updateProfile, { isLoading: isProfileLoading }] =
    API.useUpdateAdminProfileMutation();

  const passwordForm = useForm<PasswordValues>({
    resolver: zodResolver(superAdminChangePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  });

  const profileForm = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      email: "",
    },
  });

  useEffect(() => {
    if (me) {
      profileForm.reset({
        fullName: me.fullName || "",
        email: me.email || "",
      });
    }
  }, [me, profileForm]);

  const onProfileSubmit = async (values: ProfileValues) => {
    try {
      const res = await updateProfile(values).unwrap();
      toast.success(res.message);
    } catch (error: unknown) {
      toast.error(
        getApiErrorMessage(
          error,
          t("dashboard.superAdmin.settings.toasts.profileUpdateFailed"),
        ),
      );
    }
  };

  const onPasswordSubmit = async (values: PasswordValues) => {
    try {
      const res = await changePassword(values).unwrap();
      toast.success(res.message);
      passwordForm.reset();
    } catch (error: unknown) {
      toast.error(
        getApiErrorMessage(
          error,
          t("dashboard.superAdmin.settings.toasts.passwordUpdateFailed"),
        ),
      );
    }
  };

  return (
    <div className="space-y-6">
      <SuperAdminSectionCard
        title={t("dashboard.superAdmin.settings.profileCard.title")}
        description={t("dashboard.superAdmin.settings.profileCard.description")}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-secondary/25 p-4">
            <p className="text-xs text-muted-foreground">
              {t("dashboard.superAdmin.settings.profileInfo.role")}
            </p>
            <p className="mt-1 font-medium">{me?.role || "-"}</p>
          </div>

          <div className="rounded-2xl bg-secondary/25 p-4">
            <p className="text-xs text-muted-foreground">
              {t("dashboard.superAdmin.settings.profileInfo.userId")}
            </p>
            <p className="mt-1 font-medium">{me?.id || "-"}</p>
          </div>
        </div>

        <div className="mt-6">
          <F.Form {...profileForm}>
            <form
              onSubmit={profileForm.handleSubmit(onProfileSubmit)}
              className="space-y-5"
            >
              <div className="grid gap-4 md:grid-cols-2">
                <FloatingInputField
                  name="fullName"
                  control={profileForm.control}
                  label={t("dashboard.superAdmin.settings.fields.fullName")}
                />

                <FloatingInputField
                  name="email"
                  type="email"
                  control={profileForm.control}
                  label={t("dashboard.superAdmin.settings.fields.email")}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="submit"
                  variant="brand"
                  className="rounded-2xl"
                  disabled={isProfileLoading}
                >
                  {isProfileLoading
                    ? t("common.loading")
                    : t("dashboard.superAdmin.settings.actions.saveProfile")}
                </Button>
              </div>
            </form>
          </F.Form>
        </div>
      </SuperAdminSectionCard>

      <SuperAdminSectionCard
        title={t("dashboard.superAdmin.settings.passwordCard.title")}
        description={t(
          "dashboard.superAdmin.settings.passwordCard.description",
        )}
      >
        <F.Form {...passwordForm}>
          <form
            onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
            className="space-y-5"
          >
            <FloatingPasswordField
              name="currentPassword"
              control={passwordForm.control}
              label={t("dashboard.superAdmin.settings.fields.currentPassword")}
            />

            <FloatingPasswordField
              name="newPassword"
              control={passwordForm.control}
              label={t("dashboard.superAdmin.settings.fields.newPassword")}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="submit"
                variant="brand"
                className="rounded-2xl"
                disabled={isPasswordLoading}
              >
                {isPasswordLoading
                  ? t("common.loading")
                  : t("dashboard.superAdmin.settings.actions.updatePassword")}
              </Button>
            </div>
          </form>
        </F.Form>
      </SuperAdminSectionCard>
    </div>
  );
};

export default Settings;
