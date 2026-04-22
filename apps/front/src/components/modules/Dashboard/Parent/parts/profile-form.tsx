"use client";

import { TParentProfileFormValues } from "@/lib/validation/parent-schemas";
import { parentProfileSchema } from "@/lib/validation/parent-schemas";
import { FloatingInputField } from "@elements/floating-input-field";
import { TProfileForm } from "@/types/modules";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useI18n } from "@/hooks/useI18n";
import { Button } from "@ui/button";

import * as F from "@ui/form";

export const ParentProfileForm = ({
  me,
  isSubmitting,
  onSubmit,
}: TProfileForm) => {
  const { t } = useI18n();

  const form = useForm<TParentProfileFormValues>({
    resolver: zodResolver(parentProfileSchema),
    defaultValues: {
      email: me.email || "",
      mobile: me.mobile || "",
      fullName: me.fullName || "",
    },
  });

  useEffect(() => {
    form.reset({
      email: me.email || "",
      mobile: me.mobile || "",
      fullName: me.fullName || "",
    });
  }, [form, me]);

  return (
    <F.Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <FloatingInputField
            name="fullName"
            control={form.control}
            label={t("dashboard.parent.profile.form.fields.fullName")}
          />

          <FloatingInputField
            name="email"
            type="email"
            control={form.control}
            label={t("dashboard.parent.profile.form.fields.email")}
          />

          <FloatingInputField
            name="mobile"
            control={form.control}
            label={t("dashboard.parent.profile.form.fields.mobile")}
          />
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            variant="brand"
            className="rounded-2xl"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? t("common.loading")
              : t("dashboard.parent.profile.form.actions.save")}
          </Button>
        </div>
      </form>
    </F.Form>
  );
};
