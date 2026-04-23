"use client";

import { TAssignmentSummaryCards } from "@/types/modules";
import { LocalSummaryCard } from "@elements/summary-cards";
import { useI18n } from "@/hooks/useI18n";

import * as L from "lucide-react";

export const CounselorAssignmentsSummaryCards = ({
  total,
  isFetching,
  reviewedCount,
  publishedCount,
  pendingReviewsCount,
}: TAssignmentSummaryCards) => {
  const { t } = useI18n();

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <LocalSummaryCard
        value={total}
        icon={L.FileText}
        isFetching={isFetching}
        title={t("dashboard.counselor.assignments.summary.total")}
      />

      <LocalSummaryCard
        icon={L.BadgeCheck}
        value={publishedCount}
        isFetching={isFetching}
        title={t("dashboard.counselor.assignments.summary.published")}
      />

      <LocalSummaryCard
        icon={L.Clock3}
        isFetching={isFetching}
        value={pendingReviewsCount}
        title={t("dashboard.counselor.assignments.summary.pendingReviews")}
      />

      <LocalSummaryCard
        icon={L.SearchCheck}
        value={reviewedCount}
        isFetching={isFetching}
        title={t("dashboard.counselor.assignments.summary.reviewed")}
      />
    </div>
  );
};
