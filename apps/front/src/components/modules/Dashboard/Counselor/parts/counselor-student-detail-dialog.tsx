"use client";

import { Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { ResponsiveContainer, AreaChart } from "recharts";
import { TCounselorStudentDetailDialog } from "@/types/modules";
import { AppDialog, AppDialogActions } from "@elements/app-dialog";
import { DashboardLoadingCard } from "@modules/Dashboard/parts/dashboard-loading-card";
import { useI18n } from "@/hooks/useI18n";

export const CounselorStudentDetailDialog = ({
  open,
  student,
  timeline,
  isLoading,
  onSchedule,
  onOpenChange,
}: TCounselorStudentDetailDialog) => {
  const { t } = useI18n();

  if (isLoading) {
    return (
      <AppDialog
        size="xl"
        open={open}
        onOpenChange={onOpenChange}
        title={t("dashboard.counselor.student.detailDialog.title")}
        description={t("dashboard.counselor.student.detailDialog.description")}
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
      title={t("dashboard.counselor.student.detailDialog.title")}
      description={t("dashboard.counselor.student.detailDialog.description")}
      footer={
        <div className="flex flex-wrap justify-end gap-3">
          <AppDialogActions
            onConfirm={onSchedule}
            cancelText={t("common.close")}
            onCancel={() => onOpenChange(false)}
            confirmText={t(
              "dashboard.counselor.student.detailDialog.scheduleAction",
            )}
            confirmVariant="brand"
            cancelVariant="brandSoft"
          />
        </div>
      }
    >
      {!student ? null : (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-border/60 bg-secondary/20 p-4">
              <p className="text-xs text-muted-foreground">
                {t("dashboard.counselor.student.detailDialog.fields.fullName")}
              </p>
              <p className="mt-2 font-semibold">{student.fullName}</p>
            </div>

            <div className="rounded-2xl border border-border/60 bg-secondary/20 p-4">
              <p className="text-xs text-muted-foreground">
                {t("dashboard.counselor.student.detailDialog.fields.email")}
              </p>
              <p className="mt-2 font-semibold">{student.email || "-"}</p>
            </div>

            <div className="rounded-2xl border border-border/60 bg-secondary/20 p-4">
              <p className="text-xs text-muted-foreground">
                {t("dashboard.counselor.student.detailDialog.fields.mobile")}
              </p>
              <p className="mt-2 font-semibold">{student.mobile || "-"}</p>
            </div>

            <div className="rounded-2xl border border-border/60 bg-secondary/20 p-4">
              <p className="text-xs text-muted-foreground">
                {t(
                  "dashboard.counselor.student.detailDialog.fields.pendingReviews",
                )}
              </p>
              <p className="mt-2 font-semibold">{student.pendingReviews}</p>
            </div>

            <div className="rounded-2xl border border-border/60 bg-card/60 p-4">
              <p className="text-xs text-muted-foreground">
                {t(
                  "dashboard.counselor.student.detailDialog.fields.totalResults",
                )}
              </p>
              <p className="mt-2 font-semibold">{student.totalResults}</p>
            </div>

            <div className="rounded-2xl border border-border/60 bg-card/60 p-4">
              <p className="text-xs text-muted-foreground">
                {t(
                  "dashboard.counselor.student.detailDialog.fields.totalSessions",
                )}
              </p>
              <p className="mt-2 font-semibold">{student.totalSessions}</p>
            </div>

            <div className="rounded-2xl border border-border/60 bg-card/60 p-4">
              <p className="text-xs text-muted-foreground">
                {t(
                  "dashboard.counselor.student.detailDialog.fields.latestResultAt",
                )}
              </p>
              <p className="mt-2 font-semibold">
                {student.latestResultAt
                  ? new Date(student.latestResultAt).toLocaleDateString()
                  : "-"}
              </p>
            </div>

            <div className="rounded-2xl border border-border/60 bg-card/60 p-4">
              <p className="text-xs text-muted-foreground">
                {t(
                  "dashboard.counselor.student.detailDialog.fields.latestSessionAt",
                )}
              </p>
              <p className="mt-2 font-semibold">
                {student.latestSessionAt
                  ? new Date(student.latestSessionAt).toLocaleString()
                  : "-"}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card/60 p-4">
            <h4 className="mb-4 text-sm font-semibold text-foreground">
              {t("dashboard.counselor.student.detailDialog.timeline.title")}
            </h4>

            {!timeline.length ? (
              <p className="text-sm text-muted-foreground">
                {t("dashboard.counselor.student.detailDialog.timeline.empty")}
              </p>
            ) : (
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timeline}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="value" fillOpacity={0.25} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      )}
    </AppDialog>
  );
};
