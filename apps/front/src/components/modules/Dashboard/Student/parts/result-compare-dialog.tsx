"use client";

import { ResponsiveContainer, BarChart, CartesianGrid } from "recharts";
import { Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { AppDialog, AppDialogActions } from "@elements/app-dialog";
import { TResultCompareDialogProps } from "@/types/modules";
import { DashboardLoadingCard } from "@modules/Dashboard/parts/dashboard-loading-card";
import { useMemo } from "react";
import { useI18n } from "@/hooks/useI18n";

export const StudentResultCompareDialog = ({
  open,
  data,
  compareIds,
  compareRows,
  isLoading,
  onOpenChange,
  onClearSelection,
}: TResultCompareDialogProps) => {
  const { t } = useI18n();

  const chartData = useMemo(() => {
    return data.map((item) => ({
      intelligence: t(
        `dashboard.student.results.intelligences.${item.intelligence}`,
      ),
      current: item.current,
      previous: item.previous,
      delta: item.delta,
    }));
  }, [data, t]);

  const canRender = compareIds.length === 2;

  return (
    <AppDialog
      size="xl"
      open={open}
      onOpenChange={onOpenChange}
      title={t("dashboard.student.results.compare.title")}
      description={t("dashboard.student.results.compare.description")}
      footer={
        <AppDialogActions
          confirmVariant="brandSoft"
          cancelVariant="brandOutline"
          onConfirm={onClearSelection}
          cancelText={t("common.close")}
          onCancel={() => onOpenChange(false)}
          confirmText={t("dashboard.student.results.compare.clearSelection")}
        />
      }
    >
      {isLoading ? (
        <DashboardLoadingCard rows={6} />
      ) : !canRender ? (
        <p className="text-sm text-muted-foreground">
          {t("dashboard.student.results.compare.needTwoResults")}
        </p>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            {compareRows.map((row) => (
              <div
                key={row.id}
                className="rounded-2xl border border-border/60 bg-secondary/20 p-4"
              >
                <p className="text-xs text-muted-foreground">
                  {t("dashboard.student.results.compare.result")}
                </p>
                <p className="mt-1 font-medium">{row.assignmentTitle}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {row.createdAt
                    ? new Date(row.createdAt).toLocaleString()
                    : "-"}
                </p>
              </div>
            ))}
          </div>

          <div className="h-[380px] rounded-2xl border border-border/60 bg-card/60 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="intelligence" />
                <YAxis domain={[-100, 100]} />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="current"
                  name={t("dashboard.student.results.compare.current")}
                />
                <Bar
                  dataKey="previous"
                  name={t("dashboard.student.results.compare.previous")}
                />
                <Bar
                  dataKey="delta"
                  name={t("dashboard.student.results.compare.delta")}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </AppDialog>
  );
};
