"use client";

import { TDetailTab, TStudentResultDetailDialogProps } from "@/types/modules";
import { StudentResultDetailSummaryStrip } from "@modules/Dashboard/Student/parts/student-result-detail-summary";
import { useEffect, useMemo, useState } from "react";
import { AppDialog, AppDialogActions } from "@elements/app-dialog";
import { StudentResultOverviewTab } from "@modules/Dashboard/Student/parts/student-result-overview-tab";
import { StudentResultDetailTabs } from "@modules/Dashboard/Student/parts/student-result-detail-tabs";
import { StudentResultMatchesTab } from "@modules/Dashboard/Student/parts/student-result-matches-tab";
import { StudentResultScoresTab } from "@modules/Dashboard/Student/parts/student-result-scores-tab";
import { DashboardLoadingCard } from "@modules/Dashboard/parts/dashboard-loading-card";
import { useI18n } from "@/hooks/useI18n";

import * as L from "lucide-react";
import * as C from "@/utils/constant";

export const StudentResultDetailDialog = ({
  open,
  result,
  isLoading,
  onCompare,
  onOpenChange,
}: TStudentResultDetailDialogProps) => {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<TDetailTab>("overview");

  useEffect(() => {
    if (open) setActiveTab("overview");
  }, [open]);

  const tabs = useMemo(
    () => [
      {
        key: "overview" as const,
        icon: L.LayoutPanelTop,
        label: t("dashboard.student.results.detail.tabs.overview"),
      },
      {
        key: "scores" as const,
        icon: L.Radar,
        label: t("dashboard.student.results.detail.tabs.scores"),
      },
      {
        key: "matches" as const,
        icon: L.BriefcaseBusiness,
        label: t("dashboard.student.results.detail.tabs.matches"),
      },
    ],
    [t],
  );

  const chartData = useMemo(() => C.buildChartData(result, t), [result, t]);
  const topScores = useMemo(() => C.getTopScores(chartData), [chartData]);
  const averageScore = useMemo(() => C.getAverageScore(chartData), [chartData]);

  const dominantText = useMemo(
    () => C.getDominantInsightText(result?.dominantIntelligence, t),
    [result?.dominantIntelligence, t],
  );

  const summaryPoints = useMemo(
    () =>
      C.buildSummaryPoints({
        result,
        averageScore,
        topStrength: topScores[0]?.fullLabel,
        t,
      }),
    [averageScore, result, t, topScores],
  );

  const narrativeSummary = useMemo(
    () => C.getNarrativeSummary(result?.scoreSummary, t),
    [result?.scoreSummary, t],
  );

  if (isLoading)
    return (
      <AppDialog
        size="xl"
        open={open}
        onOpenChange={onOpenChange}
        className="w-[min(96vw,1100px)]"
        bodyClassName="max-h-[70vh] overflow-y-auto pr-1"
        title={t("dashboard.student.results.detail.title")}
        description={t("dashboard.student.results.detail.description")}
      >
        <DashboardLoadingCard rows={6} />
      </AppDialog>
    );

  return (
    <AppDialog
      size="xl"
      open={open}
      onOpenChange={onOpenChange}
      className="w-[min(96vw,1100px)] max-w-[1100px]"
      bodyClassName="max-h-[72vh] overflow-y-auto pr-1"
      title={t("dashboard.student.results.detail.title")}
      description={t("dashboard.student.results.detail.description")}
      footer={
        <AppDialogActions
          onConfirm={onCompare}
          confirmVariant="brand"
          cancelVariant="brandSoft"
          cancelText={t("common.close")}
          onCancel={() => onOpenChange(false)}
          confirmText={t("dashboard.student.results.actions.compare")}
        />
      }
    >
      {!result ? null : (
        <div className="space-y-5">
          <StudentResultDetailSummaryStrip items={summaryPoints} />

          <StudentResultDetailTabs
            items={tabs}
            value={activeTab}
            onChange={setActiveTab}
          />

          {activeTab === "overview" ? (
            <StudentResultOverviewTab
              topScores={topScores}
              chartData={chartData}
              narrativeSummary={narrativeSummary}
            />
          ) : null}

          {activeTab === "scores" ? (
            <StudentResultScoresTab chartData={chartData} />
          ) : null}

          {activeTab === "matches" ? (
            <StudentResultMatchesTab
              dominantText={dominantText}
              matches={result.careerMatches}
            />
          ) : null}
        </div>
      )}
    </AppDialog>
  );
};
