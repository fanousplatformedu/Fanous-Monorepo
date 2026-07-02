"use client";

import { AppDialog, AppDialogActions } from "@elements/app-dialog";
import { AssignmentUpdateForm } from "@modules/Dashboard/SchoolAdmin/parts/assignment-update-form";
import { TAssignmentUpdateDialogProps } from "@/types/modules";
import { TUpdateAssignmentForm } from "@/lib/validation/school-admin-schemas";
import { updateAssignmentSchema } from "@/lib/validation/school-admin-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useI18n } from "@/hooks/useI18n";
import { useForm } from "react-hook-form";

import * as F from "@ui/form";

const FORM_ID = "assignment-update-form";

export const AssignmentUpdateDialog = ({
  open,
  onSubmit,
  isSubmitting,
  initialValues,
  onOpenChange,
  gradeOptions,
  classroomOptions,
  studentOptions,
}: TAssignmentUpdateDialogProps) => {
  const { t } = useI18n();

  const form = useForm<TUpdateAssignmentForm>({
    resolver: zodResolver(updateAssignmentSchema),
    defaultValues: {
      title: "",
      dueAt: "",
      description: "",
      status: "PUBLISHED",
      targetMode: "ALL_STUDENTS",
      targetGradeId: "",
      targetClassroomId: "",
      targetStudentIds: [],
    },
  });

  useEffect(() => {
    if (!initialValues) return;
    form.reset(initialValues);
  }, [form, initialValues]);

  const handleSubmit = async (values: TUpdateAssignmentForm) => {
    await onSubmit(values);
  };

  return (
    <AppDialog
      size="lg"
      open={open}
      onOpenChange={onOpenChange}
      title={t("dashboard.schoolAdmin.assignmentDetail.updateDialog.title")}
      description={t(
        "dashboard.schoolAdmin.assignmentDetail.updateDialog.description",
      )}
      footer={
        <AppDialogActions
          form={FORM_ID}
          confirmType="submit"
          isLoading={isSubmitting}
          cancelText={t("common.cancel")}
          onCancel={() => onOpenChange(false)}
          confirmText={t("dashboard.schoolAdmin.assignmentDetail.actions.save")}
          loadingText={t(
            "dashboard.schoolAdmin.assignmentDetail.actions.saving",
          )}
        />
      }
    >
      <F.Form {...form}>
        <form id={FORM_ID} onSubmit={form.handleSubmit(handleSubmit)}>
          <AssignmentUpdateForm
            statusOnly={initialValues?.status === "CLOSED"}
            form={form}
            onSubmit={handleSubmit}
            isLoading={isSubmitting}
            gradeOptions={gradeOptions}
            classroomOptions={classroomOptions}
            studentOptions={studentOptions}
          />
        </form>
      </F.Form>
    </AppDialog>
  );
};
