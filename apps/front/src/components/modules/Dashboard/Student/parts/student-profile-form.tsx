"use client";

import { FloatingInputField } from "@elements/floating-input-field";
import { AppDialogActions } from "@elements/app-dialog";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useI18n } from "@/hooks/useI18n";

import * as F from "@ui/form";

export const StudentProfileForm = ({
  me,
  isSubmitting,
  onSubmit,
}: TStudentProfileFormProps) => {
  const { t } = useI18n();

  const form = useForm<TStudentProfileFormValues>({
    defaultValues: {
      fullName: "",
      email: "",
      mobile: "",
      avatarUrl: "",
    },
  });

  useEffect(() => {
    form.reset({
      fullName: me.fullName || "",
      email: me.email || "",
      mobile: me.mobile || "",
      avatarUrl: me.avatarUrl || "",
    });
  }, [form, me]);

  const handleSubmit = async (values: TStudentProfileFormValues) => {
    await onSubmit(values);
  };

  return (
    <F.Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <FloatingInputField
            name="fullName"
            control={form.control}
            label={t("dashboard.student.profile.form.fields.fullName")}
          />

          <FloatingInputField
            name="email"
            control={form.control}
            label={t("dashboard.student.profile.form.fields.email")}
          />

          <FloatingInputField
            name="mobile"
            control={form.control}
            label={t("dashboard.student.profile.form.fields.mobile")}
          />

          <FloatingInputField
            name="avatarUrl"
            control={form.control}
            label={t("dashboard.student.profile.form.fields.avatarUrl")}
          />
        </div>

        <div className="flex justify-end gap-2">
          <AppDialogActions
            confirmType="submit"
            isLoading={isSubmitting}
            cancelText={t("common.reset")}
            confirmText={t("dashboard.student.profile.actions.save")}
            loadingText={t("dashboard.student.profile.actions.saving")}
            onCancel={() =>
              form.reset({
                fullName: me.fullName || "",
                email: me.email || "",
                mobile: me.mobile || "",
                avatarUrl: me.avatarUrl || "",
              })
            }
            confirmVariant="brand"
            cancelVariant="brandSoft"
          />
        </div>
      </form>
    </F.Form>
  );
};
