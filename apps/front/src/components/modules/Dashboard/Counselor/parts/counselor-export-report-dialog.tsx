"use client";

import { TCounselorExportReportFormValues } from "@/lib/validation/counselor-schema";
import { TCounselorExportReportDialog } from "@/types/modules";
import { AppDialog, AppDialogActions } from "@elements/app-dialog";
import { counselorExportReportSchema } from "@/lib/validation/counselor-schema";
import { FormProvider, useForm } from "react-hook-form";
import { FloatingSelectField } from "@elements/floating-select-field";
import { zodResolver } from "@hookform/resolvers/zod";
import { useI18n } from "@/hooks/useI18n";

import type * as TAPI from "@lib/graphql/generated";

export const CounselorExportReportDialog = ({
  open,
  studentId,
  onSubmit,
  isLoading,
  onOpenChange,
}: TCounselorExportReportDialog) => {
  const { t } = useI18n();

  const form = useForm<TCounselorExportReportFormValues>({
    resolver: zodResolver(counselorExportReportSchema),
    defaultValues: {
      format: "PDF",
    },
  });

  const formatOptions = [
    {
      value: "PDF",
      label: t("dashboard.counselor.student.exportDialog.formats.PDF"),
    },
    {
      value: "EXCEL",
      label: t("dashboard.counselor.student.exportDialog.formats.EXCEL"),
    },
  ];

  const handleClose = (nextOpen: boolean) => {
    if (!nextOpen) {
      form.reset({ format: "PDF" });
    }
    onOpenChange(nextOpen);
  };

  return (
    <AppDialog
      size="md"
      open={open}
      onOpenChange={handleClose}
      title={t("dashboard.counselor.student.exportDialog.title")}
      description={t("dashboard.counselor.student.exportDialog.description")}
      footer={
        <AppDialogActions
          confirmType="submit"
          isLoading={isLoading}
          cancelText={t("common.cancel")}
          loadingText={t("common.loading")}
          onCancel={() => handleClose(false)}
          form="export-counselor-student-report-form"
          confirmText={t("dashboard.counselor.student.exportDialog.submit")}
        />
      }
    >
      <FormProvider {...form}>
        <form
          id="export-counselor-student-report-form"
          className="space-y-4"
          onSubmit={form.handleSubmit(async (values) => {
            if (!studentId) return;
            await onSubmit({
              studentId,
              format: values.format as TAPI.CounselorExportFormat,
            });
          })}
        >
          <FloatingSelectField
            name="format"
            control={form.control}
            options={formatOptions}
            label={t("dashboard.counselor.student.exportDialog.fields.format")}
          />
        </form>
      </FormProvider>
    </AppDialog>
  );
};
