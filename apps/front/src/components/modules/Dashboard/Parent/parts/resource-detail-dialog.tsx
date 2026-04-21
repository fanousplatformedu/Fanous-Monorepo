"use client";

import { AppDialog, AppDialogActions } from "@elements/app-dialog";
import { TResourceDetailDialog } from "@/types/modules";
import { useI18n } from "@/hooks/useI18n";

import * as L from "lucide-react";

export const ParentResourceDetailDialog = ({
  open,
  resource,
  onOpenChange,
}: TResourceDetailDialog) => {
  const { t } = useI18n();

  return (
    <AppDialog
      size="lg"
      open={open}
      onOpenChange={onOpenChange}
      title={t("dashboard.parent.resources.detailDialog.title")}
      description={t("dashboard.parent.resources.detailDialog.description")}
      footer={
        <AppDialogActions
          cancelText={t("common.close")}
          confirmText={t("common.close")}
          cancelVariant="brandSoft"
          confirmVariant="brand"
          onCancel={() => onOpenChange(false)}
          onConfirm={() => onOpenChange(false)}
        />
      }
    >
      {!resource ? null : (
        <div className="space-y-5">
          <div className="rounded-2xl border border-border/60 bg-secondary/20 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs text-muted-foreground">
                  {t("dashboard.parent.resources.detailDialog.resourceTitle")}
                </p>
                <p className="mt-1 text-base font-semibold text-foreground">
                  {resource.title}
                </p>
              </div>

              <ParentResourceCategoryBadge category={resource.category} />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-xs text-muted-foreground">
                  {t("dashboard.parent.resources.detailDialog.slug")}
                </p>
                <p className="mt-1 text-sm font-medium text-foreground">
                  {resource.slug}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  {t("dashboard.parent.resources.detailDialog.createdAt")}
                </p>
                <p className="mt-1 text-sm font-medium text-foreground">
                  {resource.createdAt
                    ? new Date(resource.createdAt).toLocaleString()
                    : "-"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card/60 p-4">
            <div className="mb-3 flex items-center gap-2">
              <L.ScrollText className="h-4 w-4 text-primary" />
              <h4 className="text-sm font-semibold text-foreground">
                {t("dashboard.parent.resources.detailDialog.summary")}
              </h4>
            </div>

            <p className="text-sm leading-7 text-muted-foreground">
              {resource.summary ||
                t("dashboard.parent.resources.common.notAvailable")}
            </p>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card/60 p-4">
            <div className="mb-3 flex items-center gap-2">
              <L.FileText className="h-4 w-4 text-primary" />
              <h4 className="text-sm font-semibold text-foreground">
                {t("dashboard.parent.resources.detailDialog.content")}
              </h4>
            </div>

            <div className="max-h-[340px] overflow-y-auto pr-1 text-sm leading-7 text-muted-foreground whitespace-pre-wrap break-words">
              {resource.content ||
                t("dashboard.parent.resources.common.notAvailable")}
            </div>
          </div>
        </div>
      )}
    </AppDialog>
  );
};
