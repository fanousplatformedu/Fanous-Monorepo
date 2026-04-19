"use client";

import { TStudentCounselingFilterValues } from "@/types/modules";
import { StudentCounselingFilters } from "@modules/Dashboard/Student/parts/counseling-filters";
import { RequestCounselingDialog } from "@modules/Dashboard/Student/parts/request-counseling-dialog";
import { TStudentCounselingItem } from "@/types/modules";
import { StudentCounselingTable } from "@modules/Dashboard/Student/parts/counseling-table";
import { CancelCounselingDialog } from "@modules/Dashboard/Student/parts/cancel-counseling-dialog";
import { DashboardLoadingCard } from "@modules/Dashboard/parts/dashboard-loading-card";
import { DashboardEmptyState } from "@modules/Dashboard/parts/dashboard-empty-state";
import { getApiErrorMessage } from "@/utils/function-helper";
import { useMemo, useState } from "react";
import { DashboardSection } from "@modules/Dashboard/parts/dashboard-section";
import { PAGE_SIZE } from "@/utils/constant";
import { useI18n } from "@/hooks/useI18n";
import { Button } from "@ui/button";
import { toast } from "sonner";

import * as TAPI from "@/lib/redux/api/endpoints/student.api";
import * as L from "lucide-react";

const defaultFilters: TStudentCounselingFilterValues = {
  query: "",
  status: "ALL",
};

const StudentCounselingPage = () => {
  const { t } = useI18n();

  const [page, setPage] = useState<number>(1);
  const [filters, setFilters] =
    useState<TStudentCounselingFilterValues>(defaultFilters);

  const [requestOpen, setRequestOpen] = useState(false);
  const [cancelTarget, setCancelTarget] =
    useState<TStudentCounselingItem | null>(null);

  const skip = (page - 1) * PAGE_SIZE;

  const { data, isLoading, isFetching } = TAPI.useMyCounselingSessionsQuery({
    take: PAGE_SIZE,
    skip,
    query: filters.query.trim() || undefined,
    status: filters.status === "ALL" ? undefined : filters.status,
  });

  const [requestCounselingSession, { isLoading: isRequesting }] =
    TAPI.useRequestCounselingSessionMutation();

  const [cancelCounselingSession, { isLoading: isCanceling }] =
    TAPI.useCancelCounselingSessionMutation();

  const items = useMemo(() => data?.items ?? [], [data]);
  const total = data?.total ?? 0;

  const requestedCount = useMemo(
    () => items.filter((item) => item.status === "REQUESTED").length,
    [items],
  );

  const confirmedCount = useMemo(
    () => items.filter((item) => item.status === "CONFIRMED").length,
    [items],
  );

  const completedCount = useMemo(
    () => items.filter((item) => item.status === "COMPLETED").length,
    [items],
  );

  const handleRequestSession = async (values: {
    title: string;
    note?: string;
    meetingUrl?: string;
    scheduledAt?: string;
    counselorId?: string;
  }) => {
    try {
      const response = await requestCounselingSession({
        title: values.title,
        note: values.note?.trim() || undefined,
        meetingUrl: values.meetingUrl?.trim() || undefined,
        scheduledAt: values.scheduledAt || undefined,
        counselorId: values.counselorId?.trim() || undefined,
      }).unwrap();
      toast.success(
        response?.title
          ? t("dashboard.student.counseling.toasts.requestSuccess")
          : t("dashboard.student.counseling.toasts.requestSuccess"),
      );
      setRequestOpen(false);
    } catch (error: unknown) {
      toast.error(
        getApiErrorMessage(
          error,
          t("dashboard.student.counseling.toasts.requestFailed"),
        ),
      );
    }
  };

  const handleCancelSession = async (reason?: string) => {
    if (!cancelTarget) return;
    try {
      const response = await cancelCounselingSession({
        sessionId: cancelTarget.id,
        reason: reason?.trim() || undefined,
      }).unwrap();
      toast.success(
        response.message ||
          t("dashboard.student.counseling.toasts.cancelSuccess"),
      );
      setCancelTarget(null);
    } catch (error: unknown) {
      toast.error(
        getApiErrorMessage(
          error,
          t("dashboard.student.counseling.toasts.cancelFailed"),
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
            title={t("dashboard.student.counseling.kpis.requested.title")}
            description={t(
              "dashboard.student.counseling.kpis.requested.description",
            )}
          >
            <p className="text-3xl font-bold text-foreground">
              {requestedCount}
            </p>
          </DashboardSection>

          <DashboardSection
            title={t("dashboard.student.counseling.kpis.confirmed.title")}
            description={t(
              "dashboard.student.counseling.kpis.confirmed.description",
            )}
          >
            <p className="text-3xl font-bold text-foreground">
              {confirmedCount}
            </p>
          </DashboardSection>

          <DashboardSection
            title={t("dashboard.student.counseling.kpis.completed.title")}
            description={t(
              "dashboard.student.counseling.kpis.completed.description",
            )}
          >
            <p className="text-3xl font-bold text-foreground">
              {completedCount}
            </p>
          </DashboardSection>
        </div>

        <DashboardSection
          title={t("dashboard.student.counseling.actionsCard.title")}
          description={t(
            "dashboard.student.counseling.actionsCard.description",
          )}
        >
          <div className="flex flex-wrap justify-end gap-3">
            <Button
              variant="brand"
              onClick={() => setRequestOpen(true)}
              className="inline-flex items-center justify-center rounded-2xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            >
              {t("dashboard.student.counseling.actions.requestNew")}
            </Button>
          </div>
        </DashboardSection>

        <DashboardSection
          title={t("dashboard.student.counseling.filtersCard.title")}
          description={t(
            "dashboard.student.counseling.filtersCard.description",
          )}
        >
          <StudentCounselingFilters
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
            icon={L.MessagesSquare}
            title={t("dashboard.student.counseling.empty.title")}
            description={t("dashboard.student.counseling.empty.description")}
          />
        ) : (
          <StudentCounselingTable
            page={page}
            items={items}
            total={total}
            isFetching={isFetching}
            onPageChange={setPage}
            onCancelSession={(item) => setCancelTarget(item)}
          />
        )}
      </div>

      <RequestCounselingDialog
        open={requestOpen}
        isSubmitting={isRequesting}
        onOpenChange={setRequestOpen}
        onSubmit={handleRequestSession}
      />

      <CancelCounselingDialog
        target={cancelTarget}
        isSubmitting={isCanceling}
        open={Boolean(cancelTarget)}
        onSubmit={handleCancelSession}
        onOpenChange={(open) => {
          if (!open) setCancelTarget(null);
        }}
      />
    </>
  );
};

export default StudentCounselingPage;
