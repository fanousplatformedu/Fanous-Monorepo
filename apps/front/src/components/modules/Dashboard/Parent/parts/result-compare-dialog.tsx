"use client";

import { AppDialog, AppDialogActions } from "@elements/app-dialog";
import { DashboardLoadingCard } from "@modules/Dashboard/parts/dashboard-loading-card";
import { TResultCompare } from "@/types/modules";
import { useI18n } from "@/hooks/useI18n";

export const ParentResultCompareDialog = ({
  open,
  data,
  isLoading,
  compareIds,
  compareRows,
  onOpenChange,
  onClearSelection,
}: TResultCompare) => {
  const { t } = useI18n();

  if (isLoading)
    return (
      <AppDialog
        size="lg"
        open={open}
        onOpenChange={onOpenChange}
        title={t("dashboard.parent.results.compareDialog.title")}
        description={t("dashboard.parent.results.compareDialog.description")}
      >
        <DashboardLoadingCard rows={6} />
      </AppDialog>
    );

  return (
    <AppDialog
      size="lg"
      open={open}
      onOpenChange={onOpenChange}
      title={t("dashboard.parent.results.compareDialog.title")}
      description={t("dashboard.parent.results.compareDialog.description")}
      footer={
        <AppDialogActions
          confirmVariant="brand"
          cancelVariant="brandSoft"
          onConfirm={onClearSelection}
          cancelText={t("common.close")}
          onCancel={() => onOpenChange(false)}
          confirmText={t("dashboard.parent.results.compareDialog.clearAction")}
        />
      }
    >
      <div className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          {compareRows.map((row) => (
            <div
              key={row.id}
              className="rounded-2xl border border-border/60 bg-secondary/20 p-4"
            >
              <p className="text-xs text-muted-foreground">
                {t("dashboard.parent.results.compareDialog.resultCard.child")}
              </p>
              <p className="mt-1 font-medium">
                {row.student?.fullName || row.studentId}
              </p>

              <p className="mt-3 text-xs text-muted-foreground">
                {t(
                  "dashboard.parent.results.compareDialog.resultCard.assignment",
                )}
              </p>
              <p className="mt-1 font-medium">{row.assignmentTitle || "-"}</p>
            </div>
          ))}
        </div>

        {!compareIds.length || compareIds.length < 2 ? (
          <div className="rounded-2xl border border-dashed border-border/60 bg-secondary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">
              {t("dashboard.parent.results.compareDialog.notEnough")}
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border border-border/60 bg-card/60 p-4">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-secondary/30 text-left">
                  <tr>
                    <th className="px-4 py-3 font-medium">
                      {t(
                        "dashboard.parent.results.compareDialog.table.intelligence",
                      )}
                    </th>
                    <th className="px-4 py-3 font-medium">
                      {t(
                        "dashboard.parent.results.compareDialog.table.previous",
                      )}
                    </th>
                    <th className="px-4 py-3 font-medium">
                      {t(
                        "dashboard.parent.results.compareDialog.table.current",
                      )}
                    </th>
                    <th className="px-4 py-3 font-medium">
                      {t("dashboard.parent.results.compareDialog.table.delta")}
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {(data ?? []).map((item, index) => (
                    <tr
                      key={`${item.intelligence}-${index}`}
                      className="border-t border-border/40"
                    >
                      <td className="px-4 py-3">
                        {t(
                          `dashboard.parent.results.intelligences.${item.intelligence}`,
                        )}
                      </td>
                      <td className="px-4 py-3">{item.previous}%</td>
                      <td className="px-4 py-3">{item.current}%</td>
                      <td className="px-4 py-3">{item.delta}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AppDialog>
  );
};
