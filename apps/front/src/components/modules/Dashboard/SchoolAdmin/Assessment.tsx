"use client";

import type * as TAPI from "@lib/graphql/generated";
import { DashboardShell } from "../parts/dashboard-shell";
import { DashboardHeader } from "../parts/dashboard-header";
import { DashboardSidebar } from "../parts/dashboard-sidebar";
import { StudentResultDetailSummaryStrip } from "@modules/Dashboard/Student/parts/student-result-detail-summary";
import { StudentResultOverviewTab } from "@modules/Dashboard/Student/parts/student-result-overview-tab";
import { StudentResultScoresTab } from "@modules/Dashboard/Student/parts/student-result-scores-tab";
import { DashboardEmptyState } from "@modules/Dashboard/parts/dashboard-empty-state";
import { DashboardSection } from "@modules/Dashboard/parts/dashboard-section";
import { useMemo, useState } from "react";
import { useI18n } from "@/hooks/useI18n";
import { schoolAdminNav } from "@/utils/dashboard-nav.config";
import { Button } from "@ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

import * as C from "@/utils/constant";
import * as L from "lucide-react";

export type SchoolAdminAssessmentPageProps = {
  assessmentResult: TAPI.AssessmentResultQuery;
};

type TDetailTab = "overview" | "scores" | "bands";

type TSummaryBands = {
  bands?: Record<string, string>;
};

const BAND_STYLES: Record<string, string> = {
  VERY_STRONG: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  STRONG: "bg-sky-500/15 text-sky-700 dark:text-sky-300",
  MODERATE: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  NEEDS_SUPPORT: "bg-rose-500/15 text-rose-700 dark:text-rose-300",
};

const SCORE_FIELD_TO_INTELLIGENCE: Record<string, string> = {
  linguistic: "LINGUISTIC",
  logicalMath: "LOGICAL_MATHEMATICAL",
  musical: "MUSICAL",
  bodilyKinesthetic: "BODILY_KINESTHETIC",
  visualSpatial: "VISUAL_SPATIAL",
  naturalistic: "NATURALISTIC",
  interpersonal: "INTERPERSONAL",
  intrapersonal: "INTRAPERSONAL",
};

