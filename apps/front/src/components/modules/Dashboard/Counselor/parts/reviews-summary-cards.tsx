"use client";

import { TReviewSummaryCards } from "@/types/modules";
import { LocalSummaryCard } from "@elements/summary-cards";
import { useI18n } from "@/hooks/useI18n";

import * as L from "lucide-react";

export const CounselorReviewsSummaryCards = ({
  total,
  isFetching,
  pendingCount,
  inReviewCount,
  reviewedCount,
  returnedCount,
}: TReviewSummaryCards) => {
  const { t } = useI18n();

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      <LocalSummaryCard
        value={total}
        icon={L.ClipboardList}
        isFetching={isFetching}
        title={t("dashboard.counselor.reviews.summary.total")}
      />

      <LocalSummaryCard
        icon={L.Clock3}
        value={pendingCount}
        isFetching={isFetching}
        title={t("dashboard.counselor.reviews.summary.pending")}
      />

      <LocalSummaryCard
        icon={L.SearchCheck}
        value={inReviewCount}
        isFetching={isFetching}
        title={t("dashboard.counselor.reviews.summary.inReview")}
      />

      <LocalSummaryCard
        icon={L.BadgeCheck}
        value={reviewedCount}
        isFetching={isFetching}
        title={t("dashboard.counselor.reviews.summary.reviewed")}
      />

      <LocalSummaryCard
        icon={L.RotateCcw}
        value={returnedCount}
        isFetching={isFetching}
        title={t("dashboard.counselor.reviews.summary.returned")}
      />
    </div>
  );
};
