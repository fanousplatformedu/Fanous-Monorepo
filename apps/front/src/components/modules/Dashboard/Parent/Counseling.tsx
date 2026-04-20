"use client";

import { useParentRequestCounselingSessionMutation } from "@/lib/redux/api/endpoints/parent.api";
import { useParentCancelCounselingSessionMutation } from "@/lib/redux/api/endpoints/parent.api";
import { useParentCounselingSessionsQuery } from "@/lib/redux/api/endpoints/parent.api";
import { TParentCounselingFilterValues } from "@/types/modules";
import { ParentCounselingRequestDialog } from "@modules/Dashboard/Parent/parts/parent-counseling-request-dialog";
import { ParentCounselingSummaryCards } from "@modules/Dashboard/Parent/parts/parent-counseling-summary-card";
import { ParentCounselingSessionTable } from "@modules/Dashboard/Parent/parts/counseling-session-table";
import { ParentCancelSessionDialog } from "@modules/Dashboard/Parent/parts/parent-cancel-session-dialog";
import { ParentCounselingFilters } from "@modules/Dashboard/Parent/parts/parent-counseling-filter";
import { DashboardLoadingCard } from "@modules/Dashboard/parts/dashboard-loading-card";
import { DashboardEmptyState } from "@modules/Dashboard/parts/dashboard-empty-state";
import { getApiErrorMessage } from "@/utils/function-helper";
import { useMyChildrenQuery } from "@/lib/redux/api/endpoints/parent.api";
import { useMemo, useState } from "react";
import { DashboardSection } from "@modules/Dashboard/parts/dashboard-section";
import { PAGE_SIZE } from "@/utils/constant";
import { useI18n } from "@/hooks/useI18n";
import { Button } from "@ui/button";
import { toast } from "sonner";

import type * as TAPI from "@lib/graphql/generated";
import * as L from "lucide-react";

const defaultFilters: TParentCounselingFilterValues = {
  query: "",
  status: "ALL",
  childId: "ALL",
};

const ParentCounselingPage = () => {
  const { t } = useI18n();

  const [page, setPage] = useState(1);
  const [filters, setFilters] =
    useState<TParentCounselingFilterValues>(defaultFilters);
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null,
  );

  const skip = (page - 1) * PAGE_SIZE;

  // ============== Hooks =============
  const { data: childrenData, isLoading: isChildrenLoading } =
    useMyChildrenQuery({
      take: 100,
      skip: 0,
    });
  const {
    data: sessionsData,
    isLoading: isSessionsLoading,
    isFetching: isSessionsFetching,
  } = useParentCounselingSessionsQuery({
    take: PAGE_SIZE,
    skip,
    query: filters.query.trim() || undefined,
    childId: filters.childId === "ALL" ? undefined : filters.childId,
    status: filters.status === "ALL" ? undefined : filters.status,
  });
  const [requestSession, { isLoading: isRequesting }] =
    useParentRequestCounselingSessionMutation();
  const [cancelSession, { isLoading: isCancelling }] =
    useParentCancelCounselingSessionMutation();

  // =============== Use Memo ================
  const childOptions = useMemo(() => {
    const items = childrenData?.items ?? [];
    return items.map((child) => ({
      value: child.id,
      label: child.fullName || child.email || child.mobile || child.id,
    }));
  }, [childrenData]);
  const sessions = useMemo(() => sessionsData?.items ?? [], [sessionsData]);
  const total = sessionsData?.total ?? 0;
  const requestedCount = useMemo(
    () => sessions.filter((item) => item.status === "REQUESTED").length,
    [sessions],
  );
  const confirmedCount = useMemo(
    () => sessions.filter((item) => item.status === "CONFIRMED").length,
    [sessions],
  );
  const completedCount = useMemo(
    () => sessions.filter((item) => item.status === "COMPLETED").length,
    [sessions],
  );

  // ============== Request Handler =============
  const handleRequestSession = async (
    values: TAPI.ParentRequestSessionInput,
  ) => {
    try {
      const response = await requestSession(values).unwrap();
      toast.success(
        response.message ||
          t("dashboard.parent.counseling.toasts.requestSuccess"),
      );
      setRequestDialogOpen(false);
      setPage(1);
    } catch (error: unknown) {
      toast.error(
        getApiErrorMessage(
          error,
          t("dashboard.parent.counseling.toasts.requestFailed"),
        ),
      );
    }
  };

  // =============== Open Handler =================
  const handleOpenCancel = (sessionId: string) => {
    setSelectedSessionId(sessionId);
    setCancelDialogOpen(true);
  };

  // ================ Cancel Handler ==============
  const handleConfirmCancel = async () => {
    if (!selectedSessionId) return;
    try {
      const response = await cancelSession({
        sessionId: selectedSessionId,
      }).unwrap();
      toast.success(
        response?.message ||
          t("dashboard.parent.counseling.toasts.cancelSuccess"),
      );
      setCancelDialogOpen(false);
      setSelectedSessionId(null);
    } catch (error: unknown) {
      toast.error(
        getApiErrorMessage(
          error,
          t("dashboard.parent.counseling.toasts.cancelFailed"),
        ),
      );
    }
  };

  // ================== Guards =================
  if (isChildrenLoading || isSessionsLoading)
    return <DashboardLoadingCard rows={8} />;

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="flex-1">
            <ParentCounselingSummaryCards
              requestedCount={requestedCount}
              confirmedCount={confirmedCount}
              completedCount={completedCount}
            />
          </div>

          <div className="xl:w-auto">
            <Button
              type="button"
              variant="brand"
              disabled={!childOptions.length}
              className="w-full rounded-2xl xl:w-auto"
              onClick={() => setRequestDialogOpen(true)}
            >
              <L.CalendarPlus2 className="mr-2 h-4 w-4" />
              {t("dashboard.parent.counseling.actions.requestSession")}
            </Button>
          </div>
        </div>

        <DashboardSection
          title={t("dashboard.parent.counseling.filtersCard.title")}
          description={t("dashboard.parent.counseling.filtersCard.description")}
        >
          <ParentCounselingFilters
            value={filters}
            childOptions={childOptions}
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

        {!sessions.length ? (
          <DashboardEmptyState
            icon={L.MessagesSquare}
            title={t("dashboard.parent.counseling.empty.title")}
            description={t("dashboard.parent.counseling.empty.description")}
          />
        ) : (
          <ParentCounselingSessionTable
            page={page}
            total={total}
            items={sessions}
            onPageChange={setPage}
            isFetching={isSessionsFetching}
            onCancelSession={handleOpenCancel}
          />
        )}
      </div>

      <ParentCounselingRequestDialog
        open={requestDialogOpen}
        isLoading={isRequesting}
        childOptions={childOptions}
        onSubmit={handleRequestSession}
        onOpenChange={setRequestDialogOpen}
      />

      <ParentCancelSessionDialog
        open={cancelDialogOpen}
        isLoading={isCancelling}
        onConfirm={handleConfirmCancel}
        onOpenChange={(open) => {
          setCancelDialogOpen(open);
          if (!open) setSelectedSessionId(null);
        }}
      />
    </>
  );
};

export default ParentCounselingPage;
