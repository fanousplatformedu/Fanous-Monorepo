"use client";

import { TCounselorAssignmentsSummaryCards } from "@/types/modules";
import { useI18n } from "@/hooks/useI18n";

import * as L from "lucide-react";

const Card = ({
  icon: Icon,
  title,
  value,
}: {
  icon: L.LucideIcon;
  title: string;
  value: number;
}) => (
  <div className="rounded-[1.75rem] border border-border/60 bg-card/70 p-5 backdrop-blur-2xl">
    <div className="mb-3 flex items-center gap-2 text-muted-foreground">
      <Icon className="h-4 w-4" />
      <span className="text-xs font-medium">{title}</span>
    </div>
    <p className="text-2xl font-bold text-foreground">{value}</p>
  </div>
);

export const CounselorAssignmentsSummaryCards = ({
  total,
  activeCount,
  archivedCount,
  counselorsCount,
}: TCounselorAssignmentsSummaryCards) => {
  const { t } = useI18n();

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Card
        icon={L.Link2}
        title={t(
          "dashboard.schoolAdmin.counselorAssignments.summary.totalAssignments",
        )}
        value={total}
      />
      <Card
        icon={L.BadgeCheck}
        title={t(
          "dashboard.schoolAdmin.counselorAssignments.summary.activeAssignments",
        )}
        value={activeCount}
      />
      <Card
        icon={L.Archive}
        title={t(
          "dashboard.schoolAdmin.counselorAssignments.summary.archivedAssignments",
        )}
        value={archivedCount}
      />
      <Card
        icon={L.UserRound}
        title={t(
          "dashboard.schoolAdmin.counselorAssignments.summary.activeCounselors",
        )}
        value={counselorsCount}
      />
    </div>
  );
};
