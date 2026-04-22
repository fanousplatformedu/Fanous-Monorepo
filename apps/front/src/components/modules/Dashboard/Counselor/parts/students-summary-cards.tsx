"use client";

import { TStudentsSummaryCard } from "@/types/modules";
import { DashboardSection } from "@modules/Dashboard/parts/dashboard-section";
import { useI18n } from "@/hooks/useI18n";

import * as L from "lucide-react";

export const CounselorStudentsSummaryCards = ({
  total,
  isFetching,
  activeCount,
  visibleCount,
  archivedCount,
}: TStudentsSummaryCard) => {
  const { t } = useI18n();

  const cards = [
    {
      key: "total",
      value: total,
      icon: L.UsersRound,
      title: t("dashboard.counselor.student.summary.total.title"),
      description: t("dashboard.counselor.student.summary.total.description"),
    },
    {
      key: "visible",
      value: visibleCount,
      icon: L.List,
      title: t("dashboard.counselor.student.summary.visible.title"),
      description: t("dashboard.counselor.student.summary.visible.description"),
    },
    {
      key: "active",
      value: activeCount,
      icon: L.UserCheck2,
      title: t("dashboard.counselor.student.summary.active.title"),
      description: t("dashboard.counselor.student.summary.active.description"),
    },
    {
      key: "archived",
      value: archivedCount,
      icon: L.Archive,
      title: t("dashboard.counselor.student.summary.archived.title"),
      description: t(
        "dashboard.counselor.student.summary.archived.description",
      ),
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <DashboardSection
            key={card.key}
            title={card.title}
            description={card.description}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-3xl font-bold text-foreground">
                  {card.value}
                </p>
                {isFetching ? (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {t("common.refreshing")}
                  </p>
                ) : null}
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/30">
                <Icon className="h-5 w-5 text-primary" />
              </div>
            </div>
          </DashboardSection>
        );
      })}
    </div>
  );
};
