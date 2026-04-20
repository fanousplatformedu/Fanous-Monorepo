"use client";

import { AppDialog, AppDialogActions } from "@elements/app-dialog";
import { TCancelSessionDialog } from "@/types/modules";
import { useI18n } from "@/hooks/useI18n";

import * as L from "lucide-react";

export const ParentCancelSessionDialog = ({
  open,
  isLoading,
  onOpenChange,
  onConfirm,
}: TCancelSessionDialog) => {
  const { t } = useI18n();

  return (
    <AppDialog
      size="sm"
      open={open}
      onOpenChange={onOpenChange}
      icon={<L.CircleAlert className="h-5 w-5 text-primary" />}
      title={t("dashboard.parent.counseling.cancelDialog.title")}
      description={t("dashboard.parent.counseling.cancelDialog.description")}
      footer={
        <AppDialogActions
          isLoading={isLoading}
          onConfirm={onConfirm}
          confirmVariant="brandSoft"
          cancelText={t("common.back")}
          loadingText={t("common.loading")}
          onCancel={() => onOpenChange(false)}
          confirmText={t("dashboard.parent.counseling.cancelDialog.action")}
        />
      }
    >
      <div className="rounded-2xl border border-border/60 bg-secondary/20 p-4 text-sm text-muted-foreground">
        {t("dashboard.parent.counseling.cancelDialog.note")}
      </div>
    </AppDialog>
  );
};
