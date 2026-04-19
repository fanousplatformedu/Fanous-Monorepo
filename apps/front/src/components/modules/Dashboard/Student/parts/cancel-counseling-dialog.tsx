"use client";

import { TCancelCounselingDialogProps } from "@/types/modules";
import { AppDialog, AppDialogActions } from "@elements/app-dialog";
import { TCancelCounselingFormValues } from "@/types/modules";
import { FloatingInputField } from "@elements/floating-input-field";
import { useI18n } from "@/hooks/useI18n";
import { useForm } from "react-hook-form";

import * as F from "@ui/form";

export const CancelCounselingDialog = ({
  open,
  isSubmitting,
  target,
  onOpenChange,
  onSubmit,
}: TCancelCounselingDialogProps) => {
  const { t } = useI18n();

  const form = useForm<TCancelCounselingFormValues>({
    defaultValues: {
      reason: "",
    },
  });

  const handleSubmit = async (values: TCancelCounselingFormValues) => {
    await onSubmit(values.reason);
    form.reset();
  };

  return (
    <AppDialog
      size="md"
      open={open}
      onOpenChange={onOpenChange}
      title={t("dashboard.student.counseling.cancelDialog.title")}
      description={t("dashboard.student.counseling.cancelDialog.description")}
      footer={
        <AppDialogActions
          confirmType="submit"
          isLoading={isSubmitting}
          confirmVariant="brandSoft"
          cancelText={t("common.cancel")}
          loadingText={t("common.loading")}
          onCancel={() => onOpenChange(false)}
          confirmText={t("dashboard.student.counseling.actions.cancel")}
        />
      }
    >
      <div className="rounded-2xl border border-border/60 bg-secondary/20 p-4 text-sm">
        <p>
          <span className="font-medium">
            {t("dashboard.student.counseling.cancelDialog.sessionTitle")}:
          </span>{" "}
          {target?.title || "-"}
        </p>

        <p className="mt-2">
          <span className="font-medium">
            {t("dashboard.student.counseling.cancelDialog.scheduledAt")}:
          </span>{" "}
          {target?.scheduledAt
            ? new Date(target.scheduledAt).toLocaleString()
            : "-"}
        </p>
      </div>

      <F.Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FloatingInputField
            name="reason"
            control={form.control}
            label={t("dashboard.student.counseling.cancelDialog.reason")}
          />
        </form>
      </F.Form>
    </AppDialog>
  );
};
