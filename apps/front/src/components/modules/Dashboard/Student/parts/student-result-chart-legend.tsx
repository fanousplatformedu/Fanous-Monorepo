"use client";

import { TChartRow } from "@/types/modules";
import { useI18n } from "@/hooks/useI18n";

import * as L from "lucide-react";

export const StudentResultChartLegend = ({ data }: { data: TChartRow[] }) => {
  const { t } = useI18n();

  return (
    <div className="rounded-2xl border border-border/60 bg-card/60 p-4">
      <div className="mb-4 flex items-center gap-2">
        <L.BadgeInfo className="h-4 w-4 text-primary" />
        <h4 className="text-sm font-semibold text-foreground">
          {t("dashboard.student.results.detail.chartLegend")}
        </h4>
      </div>

      <div className="space-y-3">
        {data.map((item) => (
          <div
            key={item.key}
            className="rounded-xl border border-border/50 bg-secondary/15 px-4 py-3"
          >
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="text-xs font-medium uppercase tracking-wide text-primary">
                {item.shortLabel}
              </span>
              <span className="text-sm font-bold text-foreground">
                {item.value}%
              </span>
            </div>

            <p className="text-sm text-muted-foreground">{item.fullLabel}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
