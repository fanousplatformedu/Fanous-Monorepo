"use client";

import { TAssignmentActionDialogProps } from "@/types/modules";
import { useI18n } from "@/hooks/useI18n";
import { Button } from "@ui/button";

import * as D from "@ui/dialog";

export const AssignmentActionDialog = ({
  open,
  mode,
  assignment,
  isLoading,
  onConfirm,
  onOpenChange,
}: TAssignmentActionDialogProps) => {
  const { t } = useI18n();

  const isPublish = mode === "publish";

  return (
    <D.Dialog open={open} onOpenChange={onOpenChange}>
      <D.DialogContent className="rounded-[1.75rem] sm:max-w-md">
        <D.DialogHeader>
          <D.DialogTitle>
            {isPublish
              ? t("dashboard.schoolAdmin.assignments.dialog.publish.title")
              : t("dashboard.schoolAdmin.assignments.dialog.assign.title")}
          </D.DialogTitle>

          <D.DialogDescription>
            {isPublish
              ? t(
                  "dashboard.schoolAdmin.assignments.dialog.publish.description",
                )
              : t(
                  "dashboard.schoolAdmin.assignments.dialog.assign.description",
                )}
          </D.DialogDescription>
        </D.DialogHeader>

        <div className="rounded-2xl border border-border/60 bg-secondary/20 p-4 text-sm">
          <p>
            <span className="font-medium">
              {t("dashboard.schoolAdmin.assignments.dialog.common.title")}:
            </span>{" "}
            {assignment?.title || "-"}
          </p>

          <p className="mt-2">
            <span className="font-medium">
              {t("dashboard.schoolAdmin.assignments.dialog.common.status")}:
            </span>{" "}
            {assignment?.status || "-"}
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="brandSoft"
            className="rounded-2xl"
            onClick={() => onOpenChange(false)}
          >
            {t("common.cancel")}
          </Button>

          <Button
            type="button"
            variant="brand"
            disabled={isLoading}
            onClick={onConfirm}
            className="rounded-2xl"
          >
            {isLoading
              ? t("common.loading")
              : isPublish
                ? t("dashboard.schoolAdmin.assignments.actions.publish")
                : t("dashboard.schoolAdmin.assignments.actions.assign")}
          </Button>
        </div>
      </D.DialogContent>
    </D.Dialog>
  );
};
