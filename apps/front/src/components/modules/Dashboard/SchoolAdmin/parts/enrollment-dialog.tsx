"use client";

import { TEnrollmentCloseDialogProps } from "@/types/modules";
import { AppDialog, AppDialogActions } from "@elements/app-dialog";
import { useI18n } from "@/hooks/useI18n";

export const EnrollmentDialog = ({
  open,
  target,
  isLoading,
  onConfirm,
  onOpenChange,
}: TEnrollmentCloseDialogProps) => {
  const { t } = useI18n();

  return (
    <AppDialog
      size="sm"
      open={open}
      onOpenChange={onOpenChange}
      title={t("dashboard.schoolAdmin.enrollments.closeDialog.title")}
      description={t(
        "dashboard.schoolAdmin.enrollments.closeDialog.description",
      )}
      footer={
        <AppDialogActions
          cancelText={t("common.cancel")}
          confirmText={t(
            "dashboard.schoolAdmin.enrollments.closeDialog.confirm",
          )}
          isLoading={isLoading}
          onConfirm={onConfirm}
          confirmVariant="brand"
          cancelVariant="brandOutline"
          loadingText={t("common.loading")}
          onCancel={() => onOpenChange(false)}
        />
      }
    >
      <div className="rounded-2xl border border-border/60 bg-secondary/20 p-4 text-sm">
        <p>
          <span className="font-medium">
            {t("dashboard.schoolAdmin.enrollments.closeDialog.student")}:
          </span>{" "}
          {target?.studentLabel ?? "-"}
        </p>

        <p className="mt-2">
          <span className="font-medium">
            {t("dashboard.schoolAdmin.enrollments.closeDialog.classroom")}:
          </span>{" "}
          {target?.classroomLabel ?? "-"}
        </p>
      </div>
    </AppDialog>
  );
};
