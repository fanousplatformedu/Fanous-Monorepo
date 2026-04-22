"use client";

import { useExportCounselorStudentReportMutation } from "@/lib/redux/api/endpoints/counselor.api";
import { useScheduleCounselorSessionMutation } from "@/lib/redux/api/endpoints/counselor.api";
import { TStudentFilterValues, TStudentRow } from "@/types/modules";
import { useStudentProgressTimelineQuery } from "@/lib/redux/api/endpoints/counselor.api";
import { useCounselorStudentDetailQuery } from "@/lib/redux/api/endpoints/counselor.api";
import { getDetail, getRow, getTimeline } from "@/utils/function-helper";
import { CounselorScheduleSessionDialog } from "@modules/Dashboard/Counselor/parts/schedule-session-dialog";
import { CounselorStudentsSummaryCards } from "@modules/Dashboard/Counselor/parts/students-summary-cards";
import { CounselorStudentDetailDialog } from "@modules/Dashboard/Counselor/parts/student-detail-dialog";
import { CounselorExportReportDialog } from "@modules/Dashboard/Counselor/parts/export-report-dialog";
import { CounselorStudentsFilter } from "@modules/Dashboard/Counselor/parts/students-filter";
import { CounselorStudentsTable } from "@modules/Dashboard/Counselor/parts/students-table";
import { DashboardLoadingCard } from "@modules/Dashboard/parts/dashboard-loading-card";
import { DashboardEmptyState } from "@modules/Dashboard/parts/dashboard-empty-state";
import { useMyStudentsQuery } from "@/lib/redux/api/endpoints/counselor.api";
import { getApiErrorMessage } from "@/utils/function-helper";
import { useMemo, useState } from "react";
import { DashboardSection } from "@modules/Dashboard/parts/dashboard-section";
import { PAGE_SIZE } from "@/utils/constant";
import { useI18n } from "@/hooks/useI18n";
import { toast } from "sonner";

import type * as TAPI from "@lib/graphql/generated";
import * as L from "lucide-react";

const defaultFilters: TStudentFilterValues = {
  query: "",
  status: "ALL",
};

const CounselorStudentPage = () => {
  const { t } = useI18n();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<TStudentFilterValues>(defaultFilters);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null,
  );
  const [scheduleStudentId, setScheduleStudentId] = useState<string | null>(
    null,
  );
  const [exportStudentId, setExportStudentId] = useState<string | null>(null);

  const { data, isLoading, isFetching } = useMyStudentsQuery({
    page,
    limit: PAGE_SIZE,
    search: filters.query.trim() || undefined,
    status: filters.status === "ALL" ? undefined : filters.status,
  });

  const {
    data: detailData,
    isLoading: isDetailLoading,
    isFetching: isDetailFetching,
  } = useCounselorStudentDetailQuery(selectedStudentId ?? "", {
    skip: !selectedStudentId,
  });

  const {
    data: timelineData,
    isLoading: isTimelineLoading,
    isFetching: isTimelineFetching,
  } = useStudentProgressTimelineQuery(
    {
      studentId: selectedStudentId ?? "",
      limit: 12,
    },
    {
      skip: !selectedStudentId,
    },
  );

  const [scheduleSession, { isLoading: isScheduling }] =
    useScheduleCounselorSessionMutation();
  const [exportReport, { isLoading: isExporting }] =
    useExportCounselorStudentReportMutation();
  const items = useMemo<TStudentRow[]>(
    () => (data?.items ?? []).map(getRow),
    [data],
  );

  const total = data?.total ?? 0;
  const detail = useMemo(() => getDetail(detailData ?? null), [detailData]);
  const timeline = useMemo(
    () => getTimeline((timelineData ?? []) as unknown[]),
    [timelineData],
  );
  const activeCount = useMemo(
    () => items.filter((item) => item.status === "ACTIVE").length,
    [items],
  );
  const archivedCount = useMemo(
    () => items.filter((item) => item.status === "ARCHIVED").length,
    [items],
  );

  const handleScheduleSubmit = async (
    values: TAPI.ScheduleCounselorSessionInput,
  ) => {
    try {
      await scheduleSession(values).unwrap();
      toast.success(t("dashboard.counselor.student.toasts.scheduleSuccess"));
      setScheduleStudentId(null);
    } catch (error: unknown) {
      toast.error(
        getApiErrorMessage(
          error,
          t("dashboard.counselor.student.toasts.scheduleFailed"),
        ),
      );
    }
  };

  const handleExportSubmit = async (
    values: TAPI.ExportCounselorStudentReportInput,
  ) => {
    try {
      const response = await exportReport(values).unwrap();
      toast.success(
        response?.fileName
          ? t("dashboard.counselor.student.toasts.exportSuccessWithFile", {
              file: response.fileName,
            })
          : t("dashboard.counselor.student.toasts.exportSuccess"),
      );
      setExportStudentId(null);
    } catch (error: unknown) {
      toast.error(
        getApiErrorMessage(
          error,
          t("dashboard.counselor.student.toasts.exportFailed"),
        ),
      );
    }
  };

  if (isLoading) return <DashboardLoadingCard rows={8} />;

  return (
    <>
      <div className="space-y-6">
        <CounselorStudentsSummaryCards
          total={total}
          isFetching={isFetching}
          activeCount={activeCount}
          visibleCount={items.length}
          archivedCount={archivedCount}
        />

        <DashboardSection
          title={t("dashboard.counselor.student.filtersCard.title")}
          description={t("dashboard.counselor.student.filtersCard.description")}
        >
          <CounselorStudentsFilter
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
            icon={L.UsersRound}
            title={t("dashboard.counselor.student.empty.title")}
            description={t("dashboard.counselor.student.empty.description")}
          />
        ) : (
          <CounselorStudentsTable
            page={page}
            items={items}
            total={total}
            onPageChange={setPage}
            isFetching={isFetching}
            onViewDetail={setSelectedStudentId}
            onExport={(studentId) => setExportStudentId(studentId)}
            onSchedule={(studentId) => setScheduleStudentId(studentId)}
          />
        )}
      </div>

      <CounselorStudentDetailDialog
        open={Boolean(selectedStudentId)}
        student={detail}
        timeline={timeline}
        isLoading={
          isDetailLoading ||
          isDetailFetching ||
          isTimelineLoading ||
          isTimelineFetching
        }
        onOpenChange={(open) => {
          if (!open) setSelectedStudentId(null);
        }}
        onSchedule={() => {
          if (selectedStudentId) setScheduleStudentId(selectedStudentId);
        }}
        onExport={() => {
          if (selectedStudentId) setExportStudentId(selectedStudentId);
        }}
      />

      <CounselorScheduleSessionDialog
        isLoading={isScheduling}
        studentId={scheduleStudentId}
        onSubmit={handleScheduleSubmit}
        open={Boolean(scheduleStudentId)}
        onOpenChange={(open) => {
          if (!open) setScheduleStudentId(null);
        }}
      />

      <CounselorExportReportDialog
        isLoading={isExporting}
        studentId={exportStudentId}
        onSubmit={handleExportSubmit}
        open={Boolean(exportStudentId)}
        onOpenChange={(open) => {
          if (!open) setExportStudentId(null);
        }}
      />
    </>
  );
};

export default CounselorStudentPage;
