"use client";

import { TActivityItem, TParentActivitiesFilterValues } from "@/types/modules";
import { useParentChildActivitiesQuery } from "@/lib/redux/api/endpoints/parent.api";
import { ParentActivitiesSummaryCards } from "@modules/Dashboard/Parent/parts/activities-summary-card";
import { ParentActivitiesFilters } from "@modules/Dashboard/Parent/parts/activities-filters";
import { ParentActivitiesTable } from "@modules/Dashboard/Parent/parts/activities-table";
import { DashboardLoadingCard } from "@modules/Dashboard/parts/dashboard-loading-card";
import { DashboardEmptyState } from "@modules/Dashboard/parts/dashboard-empty-state";
import { useMyChildrenQuery } from "@/lib/redux/api/endpoints/parent.api";
import { useMemo, useState } from "react";
import { DashboardSection } from "@modules/Dashboard/parts/dashboard-section";
import { PAGE_SIZE } from "@/utils/constant";
import { useI18n } from "@/hooks/useI18n";

import type * as TAPI from "@lib/graphql/generated";
import * as L from "lucide-react";

const defaultFilters: TParentActivitiesFilterValues = {
  childId: "ALL",
  type: "ALL",
};

const ParentActivitiesPage = () => {
  const { t } = useI18n();

  // =============== States =================
  const [page, setPage] = useState(1);
  const [filters, setFilters] =
    useState<TParentActivitiesFilterValues>(defaultFilters);
  const skip = (page - 1) * PAGE_SIZE;

  // =============== Hooks =================
  const { data: childrenData, isLoading: isChildrenLoading } =
    useMyChildrenQuery({
      take: 100,
      skip: 0,
    });
  const {
    data: activitiesData,
    isLoading: isActivitiesLoading,
    isFetching: isActivitiesFetching,
  } = useParentChildActivitiesQuery({
    take: PAGE_SIZE,
    skip,
    childId: filters.childId === "ALL" ? undefined : filters.childId,
    type: filters.type === "ALL" ? undefined : filters.type,
  } as TAPI.ListParentChildActivitiesInput);

  // ============== Use Memo ================
  const items = useMemo<TActivityItem[]>(
    () => activitiesData?.items ?? [],
    [activitiesData],
  );
  const total = activitiesData?.total ?? 0;
  const childOptions = useMemo(() => {
    const list = childrenData?.items ?? [];
    return list.map((child) => ({
      value: child.id,
      label: child.fullName || child.email || child.mobile || child.id,
    }));
  }, [childrenData]);
  const totalActivities = total;
  const completedAssessments = useMemo(
    () => items.filter((item) => item.type === "ASSESSMENT_COMPLETED").length,
    [items],
  );
  const submittedAssignments = useMemo(
    () => items.filter((item) => item.type === "ASSIGNMENT_SUBMITTED").length,
    [items],
  );
  const sessionsCount = useMemo(
    () =>
      items.filter(
        (item) =>
          item.type === "SESSION_REQUESTED" ||
          item.type === "SESSION_BOOKED" ||
          item.type === "SESSION_COMPLETED",
      ).length,
    [items],
  );

  // =============== Guards ==============
  if (isChildrenLoading || isActivitiesLoading)
    return <DashboardLoadingCard rows={8} />;

  return (
    <div className="space-y-6">
      <ParentActivitiesSummaryCards
        sessionsCount={sessionsCount}
        totalActivities={totalActivities}
        completedAssessments={completedAssessments}
        submittedAssignments={submittedAssignments}
      />

      <DashboardSection
        title={t("dashboard.parent.activities.filtersCard.title")}
        description={t("dashboard.parent.activities.filtersCard.description")}
      >
        <ParentActivitiesFilters
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

      {!items.length ? (
        <DashboardEmptyState
          icon={L.ScrollText}
          title={t("dashboard.parent.activities.empty.title")}
          description={t("dashboard.parent.activities.empty.description")}
        />
      ) : (
        <ParentActivitiesTable
          page={page}
          total={total}
          items={items}
          onPageChange={setPage}
          isFetching={isActivitiesFetching}
        />
      )}
    </div>
  );
};

export default ParentActivitiesPage;
