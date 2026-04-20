"use client";

import { PolarAngleAxis, PolarGrid, Radar, Tooltip } from "recharts";
import { RadarChart, ResponsiveContainer } from "recharts";
import { AppDialog, AppDialogActions } from "@elements/app-dialog";
import { DashboardLoadingCard } from "@modules/Dashboard/parts/dashboard-loading-card";
import { TResultDetailDialog } from "@/types/modules";
import { useI18n } from "@/hooks/useI18n";
import { useMemo } from "react";

export const ParentResultDetailDialog = ({
  open,
  result,
  isLoading,
  onCompare,
  onOpenChange,
}: TResultDetailDialog) => {
  const { t } = useI18n();

  const chartData = useMemo(() => {
    if (!result) return [];
    return [
      {
        key: "LINGUISTIC",
        label: t("dashboard.parent.results.intelligences.LINGUISTIC"),
        value: result.linguistic,
      },
      {
        key: "LOGICAL_MATHEMATICAL",
        label: t("dashboard.parent.results.intelligences.LOGICAL_MATHEMATICAL"),
        value: result.logicalMath,
      },
      {
        key: "MUSICAL",
        label: t("dashboard.parent.results.intelligences.MUSICAL"),
        value: result.musical,
      },
      {
        key: "BODILY_KINESTHETIC",
        label: t("dashboard.parent.results.intelligences.BODILY_KINESTHETIC"),
        value: result.bodilyKinesthetic,
      },
      {
        key: "VISUAL_SPATIAL",
        label: t("dashboard.parent.results.intelligences.VISUAL_SPATIAL"),
        value: result.visualSpatial,
      },
      {
        key: "NATURALISTIC",
        label: t("dashboard.parent.results.intelligences.NATURALISTIC"),
        value: result.naturalistic,
      },
      {
        key: "INTERPERSONAL",
        label: t("dashboard.parent.results.intelligences.INTERPERSONAL"),
        value: result.interpersonal,
      },
      {
        key: "INTRAPERSONAL",
        label: t("dashboard.parent.results.intelligences.INTRAPERSONAL"),
        value: result.intrapersonal,
      },
    ];
  }, [result, t]);

  if (isLoading)
    return (
      <AppDialog
        size="xl"
        open={open}
        onOpenChange={onOpenChange}
        title={t("dashboard.parent.results.detailDialog.title")}
        description={t("dashboard.parent.results.detailDialog.description")}
      >
        <DashboardLoadingCard rows={6} />
      </AppDialog>
    );

  return (
    <AppDialog
      size="xl"
      open={open}
      onOpenChange={onOpenChange}
      title={t("dashboard.parent.results.detailDialog.title")}
      description={t("dashboard.parent.results.detailDialog.description")}
      footer={
        <AppDialogActions
          onConfirm={onCompare}
          confirmVariant="brand"
          cancelVariant="brandSoft"
          cancelText={t("common.close")}
          onCancel={() => onOpenChange(false)}
          confirmText={t("dashboard.parent.results.actions.compare")}
        />
      }
    >
      {!result ? null : (
        <div className="space-y-6">
          <div className="rounded-2xl border border-border/60 bg-secondary/20 p-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-xs text-muted-foreground">
                  {t("dashboard.parent.results.detailDialog.assignment")}
                </p>
                <p className="mt-1 font-medium">{result.assignmentTitle}</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  {t("dashboard.parent.results.detailDialog.dominant")}
                </p>
                <p className="mt-1 font-medium">
                  {result.dominantIntelligence
                    ? t(
                        `dashboard.parent.results.intelligences.${result.dominantIntelligence}`,
                      )
                    : t("dashboard.parent.results.common.notAvailable")}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-[360px_1fr]">
            <div className="h-[340px] rounded-2xl border border-border/60 bg-card/60 p-4">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={chartData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="label" />
                  <Tooltip />
                  <Radar dataKey="value" fillOpacity={0.3} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3 rounded-2xl border border-border/60 bg-card/60 p-4">
              {chartData.map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between rounded-xl bg-secondary/20 px-4 py-3"
                >
                  <span className="text-sm text-muted-foreground">
                    {item.label}
                  </span>
                  <span className="text-sm font-semibold">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <div className="rounded-2xl border border-border/60 bg-card/60 p-4">
              <h4 className="mb-3 text-sm font-semibold text-foreground">
                {t("dashboard.parent.results.detailDialog.summary")}
              </h4>
              <pre className="overflow-x-auto whitespace-pre-wrap break-words text-xs text-muted-foreground">
                {typeof result.scoreSummary === "string"
                  ? result.scoreSummary
                  : JSON.stringify(result.scoreSummary, null, 2) || "-"}
              </pre>
            </div>

            <div className="rounded-2xl border border-border/60 bg-card/60 p-4">
              <h4 className="mb-3 text-sm font-semibold text-foreground">
                {t("dashboard.parent.results.detailDialog.careerMatches")}
              </h4>

              <div className="space-y-3">
                {result.careerMatches?.length ? (
                  result.careerMatches.map((item, index) => (
                    <div
                      key={`${item.title}-${index}`}
                      className="rounded-xl bg-secondary/20 p-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-medium">{item.title}</p>
                        <span className="text-xs font-semibold">
                          {item.score}%
                        </span>
                      </div>

                      <p className="mt-2 text-xs text-muted-foreground">
                        {item.description}
                      </p>

                      <p className="mt-2 text-xs text-foreground/80">
                        {item.fitReason}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {t("dashboard.parent.results.detailDialog.noCareerMatches")}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </AppDialog>
  );
};
