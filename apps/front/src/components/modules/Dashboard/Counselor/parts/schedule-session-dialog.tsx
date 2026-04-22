"use client";

import { AppDialog, AppDialogActions } from "@elements/app-dialog";
import { TScheduleSessionFormValues } from "@/types/modules";
import { TScheduleSessionDialog } from "@/types/modules";
import { FloatingInputField } from "@elements/floating-input-field";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useI18n } from "@/hooks/useI18n";

import * as F from "@ui/form";

export const CounselorScheduleSessionDialog = ({
  open,
  studentId,
  isLoading,
  onSubmit,
  onOpenChange,
}: TScheduleSessionDialog) => {
  const { t } = useI18n();

  const form = useForm<TScheduleSessionFormValues>({
    defaultValues: {
      title: "",
      note: "",
      meetingUrl: "",
      scheduledAt: "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        title: "",
        note: "",
        meetingUrl: "",
        scheduledAt: "",
      });
    }
  }, [form, open]);

  const handleSubmit = async (values: TScheduleSessionFormValues) => {
    if (!studentId) return;
    await onSubmit({
      studentId,
      title: values.title.trim(),
      note: values.note.trim() || undefined,
      meetingUrl: values.meetingUrl.trim() || undefined,
      scheduledAt: new Date(values.scheduledAt).toISOString(),
    });
  };

  return (
    <AppDialog
      size="lg"
      open={open}
      onOpenChange={onOpenChange}
      title={t("dashboard.counselor.student.scheduleDialog.title")}
      description={t("dashboard.counselor.student.scheduleDialog.description")}
      footer={
        <AppDialogActions
          confirmType="submit"
          isLoading={isLoading}
          cancelText={t("common.cancel")}
          loadingText={t("common.loading")}
          onCancel={() => onOpenChange(false)}
          form="counselor-schedule-session-form"
          confirmText={t(
            "dashboard.counselor.student.scheduleDialog.actions.submit",
          )}
        />
      }
    >
      <F.Form {...form}>
        <form
          className="space-y-4"
          id="counselor-schedule-session-form"
          onSubmit={form.handleSubmit(handleSubmit)}
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
      </F.Form>
    </AppDialog>
  );
};
