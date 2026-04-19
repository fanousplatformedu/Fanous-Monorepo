"use client";

import { TStudentAssignmentFilterValues } from "@/types/modules";
import { StudentAssignmentDetailDialog } from "@modules/Dashboard/Student/parts/assignment-detail-dialog";
import { StudentAssignmentFilters } from "@modules/Dashboard/Student/parts/assignment-filter";
import { StudentAssignmentTable } from "@modules/Dashboard/Student/parts/assignment-table";
import { DashboardLoadingCard } from "@modules/Dashboard/parts/dashboard-loading-card";
import { DashboardEmptyState } from "@modules/Dashboard/parts/dashboard-empty-state";
import { getApiErrorMessage } from "@/utils/function-helper";
import { useMemo, useState } from "react";
import { DashboardSection } from "@modules/Dashboard/parts/dashboard-section";
import { PAGE_SIZE } from "@/utils/constant";
import { useI18n } from "@/hooks/useI18n";
import { toast } from "sonner";

import * as StudentAPI from "@/lib/redux/api/endpoints/student.api";
import * as L from "lucide-react";

const defaultFilters: TStudentAssignmentFilterValues = {
  query: "",
  status: "ALL",
};

const StudentAssignmentsPage = () => {
  const { t } = useI18n();

  const [page, setPage] = useState<number>(1);
  const [filters, setFilters] =
    useState<TStudentAssignmentFilterValues>(defaultFilters);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<
    string | null
  >(null);

  const skip = (page - 1) * PAGE_SIZE;

  const { data, isLoading, isFetching } = StudentAPI.useMyAssignmentsQuery({
    take: PAGE_SIZE,
    skip,
    query: filters.query.trim() || undefined,
    status: filters.status === "ALL" ? undefined : filters.status,
  });

  const {
    data: detail,
    isLoading: isDetailLoading,
    isFetching: isDetailFetching,
    refetch: refetchDetail,
  } = StudentAPI.useMyAssignmentDetailQuery(selectedAssignmentId ?? "", {
    skip: !selectedAssignmentId,
  });

  const [submitAssignmentAnswers, { isLoading: isSubmitting }] =
    StudentAPI.useSubmitAssignmentAnswersMutation();

  const items = useMemo(() => data?.items ?? [], [data]);
  const total = data?.total ?? 0;

  const pendingCount = useMemo(
    () =>
      items.filter(
        (item) => item.status === "PENDING" || item.status === "NOT_STARTED",
      ).length,
    [items],
  );

  const inProgressCount = useMemo(
    () => items.filter((item) => item.status === "IN_PROGRESS").length,
    [items],
  );

  const evaluatedCount = useMemo(
    () => items.filter((item) => item.status === "EVALUATED").length,
    [items],
  );

  const handleOpenDetail = (studentAssignmentId: string) => {
    setSelectedAssignmentId(studentAssignmentId);
  };

  const handleDialogOpenChange = (open: boolean) => {
    if (!open) setSelectedAssignmentId(null);
  };

  const handleSubmitAnswers = async (
    values: Array<{ questionNumber: number; value: number }>,
  ) => {
    if (!selectedAssignmentId) return;
    try {
      const response = await submitAssignmentAnswers({
        studentAssignmentId: selectedAssignmentId,
        answers: values,
      }).unwrap();
      toast.success(
        response.message ||
          t("dashboard.student.assignments.toasts.submitSuccess"),
      );
      await refetchDetail();
    } catch (error: unknown) {
      toast.error(
        getApiErrorMessage(
          error,
          t("dashboard.student.assignments.toasts.submitFailed"),
        ),
      );
    }
  };

  if (isLoading) return <DashboardLoadingCard rows={8} />;

  return (
    <>
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <DashboardSection
            title={t("dashboard.student.assignments.kpis.pending.title")}
            description={String(pendingCount)}
          >
            <></>
          </DashboardSection>

          <DashboardSection
            title={t("dashboard.student.assignments.kpis.inProgress.title")}
            description={String(inProgressCount)}
          >
            <></>
          </DashboardSection>

          <DashboardSection
            title={t("dashboard.student.assignments.kpis.evaluated.title")}
            description={String(evaluatedCount)}
          >
            <></>
          </DashboardSection>
        </div>

        <DashboardSection
          title={t("dashboard.student.assignments.filtersCard.title")}
          description={t(
            "dashboard.student.assignments.filtersCard.description",
          )}
        >
          <StudentAssignmentFilters
            value={filters}
            onApply={(nextFilters) => {
              setPage(1);
              setFilters(nextFilters);
            }}
            onReset={() => {
              setPage(1);
              setFilters(defaultFilters);
            }}
          />
        </DashboardSection>

        {!items.length ? (
          <DashboardEmptyState
            icon={L.NotebookPen}
            title={t("dashboard.student.assignments.empty.title")}
            description={t("dashboard.student.assignments.empty.description")}
          />
        ) : (
          <StudentAssignmentTable
            page={page}
            items={items}
            total={total}
            isFetching={isFetching}
            onPageChange={setPage}
            onViewDetail={handleOpenDetail}
          />
        )}
      </div>

      <StudentAssignmentDetailDialog
        assignment={detail ?? null}
        isSubmitting={isSubmitting}
        open={Boolean(selectedAssignmentId)}
        onOpenChange={handleDialogOpenChange}
        onSubmitAnswers={handleSubmitAnswers}
        isLoading={isDetailLoading || isDetailFetching}
      />
    </>
  );
};

export default StudentAssignmentsPage;
