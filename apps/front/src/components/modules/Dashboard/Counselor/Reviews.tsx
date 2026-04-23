"use client";

import { useReviewStudentAssessmentMutation } from "@/lib/redux/api/endpoints/counselor.api";
import { useStudentAssessmentQueueQuery } from "@/lib/redux/api/endpoints/counselor.api";
import { useCounselorReviewDetailQuery } from "@/lib/redux/api/endpoints/counselor.api";
import { useCounselorAssignmentsQuery } from "@/lib/redux/api/endpoints/counselor.api";
import { CounselorReviewsSummaryCards } from "@modules/Dashboard/Counselor/parts/reviews-summary-cards";
import { CounselorReviewActionDialog } from "@modules/Dashboard/Counselor/parts/reviews-action-dialog";
import { CounselorReviewDetailDialog } from "@modules/Dashboard/Counselor/parts/reviews-detail-dialog";
import { TReviewDetail, TReviewRow } from "@/types/modules";
import { CounselorReviewsFilter } from "@modules/Dashboard/Counselor/parts/reviews-filter";
import { CounselorReviewsTable } from "@modules/Dashboard/Counselor/parts/reviews-table";
import { DashboardLoadingCard } from "@modules/Dashboard/parts/dashboard-loading-card";
import { TReviewFilterValues } from "@/types/modules";
import { DashboardEmptyState } from "@modules/Dashboard/parts/dashboard-empty-state";
import { useMyStudentsQuery } from "@/lib/redux/api/endpoints/counselor.api";
import { getApiErrorMessage } from "@/utils/function-helper";
import { useMemo, useState } from "react";
import { DashboardSection } from "@modules/Dashboard/parts/dashboard-section";
import { PAGE_SIZE } from "@/utils/constant";
import { useI18n } from "@/hooks/useI18n";
import { toast } from "sonner";

import * as L from "lucide-react";

const defaultFilters: TReviewFilterValues = {
  query: "",
  status: "ALL",
  studentId: "ALL",
  assignmentId: "ALL",
};

