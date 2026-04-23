"use client";

import { CounselorAssignmentsSummaryCards } from "@modules/Dashboard/Counselor/parts/assignment-summary-cards";
import { useCounselorAssignmentsQuery } from "@/lib/redux/api/endpoints/counselor.api";
import { CounselorAssignmentsFilter } from "@modules/Dashboard/Counselor/parts/assignments-filters";
import { CounselorAssignmentsTable } from "@modules/Dashboard/Counselor/parts/assignments-table";
import { TAssignmentFilterValues } from "@/types/modules";
import { TCounselorAssignmentRow } from "@/types/modules";
import { DashboardLoadingCard } from "@modules/Dashboard/parts/dashboard-loading-card";
import { DashboardEmptyState } from "@modules/Dashboard/parts/dashboard-empty-state";
import { useMyStudentsQuery } from "@/lib/redux/api/endpoints/counselor.api";
import { useMemo, useState } from "react";
import { DashboardSection } from "@modules/Dashboard/parts/dashboard-section";
import { PAGE_SIZE } from "@/utils/constant";
import { useI18n } from "@/hooks/useI18n";

import * as L from "lucide-react";

const defaultFilters: TAssignmentFilterValues = {
  query: "",
  studentId: "ALL",
};

const CounselorAssignmentsPage = () => {
  const { t } = useI18n();

  // =============== States ================
  const [page, setPage] = useState(1);
  const [filters, setFilters] =
    useState<TAssignmentFilterValues>(defaultFilters);

  // =============== Api Hooks ================
  const { data: studentsData, isLoading: isStudentsLoading } =
    useMyStudentsQuery({
      page: 1,
      limit: 100,
    });
  const {
    data: assignmentsData,
    isLoading: isAssignmentsLoading,
    isFetching: isAssignmentsFetching,
  } = useCounselorAssignmentsQuery({
    page,
    limit: PAGE_SIZE,
    search: filters.query.trim() || undefined,
    studentId: filters.studentId === "ALL" ? undefined : filters.studentId,
  });

  // =============== Use Memo ==============
  const studentOptions = useMemo(
    () =>
      (studentsData?.items ?? []).map((item) => ({
        value: item.id,
        label: item.fullName || item.email || item.mobile || item.id,
      })),
    [studentsData],
  );
  const items = useMemo<TCounselorAssignmentRow[]>(
    () =>
      (assignmentsData?.items ?? []).map((item) => ({
        title: item.title,
        dueAt: item.dueAt ?? null,
        status: item.status,
        assignmentId: item.assignmentId,
        publishedAt: item.publishedAt ?? null,
        reviewedCount: item.reviewedCount,
        pendingReviews: item.pendingReviews,
        totalAssignedStudents: item.totalAssignedStudents,
      })),
    [assignmentsData],
  );

  const total = assignmentsData?.total ?? 0;
  const publishedCount = useMemo(
    () => items.filter((item) => item.status === "PUBLISHED").length,
    [items],
  );
  const pendingReviewsCount = useMemo(
    () => items.reduce((sum, item) => sum + item.pendingReviews, 0),
    [items],
  );
  const reviewedCount = useMemo(
    () => items.reduce((sum, item) => sum + item.reviewedCount, 0),
    [items],
  );

  // ================ Guards ================
  if (isStudentsLoading || isAssignmentsLoading)
    return <DashboardLoadingCard rows={8} />;

  return (
    <div className="space-y-6">
      <CounselorAssignmentsSummaryCards
        total={total}
        reviewedCount={reviewedCount}
        publishedCount={publishedCount}
        isFetching={isAssignmentsFetching}
        pendingReviewsCount={pendingReviewsCount}
      />

      <DashboardSection
        title={t("dashboard.counselor.assignments.filtersCard.title")}
        description={t(
          "dashboard.counselor.assignments.filtersCard.description",
        )}
      >
        <CounselorAssignmentsFilter
          value={filters}
          studentOptions={studentOptions}
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
          icon={L.FileText}
          title={t("dashboard.counselor.assignments.empty.title")}
          description={t("dashboard.counselor.assignments.empty.description")}
        />
      ) : (
        <CounselorAssignmentsTable
          page={page}
          total={total}
          items={items}
          onPageChange={setPage}
          isFetching={isAssignmentsFetching}
        />
      )}
    </div>
  );
};

export default CounselorAssignmentsPage;
