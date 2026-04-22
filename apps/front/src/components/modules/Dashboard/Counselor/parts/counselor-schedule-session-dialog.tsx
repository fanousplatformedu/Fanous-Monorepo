"use client";

import { TCounselorScheduleSessionDialogFormValues } from "@/lib/validation/counselor-schema";
import { counselorScheduleSessionDialogSchema } from "@/lib/validation/counselor-schema";
import { TCounselorScheduleSessionDialog } from "@/types/modules";
import { AppDialog, AppDialogActions } from "@elements/app-dialog";
import { FormProvider, useForm } from "react-hook-form";
import { FloatingInputField } from "@elements/floating-input-field";
import { zodResolver } from "@hookform/resolvers/zod";
import { useI18n } from "@/hooks/useI18n";

export const CounselorScheduleSessionDialog = ({
  open,
  onSubmit,
  studentId,
  isLoading,
  onOpenChange,
}: TCounselorScheduleSessionDialog) => {
  const { t } = useI18n();

  const form = useForm<TCounselorScheduleSessionDialogFormValues>({
    resolver: zodResolver(counselorScheduleSessionDialogSchema),
    defaultValues: {
      title: "",
      note: "",
      meetingUrl: "",
      scheduledAt: "",
    },
  });

  const handleClose = (nextOpen: boolean) => {
    if (!nextOpen) {
      form.reset();
    }
    onOpenChange(nextOpen);
  };

  return (
    <AppDialog
      size="lg"
      open={open}
      onOpenChange={handleClose}
      title={t("dashboard.counselor.student.scheduleDialog.title")}
      description={t("dashboard.counselor.student.scheduleDialog.description")}
      footer={
        <AppDialogActions
          confirmType="submit"
          isLoading={isLoading}
          confirmText={t("common.save")}
          cancelText={t("common.cancel")}
          loadingText={t("common.loading")}
          onCancel={() => handleClose(false)}
          form="schedule-counselor-session-form"
        />
      }
    >
      <FormProvider {...form}>
        <form
          id="schedule-counselor-session-form"
          className="space-y-4"
          onSubmit={form.handleSubmit(async (values) => {
            if (!studentId) return;
            await onSubmit({
              studentId,
              title: values.title,
              note: values.note || undefined,
              meetingUrl: values.meetingUrl || undefined,
              scheduledAt: values.scheduledAt,
            });
          })}
        >
          <FloatingInputField
            name="title"
            control={form.control}
            label={t("dashboard.counselor.student.scheduleDialog.fields.title")}
          />

          <FloatingInputField
            name="scheduledAt"
            type="datetime-local"
            control={form.control}
            label={t(
              "dashboard.counselor.student.scheduleDialog.fields.scheduledAt",
            )}
          />

          <FloatingInputField
            control={form.control}
            name="meetingUrl"
            label={t(
              "dashboard.counselor.student.scheduleDialog.fields.meetingUrl",
            )}
          />

          <FloatingInputField
            control={form.control}
            name="note"
            label={t("dashboard.counselor.student.scheduleDialog.fields.note")}
          />
        </form>
      </FormProvider>
    </AppDialog>
  );
};