const CounselorReviewsPage = () => {
  const { t } = useI18n();

  // ================= States ==================
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<TReviewFilterValues>(defaultFilters);
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
  const [actionReviewId, setActionReviewId] = useState<string | null>(null);

  // ================= Api Hooks ===============
  const {
    data: reviewsData,
    isLoading,
    isFetching,
  } = useStudentAssessmentQueueQuery({
    page,
    limit: PAGE_SIZE,
    search: filters.query.trim() || undefined,
    status: filters.status === "ALL" ? undefined : filters.status,
    studentId: filters.studentId === "ALL" ? undefined : filters.studentId,
    assignmentId:
      filters.assignmentId === "ALL" ? undefined : filters.assignmentId,
  });
  const { data: studentsData } = useMyStudentsQuery({
    page: 1,
    limit: 100,
  });
  const { data: assignmentsData } = useCounselorAssignmentsQuery({
    page: 1,
    limit: 100,
  });
  const {
    data: detailData,
    isLoading: isDetailLoading,
    isFetching: isDetailFetching,
  } = useCounselorReviewDetailQuery(selectedReviewId ?? "", {
    skip: !selectedReviewId,
  });
  const {
    data: actionDetailData,
    isLoading: isActionDetailLoading,
    isFetching: isActionDetailFetching,
  } = useCounselorReviewDetailQuery(actionReviewId ?? "", {
    skip: !actionReviewId,
  });
  const [reviewStudentAssessment, { isLoading: isSubmitting }] =
    useReviewStudentAssessmentMutation();

  // ============= Use Memo =============
  const items = useMemo<TReviewRow[]>(
    () =>
      (reviewsData?.items ?? []).map((item) => ({
        status: item.status,
        reviewId: item.reviewId,
        createdAt: item.createdAt,
        studentId: item.studentId,
        studentName: item.studentName,
        resultId: item.resultId ?? null,
        assignmentId: item.assignmentId,
        reviewedAt: item.reviewedAt ?? null,
        assignmentTitle: item.assignmentTitle,
      })),
    [reviewsData],
  );

  const detail = useMemo<TReviewDetail | null>(() => {
    if (!detailData) return null;
    return {
      id: detailData.id,
      status: detailData.status,
      createdAt: detailData.createdAt,
      studentId: detailData.studentId,
      studentName: detailData.studentName,
      resultId: detailData.resultId ?? null,
      feedback: detailData.feedback ?? null,
      assignmentId: detailData.assignmentId,
      reviewedAt: detailData.reviewedAt ?? null,
      assignmentTitle: detailData.assignmentTitle,
      dominantKey: detailData.dominantKey ?? null,
    };
  }, [detailData]);

  const actionDetail = useMemo<TReviewDetail | null>(() => {
    if (!actionDetailData) return null;
    return {
      id: actionDetailData.id,
      status: actionDetailData.status,
      createdAt: actionDetailData.createdAt,
      studentId: actionDetailData.studentId,
      studentName: actionDetailData.studentName,
      assignmentId: actionDetailData.assignmentId,
      feedback: actionDetailData.feedback ?? null,
      resultId: actionDetailData.resultId ?? null,
      reviewedAt: actionDetailData.reviewedAt ?? null,
      assignmentTitle: actionDetailData.assignmentTitle,
      dominantKey: actionDetailData.dominantKey ?? null,
    };
  }, [actionDetailData]);
  const studentOptions = useMemo(
    () =>
      (studentsData?.items ?? []).map((item) => ({
        value: item.id,
        label: item.fullName || item.email || item.mobile || item.id,
      })),
    [studentsData],
  );
  const assignmentOptions = useMemo(
    () =>
      (assignmentsData?.items ?? []).map((item) => ({
        value: item.assignmentId,
        label: item.title,
      })),
    [assignmentsData],
  );
  const total = reviewsData?.total ?? 0;
  const pendingCount = useMemo(
    () => items.filter((item) => item.status === "PENDING").length,
    [items],
  );
  const inReviewCount = useMemo(
    () => items.filter((item) => item.status === "IN_REVIEW").length,
    [items],
  );
  const reviewedCount = useMemo(
    () => items.filter((item) => item.status === "REVIEWED").length,
    [items],
  );
  const returnedCount = useMemo(
    () => items.filter((item) => item.status === "RETURNED").length,
    [items],
  );

  // ============== Submit Review ==============
  const handleSubmitReview = async (values: {
    status: "IN_REVIEW" | "REVIEWED" | "RETURNED";
    feedback: string;
  }) => {
    if (!actionReviewId) return;
    try {
      const response = await reviewStudentAssessment({
        reviewId: actionReviewId,
        status: values.status,
        feedback: values.feedback.trim() || undefined,
      }).unwrap();
      toast.success(
        response.message || t("dashboard.counselor.reviews.toasts.reviewSaved"),
      );
      setActionReviewId(null);
    } catch (error: unknown) {
      toast.error(
        getApiErrorMessage(
          error,
          t("dashboard.counselor.reviews.toasts.reviewFailed"),
        ),
      );
    }
  };

  // ================ Guards =================
  if (isLoading) return <DashboardLoadingCard rows={8} />;

  return (
    <>
      <div className="space-y-6">
        <CounselorReviewsSummaryCards
          total={total}
          isFetching={isFetching}
          pendingCount={pendingCount}
          inReviewCount={inReviewCount}
          reviewedCount={reviewedCount}
          returnedCount={returnedCount}
        />

        <DashboardSection
          title={t("dashboard.counselor.reviews.filtersCard.title")}
          description={t("dashboard.counselor.reviews.filtersCard.description")}
        >
          <CounselorReviewsFilter
            value={filters}
            studentOptions={studentOptions}
            assignmentOptions={assignmentOptions}
            onApply={(nextValues) => {
              setPage(1);
              setFilters(nextValues);
            }}
            onReset={() => {
              setPage(1);
              setFilters(defaultFilters);
            }}
          />
        </DashboardSection>

        {!items.length ? (
          <DashboardEmptyState
            icon={L.ClipboardList}
            title={t("dashboard.counselor.reviews.empty.title")}
            description={t("dashboard.counselor.reviews.empty.description")}
          />
        ) : (
          <CounselorReviewsTable
            page={page}
            total={total}
            items={items}
            onPageChange={setPage}
            isFetching={isFetching}
            onOpenAction={setActionReviewId}
            onViewDetail={setSelectedReviewId}
          />
        )}
      </div>

      <CounselorReviewDetailDialog
        detail={detail}
        open={Boolean(selectedReviewId)}
        isLoading={isDetailLoading || isDetailFetching}
        onReview={() => {
          if (selectedReviewId) setActionReviewId(selectedReviewId);
        }}
        onOpenChange={(open) => {
          if (!open) setSelectedReviewId(null);
        }}
      />

      <CounselorReviewActionDialog
        detail={actionDetail}
        onSubmit={handleSubmitReview}
        open={Boolean(actionReviewId)}
        isLoading={
          isSubmitting || isActionDetailLoading || isActionDetailFetching
        }
        onOpenChange={(open) => {
          if (!open) setActionReviewId(null);
        }}
      />
    </>
  );
};

export default CounselorReviewsPage;
