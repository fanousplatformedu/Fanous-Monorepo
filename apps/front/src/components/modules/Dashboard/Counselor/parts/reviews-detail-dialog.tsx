"use client";

import { TCounselorReviewDetailDialog } from "@/types/modules";
import { AppDialog, AppDialogActions } from "@elements/app-dialog";
import { DashboardLoadingCard } from "@modules/Dashboard/parts/dashboard-loading-card";
import { StatusBadge } from "@elements/status-badge";
import { useI18n } from "@/hooks/useI18n";

export const CounselorReviewDetailDialog = ({
  open,
  detail,
  isLoading,
  onReview,
  onOpenChange,
}: TCounselorReviewDetailDialog) => {
  const { t } = useI18n();

  if (isLoading) {
    return (
      <AppDialog
        size="xl"
        open={open}
        onOpenChange={onOpenChange}
        title={t("dashboard.counselor.reviews.detailDialog.title")}
        description={t("dashboard.counselor.reviews.detailDialog.description")}
      >
        <DashboardLoadingCard rows={8} />
      </AppDialog>
    );
  }

  return (
    <AppDialog
      size="xl"
      open={open}
      onOpenChange={onOpenChange}
      title={t("dashboard.counselor.reviews.detailDialog.title")}
      description={t("dashboard.counselor.reviews.detailDialog.description")}
      footer={
        <AppDialogActions
          onConfirm={onReview}
          onCancel={() => onOpenChange(false)}
          confirmText={t(
            "dashboard.counselor.reviews.detailDialog.reviewAction",
          )}
          cancelText={t("common.close")}
          confirmVariant="brand"
          cancelVariant="brandSoft"
        />
      }
    >
      {!detail ? null : (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-2xl border border-border/60 bg-secondary/20 p-4">
              <p className="text-xs text-muted-foreground">
                {t("dashboard.counselor.reviews.detailDialog.fields.student")}
              </p>
              <p className="mt-2 font-semibold">{detail.studentName}</p>
            </div>

            <div className="rounded-2xl border border-border/60 bg-secondary/20 p-4">
              <p className="text-xs text-muted-foreground">
                {t(
                  "dashboard.counselor.reviews.detailDialog.fields.assignment",
                )}
              </p>
              <p className="mt-2 font-semibold">{detail.assignmentTitle}</p>
            </div>

            <div className="rounded-2xl border border-border/60 bg-secondary/20 p-4">
              <p className="text-xs text-muted-foreground">
                {t("dashboard.counselor.reviews.detailDialog.fields.status")}
              </p>
              <div className="mt-2">
                <StatusBadge value={detail.status} />
              </div>
            </div>

            <div className="rounded-2xl border border-border/60 bg-card/60 p-4">
              <p className="text-xs text-muted-foreground">
                {t(
                  "dashboard.counselor.reviews.detailDialog.fields.dominantKey",
                )}
              </p>
              <p className="mt-2 font-semibold">{detail.dominantKey || "-"}</p>
            </div>

            <div className="rounded-2xl border border-border/60 bg-card/60 p-4">
              <p className="text-xs text-muted-foreground">
                {t("dashboard.counselor.reviews.detailDialog.fields.createdAt")}
              </p>
              <p className="mt-2 font-semibold">
                {new Date(detail.createdAt).toLocaleString()}
              </p>
            </div>

            <div className="rounded-2xl border border-border/60 bg-card/60 p-4">
              <p className="text-xs text-muted-foreground">
                {t(
                  "dashboard.counselor.reviews.detailDialog.fields.reviewedAt",
                )}
              </p>
              <p className="mt-2 font-semibold">
                {detail.reviewedAt
                  ? new Date(detail.reviewedAt).toLocaleString()
                  : "-"}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card/60 p-4">
            <h4 className="mb-3 text-sm font-semibold">
              {t("dashboard.counselor.reviews.detailDialog.feedback")}
            </h4>
            <p className="whitespace-pre-wrap text-sm text-muted-foreground">
              {detail.feedback || "-"}
            </p>
          </div>
        </div>
      )}
    </AppDialog>
  );
};
