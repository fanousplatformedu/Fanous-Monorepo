"use client";

import { TCounselorStudentSummaryCards } from "@/types/modules";
import { cardBase } from "@/utils/style";
import { useI18n } from "@/hooks/useI18n";

import * as L from "lucide-react";

export const CounselorStudentsSummaryCards = ({
  total,
  isFetching,
  activeCount,
  archivedCount,
  reviewLoadCount,
}: TCounselorStudentSummaryCards) => {
  const { t } = useI18n();

  const cards = [
    {
      key: "total",
      icon: L.UsersRound,
      label: t("dashboard.counselor.student.summary.total"),
      value: total,
    },
    {
      key: "active",
      icon: L.UserCheck,
      label: t("dashboard.counselor.student.summary.active"),
      value: activeCount,
    },
    {
      key: "archived",
      icon: L.Archive,
      label: t("dashboard.counselor.student.summary.archived"),
      value: archivedCount,
    },
    {
      key: "reviews",
      icon: L.ClipboardList,
      label: t("dashboard.counselor.student.summary.pendingReviews"),
      value: reviewLoadCount,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div key={card.key} className={cardBase}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-muted-foreground">{card.label}</p>
                <p className="mt-2 text-2xl font-bold text-foreground">
                  {card.value}
                </p>
              </div>

              <div className="rounded-2xl border border-border/60 bg-secondary/25 p-3">
                <Icon className="h-5 w-5 text-primary" />
              </div>
            </div>

            {isFetching ? (
              <p className="mt-3 text-xs text-muted-foreground">
                {t("common.refreshing")}
              </p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};
