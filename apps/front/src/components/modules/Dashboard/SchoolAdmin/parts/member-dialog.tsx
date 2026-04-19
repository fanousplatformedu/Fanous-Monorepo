"use client";

import { useI18n } from "@/hooks/useI18n";
import { Button } from "@ui/button";

import * as D from "@ui/dialog";
import * as T from "@/types/modules";

export const MemberDisableDialog = ({
  open,
  member,
  isLoading,
  onConfirm,
  onOpenChange,
}: T.TMemberDisableDialogProps) => {
  const { t } = useI18n();

  return (
    <D.Dialog open={open} onOpenChange={onOpenChange}>
      <D.DialogContent className="rounded-[1.75rem] sm:max-w-md">
        <D.DialogHeader>
          <D.DialogTitle>
            {t("dashboard.schoolAdmin.members.disableDialog.title")}
          </D.DialogTitle>
          <D.DialogDescription>
            {t("dashboard.schoolAdmin.members.disableDialog.description")}
          </D.DialogDescription>
        </D.DialogHeader>
        <div className="rounded-2xl border border-border/60 bg-secondary/20 p-4 text-sm">
          <p>
            <span className="font-medium">
              {t("dashboard.schoolAdmin.members.disableDialog.fullName")}:
            </span>{" "}
            {member?.fullName || "-"}
          </p>

          <p className="mt-2">
            <span className="font-medium">
              {t("dashboard.schoolAdmin.members.disableDialog.email")}:
            </span>{" "}
            {member?.email || "-"}
          </p>

          <p className="mt-2">
            <span className="font-medium">
              {t("dashboard.schoolAdmin.members.disableDialog.role")}:
            </span>{" "}
            {member
              ? t(`dashboard.schoolAdmin.members.roles.${member.role}`)
              : "-"}
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
            onClick={onConfirm}
            disabled={isLoading}
            className="rounded-2xl"
          >
            {isLoading
              ? t("common.loading")
              : t("dashboard.schoolAdmin.members.actions.disable")}
          </Button>
        </div>
      </D.DialogContent>
    </D.Dialog>
  );
};