export default function SchoolAdminAssessmentPage({
  assessmentResult,
}: SchoolAdminAssessmentPageProps) {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<TDetailTab>("overview");
  // console.log(assessmentResult);
  const result = assessmentResult?.assessmentResult;

  const chartData = useMemo(() => C.buildChartData(result, t), [result, t]);
  const topScores = useMemo(() => C.getTopScores(chartData), [chartData]);
  const averageScore = useMemo(() => C.getAverageScore(chartData), [chartData]);

  const summaryPoints = useMemo(
    () =>
      C.buildSummaryPoints({
        result: result
          ? {
              assignmentTitle: result.studentAssignmentId,
              dominantIntelligence: result.dominantKey,
            }
          : null,
        averageScore,
        topStrength: topScores[0]?.fullLabel,
        t,
      }),
    [averageScore, result, t, topScores],
  );

  const narrativeSummary = useMemo(() => {
    if (!result?.summaryJson) {
      return t("dashboard.student.results.detail.noSummary");
    }
    const summary = result.summaryJson as TSummaryBands;
    if (!summary?.bands) {
      return C.getNarrativeSummary(result.summaryJson, t);
    }
    return Object.entries(summary.bands)
      .map(([field, band]) => {
        const intelligenceKey = SCORE_FIELD_TO_INTELLIGENCE[field] ?? field;
        const label = t(
          `dashboard.student.results.intelligences.${intelligenceKey}`,
        );
        const bandLabel = t(
          `dashboard.schoolAdmin.assessment.detail.bands.${band}`,
        );
        return `${label}: ${bandLabel}`;
      })
      .join("\n");
  }, [result, t]);

  const bandItems = useMemo(() => {
    const summary = result?.summaryJson as TSummaryBands | null | undefined;
    if (!summary?.bands) return [];

    return Object.entries(summary.bands).map(([field, band]) => {
      const intelligenceKey = SCORE_FIELD_TO_INTELLIGENCE[field] ?? field;
      const score =
        result?.[field as keyof typeof result] != null
          ? Number(result[field as keyof typeof result])
          : (chartData.find((item) => item.key === intelligenceKey)?.value ??
            0);

      return {
        field,
        band,
        score,
        label: t(`dashboard.student.results.intelligences.${intelligenceKey}`),
      };
    });
  }, [chartData, result, t]);

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
        key: "bands" as const,
        icon: L.Layers,
        label: t("dashboard.schoolAdmin.assessment.detail.tabs.bands"),
      },
    ],
    [t],
  );

  const dominantLabel = C.getDominantInsightText(result?.dominantKey, t);

  return (
    <DashboardShell
      header={
        <DashboardHeader
          title={t("dashboard.schoolAdmin.assessment.page.title")}
          description={t("dashboard.schoolAdmin.assessment.page.description")}
        />
      }
      sidebar={
        <DashboardSidebar
          title={t("dashboard.schoolAdmin.shell.title")}
          subtitle={t("dashboard.schoolAdmin.shell.subtitle")}
          items={schoolAdminNav}
        />
      }
    >
      {!result ? (
        <DashboardEmptyState
          icon={L.ClipboardList}
          title={t("dashboard.schoolAdmin.assessment.detail.empty.title")}
          description={t(
            "dashboard.schoolAdmin.assessment.detail.empty.description",
          )}
        />
      ) : (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button asChild variant="brandSoft" size="sm">
              <Link href="/school-admin/dashboard/assignments">
                <L.ArrowLeft className="h-4 w-4" />
                {t("dashboard.schoolAdmin.assessment.detail.backToAssignments")}
              </Link>
            </Button>

            <p className="text-xs text-muted-foreground">
              {t("dashboard.schoolAdmin.assessment.detail.evaluatedAt")}:{" "}
              <span className="font-medium text-foreground">
                {new Date(result.createdAt).toLocaleString()}
              </span>
            </p>
          </div>

          <DashboardSection className="overflow-hidden p-0">
            <div className="relative bg-gradient-to-br from-sky-500/10 via-transparent to-blue-500/10 p-6">
              <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />

              <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                    <L.UserRound className="h-7 w-7" />
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      {t("dashboard.schoolAdmin.assessment.detail.student")}
                    </p>
                    <h2 className="mt-1 text-xl font-bold text-foreground">
                      {result.studentId}
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {t(
                        "dashboard.schoolAdmin.assessment.detail.assignmentRef",
                      )}
                      :{" "}
                      <span className="font-medium text-foreground">
                        {result.studentAssignmentId}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-border/60 bg-card/70 px-5 py-4 lg:min-w-[240px]">
                  <p className="text-xs text-muted-foreground">
                    {t("dashboard.student.results.detail.dominant")}
                  </p>
                  <p className="mt-2 text-lg font-semibold text-foreground">
                    {dominantLabel}
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <L.Gauge className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-primary">
                      {averageScore}%
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {t("dashboard.student.results.detail.averageScore")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </DashboardSection>

          <StudentResultDetailSummaryStrip items={summaryPoints} />

          <div className="rounded-2xl border border-border/60 bg-card/70 p-2">
            <div className="grid grid-cols-3 gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.key;

                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    className={cn(
                      "flex items-center justify-center gap-2 rounded-2xl px-3 py-3 text-sm font-medium transition-all",
                      isActive
                        ? "bg-gradient-to-r from-sky-400 to-blue-500 text-white shadow-sm"
                        : "bg-transparent text-muted-foreground hover:bg-secondary/50 hover:text-foreground",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

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

          {activeTab === "bands" ? (
            <DashboardSection
              title={t("dashboard.schoolAdmin.assessment.detail.bandsTitle")}
              description={t(
                "dashboard.schoolAdmin.assessment.detail.bandsDescription",
              )}
            >
              {bandItems.length ? (
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {bandItems.map((item) => (
                    <div
                      key={item.field}
                      className="rounded-2xl border border-border/60 bg-secondary/15 p-4"
                    >
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <p className="text-sm font-semibold text-foreground">
                          {item.label}
                        </p>
                        <span className="text-sm font-bold text-primary">
                          {item.score}%
                        </span>
                      </div>

                      <span
                        className={cn(
                          "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
                          BAND_STYLES[item.band] ??
                            "bg-secondary text-muted-foreground",
                        )}
                      >
                        {t(
                          `dashboard.schoolAdmin.assessment.detail.bands.${item.band}`,
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {t("dashboard.schoolAdmin.assessment.detail.noBands")}
                </p>
              )}
            </DashboardSection>
          ) : null}
        </div>
      )}
    </DashboardShell>
  );
}
