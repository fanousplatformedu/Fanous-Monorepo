"use client";

import { CounselorStudentProgressChart } from "@modules/Dashboard/Counselor/parts/student-progress-chart";
import { AppDialog, AppDialogActions } from "@elements/app-dialog";
import { DashboardLoadingCard } from "@modules/Dashboard/parts/dashboard-loading-card";
import { TStudentDetailDialog } from "@/types/modules";
import { StatusBadge } from "@elements/status-badge";
import { useI18n } from "@/hooks/useI18n";
import { Button } from "@ui/button";

import * as L from "lucide-react";

export const CounselorStudentDetailDialog = ({
  open,
  student,
  timeline,
  onExport,
  isLoading,
  onSchedule,
  onOpenChange,
}: TStudentDetailDialog) => {
  const { t } = useI18n();

  if (isLoading)
    return (
      <AppDialog
        size="xl"
        open={open}
        onOpenChange={onOpenChange}
        title={t("dashboard.counselor.student.detailDialog.title")}
        description={t("dashboard.counselor.student.detailDialog.description")}
      >
        <DashboardLoadingCard rows={6} />
      </AppDialog>
    );

  return (
    <AppDialog
      size="xl"
      open={open}
      onOpenChange={onOpenChange}
      title={t("dashboard.counselor.student.detailDialog.title")}
      description={t("dashboard.counselor.student.detailDialog.description")}
      bodyClassName="max-h-[72vh] overflow-y-auto pr-1"
      footer={
        <AppDialogActions
          confirmVariant="brand"
          onConfirm={onSchedule}
          cancelText={t("common.close")}
          onCancel={() => onOpenChange(false)}
          confirmText={t(
            "dashboard.counselor.student.detailDialog.actions.schedule",
          )}
        />
      }
    >
      {!student ? null : (
        <div className="space-y-6">
          <div className="grid gap-4 xl:grid-cols-3">
            <div className="rounded-2xl border border-border/60 bg-secondary/20 p-4 xl:col-span-2">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-card/70">
                  <L.UserRound className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-foreground">
                    {student.fullName || "-"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {student.email || student.mobile || "-"}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-xs text-muted-foreground">
                    {t(
                      "dashboard.counselor.student.detailDialog.fields.status",
                    )}
                  </p>
                  <div className="mt-2">
                    <StatusBadge value={student.status || "-"} />
                  </div>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    {t(
                      "dashboard.counselor.student.detailDialog.fields.createdAt",
                    )}
                  </p>
                  <p className="mt-2 text-sm font-medium text-foreground">
                    {student.createdAt
                      ? new Date(student.createdAt).toLocaleDateString()
                      : "-"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    {t("dashboard.counselor.student.detailDialog.fields.grade")}
                  </p>
                  <p className="mt-2 text-sm font-medium text-foreground">
                    {student.gradeName || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    {t(
                      "dashboard.counselor.student.detailDialog.fields.classroom",
                    )}
                  </p>
                  <p className="mt-2 text-sm font-medium text-foreground">
                    {student.classroomName || "-"}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border/60 bg-card/60 p-4">
              <h4 className="mb-3 text-sm font-semibold text-foreground">
                {t("dashboard.counselor.student.detailDialog.quickActions")}
              </h4>

              <div className="space-y-3">
                <Button
                  variant="brandSoft"
                  onClick={onSchedule}
                  className="rounded-2xl"
                >
                  <span className="text-sm font-medium text-foreground">
                    {t(
                      "dashboard.counselor.student.detailDialog.actions.schedule",
                    )}
                  </span>
                  <L.CalendarPlus2 className="h-4 w-4 text-primary" />
                </Button>

                <Button
                  onClick={onExport}
                  variant="brandChip"
                  className="rounded-2xl"
                >
                  <span className="text-sm font-medium text-foreground">
                    {t(
                      "dashboard.counselor.student.detailDialog.actions.export",
                    )}
                  </span>
                  <L.Download className="h-4 w-4 text-primary" />
                </Button>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card/60 p-4">
            <h4 className="mb-4 text-sm font-semibold text-foreground">
              {t("dashboard.counselor.student.detailDialog.progressTitle")}
            </h4>
            <CounselorStudentProgressChart data={timeline} />
          </div>
        </div>
      )}
    </AppDialog>
  );
};
