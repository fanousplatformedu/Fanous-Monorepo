"use client";

import { classroomSchema, TClassroomForm } from "@/lib/validation/school-admin";
import { AppDialog, AppDialogActions } from "@elements/app-dialog";
import { TClassroomEditDialogProps } from "@/types/modules";
import { FloatingSelectField } from "@elements/floating-select-field";
import { FloatingInputField } from "@elements/floating-input-field";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useI18n } from "@/hooks/useI18n";

import * as F from "@ui/form";

export const ClassroomDialog = ({
  open,
  onSubmit,
  gradeOptions,
  isSubmitting,
  onOpenChange,
  initialValues,
}: TClassroomEditDialogProps) => {
  const { t } = useI18n();

  const form = useForm<TClassroomForm>({
    resolver: zodResolver(classroomSchema),
    defaultValues: {
      gradeId: "",
      name: "",
      code: "",
      year: "",
    },
  });

  useEffect(() => {
    if (!initialValues) return;
    form.reset({
      gradeId: initialValues.gradeId,
      name: initialValues.name,
      code: initialValues.code,
      year: initialValues.year,
    });
  }, [form, initialValues]);

  const handleSubmit = async (values: TClassroomForm) => {
    if (!initialValues) return;
    await onSubmit({
      id: initialValues.id,
      gradeId: values.gradeId,
      name: values.name,
      code: values.code,
      year: values.year,
    });
  };

  return (
    <AppDialog
      size="lg"
      open={open}
      onOpenChange={onOpenChange}
      title={t("dashboard.schoolAdmin.classrooms.editDialog.title")}
      description={t("dashboard.schoolAdmin.classrooms.editDialog.description")}
      footer={
        <AppDialogActions
          confirmType="submit"
          isLoading={isSubmitting}
          cancelText={t("common.cancel")}
          onCancel={() => onOpenChange(false)}
          confirmText={t("dashboard.schoolAdmin.classrooms.actions.save")}
          loadingText={t("dashboard.schoolAdmin.classrooms.actions.saving")}
        />
      }
    >
      <F.Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <FloatingSelectField
              name="gradeId"
              control={form.control}
              options={gradeOptions}
              label={t("dashboard.schoolAdmin.classrooms.form.grade")}
            />

            <FloatingInputField
              name="name"
              control={form.control}
              label={t("dashboard.schoolAdmin.classrooms.form.name")}
            />

            <FloatingInputField
              name="code"
              control={form.control}
              label={t("dashboard.schoolAdmin.classrooms.form.code")}
            />

            <FloatingInputField
              name="year"
              control={form.control}
              label={t("dashboard.schoolAdmin.classrooms.form.year")}
            />
          </div>
        </form>
      </F.Form>
    </AppDialog>
  );
};
