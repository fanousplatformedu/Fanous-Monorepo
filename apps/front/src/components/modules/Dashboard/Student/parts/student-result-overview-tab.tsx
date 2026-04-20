"use client";

import { TStudentResultTab } from "@/types/modules";
import { useI18n } from "@/hooks/useI18n";

import * as L from "lucide-react";

export const StudentResultOverviewTab = ({
  topScores,
  chartData,
  narrativeSummary,
}: TStudentResultTab) => {
  const { t } = useI18n();

  return (
    <div className="grid gap-5 xl:grid-cols-[1.15fr_.85fr]">
      <div className="rounded-2xl border border-border/60 bg-card/60 p-5">
        <div className="mb-4 flex items-center gap-2">
          <L.SquareChartGantt className="h-4 w-4 text-primary" />
          <h4 className="text-sm font-semibold text-foreground">
            {t("dashboard.student.results.detail.summaryInsights")}
          </h4>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {topScores.map((item, index) => (
            <div
              key={item.key}
              className="rounded-2xl border border-border/50 bg-secondary/15 p-4"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {t("dashboard.student.results.detail.rank")} #{index + 1}
                </span>
                <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                  {item.value}%
                </span>
              </div>

              <p className="text-sm font-semibold text-foreground">
                {item.fullLabel}
              </p>
            </div>
          ))}

          {!topScores.length ? (
            <p className="text-sm text-muted-foreground">
              {t("dashboard.student.results.common.notAvailable")}
            </p>
          ) : null}
        </div>

        <div className="mt-5 rounded-2xl border border-border/50 bg-background/60 p-4">
          <div className="mb-3 flex items-center gap-2">
            <L.ScrollText className="h-4 w-4 text-primary" />
            <h5 className="text-sm font-semibold text-foreground">
              {t("dashboard.student.results.detail.narrativeSummary")}
            </h5>
          </div>

          <div className="max-h-[240px] overflow-y-auto pr-1 text-sm leading-7 text-muted-foreground whitespace-pre-wrap break-words">
            {narrativeSummary}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card/60 p-5">
        <div className="mb-4 flex items-center gap-2">
          <L.ListTree className="h-4 w-4 text-primary" />
          <h4 className="text-sm font-semibold text-foreground">
            {t("dashboard.student.results.detail.allScores")}
          </h4>
        </div>

        <div className="space-y-3">
          {chartData.map((item) => (
            <div
              key={item.key}
              className="rounded-2xl border border-border/50 bg-secondary/15 p-3"
            >
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="text-sm text-foreground">
                  {item.fullLabel}
                </span>
                <span className="text-sm font-bold text-primary">
                  {item.value}%
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{
                    width: `${Math.max(0, Math.min(100, item.value))}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
