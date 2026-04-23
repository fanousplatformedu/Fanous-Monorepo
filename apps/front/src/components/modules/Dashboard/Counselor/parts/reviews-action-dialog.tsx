"use client";

import { TCounselorReviewActionDialog } from "@/types/modules";
import { AppDialog, AppDialogActions } from "@elements/app-dialog";
import { TActionDialogFormValues } from "@/lib/validation/counselor-schema";
import { FloatingSelectField } from "@elements/floating-select-field";
import { FloatingInputField } from "@elements/floating-input-field";
import { actionDialogSchema } from "@/lib/validation/counselor-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useI18n } from "@/hooks/useI18n";
import { useForm } from "react-hook-form";

import * as F from "@ui/form";

export const CounselorReviewActionDialog = ({
  open,
  detail,
  isLoading,
  onSubmit,
  onOpenChange,
}: TCounselorReviewActionDialog) => {
  const { t } = useI18n();

  const form = useForm<TActionDialogFormValues>({
    resolver: zodResolver(actionDialogSchema),
    defaultValues: {
      status: "REVIEWED",
      feedback: "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        status:
          detail?.status === "IN_REVIEW" ||
          detail?.status === "REVIEWED" ||
          detail?.status === "RETURNED"
            ? detail.status
            : "REVIEWED",
        feedback: detail?.feedback ?? "",
      });
    }
  }, [detail, form, open]);

  return (
    <AppDialog
      size="lg"
      open={open}
      onOpenChange={onOpenChange}
      title={t("dashboard.counselor.reviews.actionDialog.title")}
      description={t("dashboard.counselor.reviews.actionDialog.description")}
      footer={
        <AppDialogActions
          confirmType="submit"
          isLoading={isLoading}
          confirmText={t("common.save")}
          cancelText={t("common.cancel")}
          loadingText={t("common.saving")}
          form="counselor-review-action-form"
          onCancel={() => onOpenChange(false)}
        />
      }
    >
      <F.Form {...form}>
        <form
          id="counselor-review-action-form"
          onSubmit={form.handleSubmit(async (values) => {
            await onSubmit(values);
          })}
          className="space-y-4"
        >
          <div className="rounded-2xl border border-border/60 bg-secondary/20 p-4">
            <p className="text-xs text-muted-foreground">
              {t("dashboard.counselor.reviews.actionDialog.reviewInfo")}
            </p>
            <p className="mt-2 text-sm font-medium">
              {detail?.studentName || "-"} — {detail?.assignmentTitle || "-"}
            </p>
          </div>

          <FloatingSelectField
            control={form.control}
            name="status"
            label={t("dashboard.counselor.reviews.actionDialog.fields.status")}
            options={[
              {
                value: "IN_REVIEW",
                label: t("dashboard.counselor.reviews.status.IN_REVIEW"),
              },
              {
                value: "REVIEWED",
                label: t("dashboard.counselor.reviews.status.REVIEWED"),
              },
              {
                value: "RETURNED",
                label: t("dashboard.counselor.reviews.status.RETURNED"),
              },
            ]}
          />

          <FloatingInputField
            control={form.control}
            name="feedback"
            label={t(
              "dashboard.counselor.reviews.actionDialog.fields.feedback",
            )}
          />
        </form>
      </F.Form>
    </AppDialog>
  );
};
