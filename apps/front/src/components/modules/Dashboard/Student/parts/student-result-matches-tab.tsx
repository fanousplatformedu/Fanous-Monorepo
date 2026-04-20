"use client";

import { StudentResultMatchCard } from "@modules/Dashboard/Student/parts/student-result-matches-card";
import { TStudentResultMatches } from "@/types/modules";
import { useI18n } from "@/hooks/useI18n";

import * as L from "lucide-react";

export const StudentResultMatchesTab = ({
  dominantText,
  matches,
}: TStudentResultMatches) => {
  const { t } = useI18n();

  return (
    <div className="grid gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
      <div className="rounded-2xl border border-border/60 bg-card/60 p-5">
        <div className="mb-4 flex items-center gap-2">
          <L.BriefcaseBusiness className="h-4 w-4 text-primary" />
          <h4 className="text-sm font-semibold text-foreground">
            {t("dashboard.student.results.detail.matchOverview")}
          </h4>
        </div>

        <div className="space-y-3">
          <div className="rounded-2xl border border-border/50 bg-secondary/15 p-4">
            <p className="text-xs text-muted-foreground">
              {t("dashboard.student.results.detail.totalMatches")}
            </p>
            <p className="mt-2 text-2xl font-bold text-foreground">
              {matches?.length ?? 0}
            </p>
          </div>

          <div className="rounded-2xl border border-border/50 bg-secondary/15 p-4">
            <p className="text-xs text-muted-foreground">
              {t("dashboard.student.results.detail.bestFit")}
            </p>
            <p className="mt-2 text-sm font-semibold text-foreground">
              {matches?.[0]?.title ||
                t("dashboard.student.results.detail.noCareerMatches")}
            </p>
          </div>

          <div className="rounded-2xl border border-border/50 bg-secondary/15 p-4">
            <p className="text-xs text-muted-foreground">
              {t("dashboard.student.results.detail.dominant")}
            </p>
            <p className="mt-2 text-sm font-semibold text-foreground">
              {dominantText}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card/60 p-5">
        <div className="mb-4 flex items-center gap-2">
          <L.Sparkles className="h-4 w-4 text-primary" />
          <h4 className="text-sm font-semibold text-foreground">
            {t("dashboard.student.results.detail.careerMatches")}
          </h4>
        </div>

        <div className="max-h-[460px] space-y-3 overflow-y-auto pr-1">
          {matches?.length ? (
            matches.map((item, index) => (
              <StudentResultMatchCard
                title={item.title}
                score={item.score}
                fitReason={item.fitReason}
                key={`${item.title}-${index}`}
                description={item.description}
              />
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-border/60 bg-secondary/10 p-6 text-center">
              <p className="text-sm text-muted-foreground">
                {t("dashboard.student.results.detail.noCareerMatches")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
