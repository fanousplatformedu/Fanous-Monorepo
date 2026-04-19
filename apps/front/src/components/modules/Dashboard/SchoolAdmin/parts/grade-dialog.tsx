"use client";

import { AppDialog, AppDialogActions } from "@elements/app-dialog";
import { TGradeEditDialogProps } from "@/types/modules";
import { FloatingInputField } from "@elements/floating-input-field";
import { TGradeEditValues } from "@/lib/validation/school-admin";
import { gradeEditSchema } from "@/lib/validation/school-admin";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useI18n } from "@/hooks/useI18n";
import { useForm } from "react-hook-form";

import * as F from "@ui/form";

export const GradeEditDialog = ({
  open,
  onSubmit,
  isSubmitting,
  initialValues,
  onOpenChange,
}: TGradeEditDialogProps) => {
  const { t } = useI18n();

  const form = useForm<TGradeEditValues>({
    resolver: zodResolver(gradeEditSchema),
    defaultValues: {
      name: "",
      code: "",
    },
  });

  useEffect(() => {
    if (!initialValues) return;
    form.reset({
      name: initialValues.name,
      code: initialValues.code,
    });
  }, [form, initialValues]);

  const handleSubmit = async (values: TGradeEditValues) => {
    if (!initialValues) return;
    await onSubmit({
      id: initialValues.id,
      name: values.name,
      code: values.code,
    });
  };

  return (
    <AppDialog
      size="md"
      open={open}
      onOpenChange={onOpenChange}
      title={t("dashboard.schoolAdmin.grades.editDialog.title")}
      description={t("dashboard.schoolAdmin.grades.editDialog.description")}
      footer={
        <AppDialogActions
          confirmType="submit"
          isLoading={isSubmitting}
          cancelText={t("common.cancel")}
          onCancel={() => onOpenChange(false)}
          confirmText={t("dashboard.schoolAdmin.grades.actions.save")}
          loadingText={t("dashboard.schoolAdmin.grades.actions.saving")}
        />
      }
    >
      <F.Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FloatingInputField
            name="name"
            control={form.control}
            label={t("dashboard.schoolAdmin.grades.form.fields.name")}
          />

          <FloatingInputField
            name="code"
            control={form.control}
            label={t("dashboard.schoolAdmin.grades.form.fields.code")}
          />
        </form>
      </F.Form>
    </AppDialog>
  );
};
