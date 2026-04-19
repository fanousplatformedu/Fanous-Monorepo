"use client";

import { TRequestCounselingDialogProps } from "@/types/modules";
import { TRequestCounselingFormValues } from "@/types/modules";
import { AppDialog, AppDialogActions } from "@elements/app-dialog";
import { FloatingInputField } from "@elements/floating-input-field";
import { useI18n } from "@/hooks/useI18n";
import { useForm } from "react-hook-form";

import * as F from "@ui/form";

export const RequestCounselingDialog = ({
  open,
  onSubmit,
  isSubmitting,
  onOpenChange,
}: TRequestCounselingDialogProps) => {
  const { t } = useI18n();

  const form = useForm<TRequestCounselingFormValues>({
    defaultValues: {
      title: "",
      note: "",
      meetingUrl: "",
      scheduledAt: "",
      counselorId: "",
    },
  });

  const handleSubmit = async (values: TRequestCounselingFormValues) => {
    await onSubmit(values);
    form.reset();
  };

  return (
    <AppDialog
      size="lg"
      open={open}
      onOpenChange={onOpenChange}
      title={t("dashboard.student.counseling.requestDialog.title")}
      description={t("dashboard.student.counseling.requestDialog.description")}
      footer={
        <AppDialogActions
          confirmType="submit"
          isLoading={isSubmitting}
          cancelText={t("common.cancel")}
          loadingText={t("common.loading")}
          onCancel={() => onOpenChange(false)}
          confirmText={t("dashboard.student.counseling.actions.submitRequest")}
        />
      }
    >
      <F.Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <FloatingInputField
              name="title"
              control={form.control}
              label={t("dashboard.student.counseling.form.title")}
            />

            <FloatingInputField
              name="scheduledAt"
              type="datetime-local"
              control={form.control}
              label={t("dashboard.student.counseling.form.scheduledAt")}
            />

            <FloatingInputField
              name="counselorId"
              control={form.control}
              label={t("dashboard.student.counseling.form.counselorId")}
            />

            <FloatingInputField
              name="meetingUrl"
              control={form.control}
              label={t("dashboard.student.counseling.form.meetingUrl")}
            />
          </div>

          <FloatingInputField
            name="note"
            control={form.control}
            label={t("dashboard.student.counseling.form.note")}
          />
        </form>
      </F.Form>
    </AppDialog>
  );
};
