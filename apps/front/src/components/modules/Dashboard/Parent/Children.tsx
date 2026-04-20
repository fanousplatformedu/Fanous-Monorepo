"use client";

import { TParentChildrenFilterValues } from "@/types/modules";
import { ParentChildrenSummaryCards } from "@modules/Dashboard/Parent/parts/children-summary-card";
import { useParentChildDetailQuery } from "@/lib/redux/api/endpoints/parent.api";
import { ParentChildDetailDialog } from "@modules/Dashboard/Parent/parts/child-detail-dialog";
import { ParentChildrenFilters } from "@modules/Dashboard/Parent/parts/children-filters";
import { DashboardLoadingCard } from "@modules/Dashboard/parts/dashboard-loading-card";
import { DashboardEmptyState } from "@modules/Dashboard/parts/dashboard-empty-state";
import { ParentChildrenTable } from "@modules/Dashboard/Parent/parts/children-table";
import { useMyChildrenQuery } from "@/lib/redux/api/endpoints/parent.api";
import { useMemo, useState } from "react";
import { DashboardSection } from "@modules/Dashboard/parts/dashboard-section";
import { PAGE_SIZE } from "@/utils/constant";
import { useI18n } from "@/hooks/useI18n";

import type * as TAPI from "@lib/graphql/generated";
import * as L from "lucide-react";

const defaultFilters: TParentChildrenFilterValues = {
  query: "",
  childId: "ALL",
};

const ParentChildrenPage = () => {
  const { t } = useI18n();

  // ================= States ================
  const [page, setPage] = useState(1);
  const [filters, setFilters] =
    useState<TParentChildrenFilterValues>(defaultFilters);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const skip = (page - 1) * PAGE_SIZE;

  // ================= Hooks ================
  const { data, isLoading, isFetching } = useMyChildrenQuery({
    take: PAGE_SIZE,
    skip,
    query: filters.query.trim() || undefined,
    childId: filters.childId === "ALL" ? undefined : filters.childId,
  } as TAPI.ListMyChildrenInput);
  const {
    data: childDetail,
    isLoading: isDetailLoading,
    isFetching: isDetailFetching,
  } = useParentChildDetailQuery(
    selectedChildId
      ? { childId: selectedChildId }
      : ({ childId: "" } as TAPI.ParentChildDetailInput),
    {
      skip: !selectedChildId,
    },
  );

  // ============== Use Memo ================
  const items = useMemo(() => data?.items ?? [], [data]);
  const total = data?.total ?? 0;
  const childrenOptions = useMemo(
    () =>
      items.map((child) => ({
        value: child.id,
        label: child.fullName || child.email || child.mobile || child.id,
      })),
    [items],
  );
  const totalChildren = total;
  const withEmailCount = useMemo(
    () => items.filter((item) => Boolean(item.email)).length,
    [items],
  );
  const withMobileCount = useMemo(
    () => items.filter((item) => Boolean(item.mobile)).length,
    [items],
  );

  if (isLoading) return <DashboardLoadingCard rows={8} />;

  return (
    <>
      <div className="space-y-6">
        <ParentChildrenSummaryCards
          totalChildren={totalChildren}
          withEmailCount={withEmailCount}
          withMobileCount={withMobileCount}
        />

        <DashboardSection
          title={t("dashboard.parent.children.filtersCard.title")}
          description={t("dashboard.parent.children.filtersCard.description")}
        >
          <ParentChildrenFilters
            value={filters}
            childOptions={childrenOptions}
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
            title={t("dashboard.parent.children.empty.title")}
            description={t("dashboard.parent.children.empty.description")}
          />
        ) : (
          <ParentChildrenTable
            page={page}
            total={total}
            items={items}
            onPageChange={setPage}
            isFetching={isFetching}
            onOpenDetail={setSelectedChildId}
          />
        )}
      </div>

      <ParentChildDetailDialog
        child={childDetail ?? null}
        open={Boolean(selectedChildId)}
        isLoading={isDetailLoading || isDetailFetching}
        onOpenChange={(open) => {
          if (!open) setSelectedChildId(null);
        }}
      />
    </>
  );
};

export default ParentChildrenPage;
