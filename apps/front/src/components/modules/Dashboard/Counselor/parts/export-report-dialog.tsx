"use client";

import { TExportReportDialog, TFormatExportValues } from "@/types/modules";
import { AppDialog, AppDialogActions } from "@elements/app-dialog";
import { FloatingSelectField } from "@elements/floating-select-field";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useI18n } from "@/hooks/useI18n";

import * as F from "@ui/form";

export const CounselorExportReportDialog = ({
  open,
  studentId,
  isLoading,
  onSubmit,
  onOpenChange,
}: TExportReportDialog) => {
  const { t } = useI18n();

  const form = useForm<TFormatExportValues>({
    defaultValues: {
      format: "PDF",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({ format: "PDF" });
    }
  }, [form, open]);

  const formatOptions = [
    {
      value: "PDF",
      label: t("dashboard.counselor.student.exportDialog.formatOptions.PDF"),
    },
    {
      value: "EXCEL",
      label: t("dashboard.counselor.student.exportDialog.formatOptions.EXCEL"),
    },
  ];

  const handleSubmit = async (values: TFormatExportValues) => {
    if (!studentId) return;
    await onSubmit({
      studentId,
      format: values.format,
    });
  };

  return (
    <AppDialog
      size="md"
      open={open}
      onOpenChange={onOpenChange}
      title={t("dashboard.counselor.student.exportDialog.title")}
      description={t("dashboard.counselor.student.exportDialog.description")}
      footer={
        <AppDialogActions
          confirmType="submit"
          isLoading={isLoading}
          cancelText={t("common.cancel")}
          loadingText={t("common.loading")}
          form="counselor-export-report-form"
          onCancel={() => onOpenChange(false)}
          confirmText={t(
            "dashboard.counselor.student.exportDialog.actions.submit",
          )}
        />
      }
    >
      <F.Form {...form}>
        <form
          className="space-y-4"
          id="counselor-export-report-form"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <FloatingSelectField
            name="format"
            control={form.control}
            options={formatOptions}
            label={t("dashboard.counselor.student.exportDialog.fields.format")}
          />
        </form>
      </F.Form>
    </AppDialog>
  );
};
