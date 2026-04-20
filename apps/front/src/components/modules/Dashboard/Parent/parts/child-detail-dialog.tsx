"use client";

import { AppDialog, AppDialogActions } from "@elements/app-dialog";
import { DashboardLoadingCard } from "@modules/Dashboard/parts/dashboard-loading-card";
import { TChildDetailDialog } from "@/types/modules";
import { useI18n } from "@/hooks/useI18n";

import * as L from "lucide-react";

export const ParentChildDetailDialog = ({
  open,
  child,
  isLoading,
  onOpenChange,
}: TChildDetailDialog) => {
  const { t } = useI18n();

  if (isLoading) {
    return (
      <AppDialog
        size="lg"
        open={open}
        onOpenChange={onOpenChange}
        title={t("dashboard.parent.children.detailDialog.title")}
        description={t("dashboard.parent.children.detailDialog.description")}
      >
        <DashboardLoadingCard rows={6} />
      </AppDialog>
    );
  }

  return (
    <AppDialog
      size="lg"
      open={open}
      onOpenChange={onOpenChange}
      title={t("dashboard.parent.children.detailDialog.title")}
      description={t("dashboard.parent.children.detailDialog.description")}
      footer={
        <AppDialogActions
          confirmVariant="brand"
          cancelVariant="brandSoft"
          cancelText={t("common.close")}
          confirmText={t("common.close")}
          onCancel={() => onOpenChange(false)}
          onConfirm={() => onOpenChange(false)}
        />
      }
    >
      {!child ? null : (
        <div className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-border/60 bg-secondary/20 p-4">
              <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                <L.UserRound className="h-4 w-4 text-primary" />
                {t("dashboard.parent.children.detailDialog.fields.fullName")}
              </div>
              <p className="text-sm font-semibold text-foreground">
                {child.fullName || "-"}
              </p>
            </div>

            <div className="rounded-2xl border border-border/60 bg-secondary/20 p-4">
              <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                <L.Mail className="h-4 w-4 text-primary" />
                {t("dashboard.parent.children.detailDialog.fields.email")}
              </div>
              <p className="text-sm font-semibold text-foreground">
                {child.email || "-"}
              </p>
            </div>

            <div className="rounded-2xl border border-border/60 bg-secondary/20 p-4">
              <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                <L.Phone className="h-4 w-4 text-primary" />
                {t("dashboard.parent.children.detailDialog.fields.mobile")}
              </div>
              <p className="text-sm font-semibold text-foreground">
                {child.mobile || "-"}
              </p>
            </div>

            <div className="rounded-2xl border border-border/60 bg-secondary/20 p-4">
              <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                <L.GraduationCap className="h-4 w-4 text-primary" />
                {t("dashboard.parent.children.detailDialog.fields.grade")}
              </div>
              <p className="text-sm font-semibold text-foreground">
                {child.currentEnrollment?.classroom?.grade?.name || "-"}
              </p>
            </div>

            <div className="rounded-2xl border border-border/60 bg-secondary/20 p-4 md:col-span-2">
              <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                <L.School className="h-4 w-4 text-primary" />
                {t("dashboard.parent.children.detailDialog.fields.classroom")}
              </div>
              <p className="text-sm font-semibold text-foreground">
                {child.currentEnrollment?.classroom?.name || "-"}
              </p>
            </div>
          </div>
        </div>
      )}
    </AppDialog>
  );
};
